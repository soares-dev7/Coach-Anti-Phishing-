import type { Gravidade } from "@/lib/avaliacao";
import { ROTULO_ACAO, ROTULO_GOLPE } from "@/lib/rotulos";
import type { Acao, Mensagem } from "@/lib/types";

/** Título, ícone e cor para cada tipo de resultado. */
const ESTILO: Record<Gravidade, { titulo: string; icone: string; caixa: string }> = {
  acerto: { titulo: "Boa! Você acertou.", icone: "🎉", caixa: "border-green-300 bg-green-50" },
  falso_alarme: {
    titulo: "Falso alarme: esta mensagem era legítima.",
    icone: "🤔",
    caixa: "border-amber-300 bg-amber-50",
  },
  deixou_passar: {
    titulo: "Cuidado: esta mensagem era um golpe.",
    icone: "⚠️",
    caixa: "border-orange-300 bg-orange-50",
  },
  caiu_no_golpe: {
    titulo: "Você caiu no golpe!",
    icone: "🎣",
    caixa: "border-red-300 bg-red-50",
  },
};

interface Props {
  mensagem: Mensagem;
  acao: Acao;
  gravidade: Gravidade;
  explicacao: string;
}

/** Cartão de feedback exibido após cada resposta. */
export default function FeedbackCard({ mensagem, acao, gravidade, explicacao }: Props) {
  const estilo = ESTILO[gravidade];

  return (
    <section className={`rounded-xl border-2 p-6 ${estilo.caixa}`}>
      <p className="text-4xl" aria-hidden>
        {estilo.icone}
      </p>
      <h1 className="mt-2 text-2xl font-bold">{estilo.titulo}</h1>
      <p className="mt-1 text-sm text-slate-700">
        Sua escolha: <strong>{ROTULO_ACAO[acao]}</strong> ·{" "}
        {mensagem.ehGolpe ? (
          <>
            Tipo de golpe: <strong>{ROTULO_GOLPE[mensagem.tipoGolpe!]}</strong>
          </>
        ) : (
          <strong>Mensagem legítima</strong>
        )}
      </p>

      {gravidade === "caiu_no_golpe" && (
        <p className="mt-4 rounded-lg bg-white/70 p-3 text-sm">
          Se fosse real, o link <code className="break-all">{mensagem.link?.urlExibida}</code>{" "}
          poderia roubar seus dados ou os da empresa. Aqui é só um treino: nenhum site externo foi
          aberto e nenhum dado foi coletado.
        </p>
      )}

      <h2 className="mt-6 font-semibold">
        {mensagem.ehGolpe ? "Sinais de golpe nesta mensagem" : "Por que esta mensagem é confiável"}
      </h2>
      <ul className="mt-2 space-y-2">
        {mensagem.sinais.map((sinal) => (
          <li key={sinal} className="flex gap-2 text-sm">
            <span aria-hidden>{mensagem.ehGolpe ? "🚩" : "✅"}</span>
            <span>{sinal}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-6 font-semibold">O que fazer</h2>
      <p className="mt-1 text-sm leading-relaxed">{explicacao}</p>
    </section>
  );
}
