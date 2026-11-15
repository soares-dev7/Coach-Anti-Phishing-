"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { avaliarAcao } from "@/lib/avaliacao";
import { limparRespostas, listarRespostas, registrarResposta } from "@/lib/data/respostas";
import type { Acao, Canal, Mensagem, Resposta } from "@/lib/types";
import InboxList from "./InboxList";
import MessageView from "./MessageView";

type Filtro = "todos" | Canal;

interface Props {
  mensagens: Mensagem[];
  /** Mensagem a abrir primeiro (vem de ?m= na URL, ao voltar do feedback). */
  inicial?: string;
}

/** Caixa de entrada simulada: lista + mensagem aberta + ações. */
export default function Inbox({ mensagens, inicial }: Props) {
  const router = useRouter();
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [selecionada, setSelecionada] = useState(
    mensagens.some((m) => m.id === inicial) ? inicial! : mensagens[0]?.id,
  );

  // sessionStorage só existe no navegador, então lemos depois de montar.
  useEffect(() => setRespostas(listarRespostas()), []);

  const visiveis = useMemo(
    () => mensagens.filter((m) => filtro === "todos" || m.canal === filtro),
    [mensagens, filtro],
  );
  const atual = mensagens.find((m) => m.id === selecionada);
  const acertos = respostas.filter((r) => r.correta).length;

  function responder(acao: Acao) {
    if (!atual) return;
    // Registramos SOMENTE a ação — nenhum dado pessoal.
    registrarResposta({
      mensagemId: atual.id,
      acao,
      correta: avaliarAcao(atual, acao),
      respondidaEm: new Date().toISOString(),
    });
    router.push(`/treino/feedback/${atual.id}?acao=${acao}`);
  }

  function recomecar() {
    limparRespostas();
    setRespostas([]);
    setSelecionada(mensagens[0]?.id);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg bg-slate-200 p-1 text-sm">
          {(["todos", "email", "whatsapp"] as Filtro[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`rounded-md px-3 py-1 font-medium ${
                filtro === f ? "bg-white shadow-sm" : "text-slate-600"
              }`}
            >
              {f === "todos" ? "Todas" : f === "email" ? "E-mail" : "WhatsApp"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span>
            Respondidas: <strong>{respostas.length}</strong>/{mensagens.length} · Acertos:{" "}
            <strong>{acertos}</strong>
          </span>
          {respostas.length > 0 && (
            <button onClick={recomecar} className="text-marca underline">
              Recomeçar
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(260px,1fr)_2fr]">
        <InboxList
          mensagens={visiveis}
          respostas={respostas}
          selecionada={selecionada ?? ""}
          onSelecionar={setSelecionada}
        />
        {atual ? (
          <MessageView key={atual.id} mensagem={atual} onAcao={responder} />
        ) : (
          <p className="text-slate-500">Nenhuma mensagem.</p>
        )}
      </div>
    </div>
  );
}
