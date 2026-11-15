"use client";

import type { Acao, Mensagem } from "@/lib/types";
import ChannelBadge from "./ChannelBadge";

interface Props {
  mensagem: Mensagem;
  onAcao: (acao: Acao) => void;
}

/**
 * Exibe a mensagem selecionada. O e-mail e o WhatsApp têm visuais
 * diferentes para o treino ficar mais próximo da realidade.
 */
export default function MessageView({ mensagem, onAcao }: Props) {
  const ehWhats = mensagem.canal === "whatsapp";

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white">
      <header className="border-b border-slate-200 p-5">
        <div className="mb-2 flex items-center gap-2">
          <ChannelBadge canal={mensagem.canal} />
          <span className="text-xs text-slate-500">Recebida às {mensagem.recebidaEm}</span>
        </div>
        <h2 className="text-lg font-bold">{mensagem.assunto}</h2>
        <p className="mt-1 text-sm text-slate-600">
          <span className="font-medium text-slate-800">{mensagem.remetente.nome}</span>{" "}
          &lt;{mensagem.remetente.endereco}&gt;
        </p>
      </header>

      <div className={`flex-1 p-5 ${ehWhats ? "bg-[#ece5dd]" : ""}`}>
        <div
          className={
            ehWhats
              ? "max-w-md rounded-lg rounded-tl-none bg-white p-3 shadow-sm"
              : "max-w-none"
          }
        >
          <p className="whitespace-pre-line text-sm leading-relaxed">{mensagem.corpo}</p>

          {mensagem.link && (
            // Link SIMULADO: nunca abre a URL externa, só dispara a ação "clicar",
            // que leva à tela interna de feedback.
            <button
              onClick={() => onAcao("clicar")}
              className="mt-4 inline-block text-left text-sm"
              title={mensagem.link.urlExibida}
            >
              <span className="font-semibold text-blue-700 underline">{mensagem.link.texto}</span>
              <span className="block text-xs text-slate-500">{mensagem.link.urlExibida}</span>
            </button>
          )}
        </div>
      </div>

      <footer className="border-t border-slate-200 p-5">
        <p className="mb-3 text-sm font-medium text-slate-700">O que você faria com esta mensagem?</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onAcao("confiar")}
            className="rounded-lg bg-seguro px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            ✅ Confiar
          </button>
          <button
            onClick={() => onAcao("denunciar")}
            className="rounded-lg bg-golpe px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            🚩 Denunciar
          </button>
          <button
            onClick={() => onAcao("clicar")}
            disabled={!mensagem.link}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            title={mensagem.link ? undefined : "Esta mensagem não tem link"}
          >
            🔗 Clicar no link
          </button>
        </div>
      </footer>
    </article>
  );
}
