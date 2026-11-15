import Link from "next/link";
import { notFound } from "next/navigation";
import FeedbackCard from "@/components/inbox/FeedbackCard";
import { explicarGolpe } from "@/lib/ai";
import { gravidade } from "@/lib/avaliacao";
import { getMensagem, getMensagens } from "@/lib/data";
import type { Acao } from "@/lib/types";

const ACOES: Acao[] = ["confiar", "denunciar", "clicar"];

/**
 * Tela de feedback de uma mensagem.
 * Também é o destino de todo link simulado (acao=clicar): é aqui que a
 * pessoa vê "Você caiu no golpe" — nunca um site externo.
 */
export default async function FeedbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ acao?: string }>;
}) {
  const [{ id }, { acao: acaoParam }] = await Promise.all([params, searchParams]);
  const mensagem = await getMensagem(id);
  const acao = ACOES.find((a) => a === acaoParam);
  if (!mensagem || !acao) notFound();

  // Com LLM_API_KEY a explicação é personalizada pela IA; sem ela, usa o texto do JSON.
  const explicacao = await explicarGolpe(mensagem, acao);

  // Próxima mensagem da lista (volta para a primeira no fim).
  const todas = await getMensagens();
  const indice = todas.findIndex((m) => m.id === id);
  const proxima = todas[(indice + 1) % todas.length];
  const ultima = indice === todas.length - 1;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <FeedbackCard
        mensagem={mensagem}
        acao={acao}
        gravidade={gravidade(mensagem, acao)}
        explicacao={explicacao}
      />
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/treino?m=${proxima.id}`}
          className="rounded-lg bg-marca px-4 py-2 text-sm font-semibold text-white hover:bg-marca-escura"
        >
          {ultima ? "Voltar ao início da caixa" : "Próxima mensagem →"}
        </Link>
        <Link
          href={`/treino?m=${mensagem.id}`}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
        >
          Rever esta mensagem
        </Link>
      </div>
    </div>
  );
}
