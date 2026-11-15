"use client";

import { Check, X } from "lucide-react";
import type { Mensagem, Resposta } from "@/lib/types";
import ChannelBadge from "./ChannelBadge";

interface Props {
  mensagens: Mensagem[];
  respostas: Resposta[];
  selecionada: string;
  onSelecionar: (id: string) => void;
}

/** Lista lateral da caixa de entrada, com o status de cada mensagem. */
export default function InboxList({ mensagens, respostas, selecionada, onSelecionar }: Props) {
  return (
    <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {mensagens.map((m) => {
        const resposta = respostas.find((r) => r.mensagemId === m.id);
        const ativa = m.id === selecionada;
        return (
          <li key={m.id}>
            <button
              onClick={() => onSelecionar(m.id)}
              className={`w-full px-4 py-3 text-left transition ${
                ativa ? "bg-blue-50" : "hover:bg-slate-50"
              } ${resposta ? "opacity-70" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`truncate text-sm ${resposta ? "" : "font-semibold"}`}>
                  {m.remetente.nome}
                </span>
                <span className="shrink-0 text-xs text-slate-500">{m.recebidaEm}</span>
              </div>
              <p className="truncate text-sm text-slate-600">{m.assunto}</p>
              <div className="mt-1 flex items-center gap-2">
                <ChannelBadge canal={m.canal} />
                {resposta && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      resposta.correta ? "text-seguro" : "text-golpe"
                    }`}
                  >
                    {resposta.correta ? <Check aria-hidden className="size-3" /> : <X aria-hidden className="size-3" />}
                    {resposta.correta ? "Acertou" : "Errou"}
                  </span>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
