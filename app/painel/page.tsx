import type { Metadata } from "next";
import BarRow from "@/components/painel/BarRow";
import StatCard from "@/components/painel/StatCard";
import { getPainel } from "@/lib/data";
import { resumirPainel } from "@/lib/painel";
import { ROTULO_CATEGORIA } from "@/lib/rotulos";

export const metadata: Metadata = { title: "Painel do gestor · Coach Anti-Phishing" };

export default async function PainelPage() {
  const dados = await getPainel();
  const { geral, porCategoria, porFuncionario } = resumirPainel(dados, ROTULO_CATEGORIA);
  const pontoFraco = porCategoria[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Painel do gestor</h1>
        <p className="text-sm text-slate-600">
          {dados.empresa} · atualizado em{" "}
          {new Date(dados.atualizadoEm + "T12:00:00").toLocaleDateString("pt-BR")} ·{" "}
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">
            dados de demonstração
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard rotulo="Taxa de acerto geral" valor={`${geral.taxa}%`} detalhe={`${geral.acertos} de ${geral.total} respostas`} />
        <StatCard rotulo="Funcionários treinados" valor={String(dados.funcionarios.length)} />
        <StatCard rotulo="Cliques em links de golpe" valor={String(geral.cliques)} detalhe="Seriam incidentes na vida real" />
        <StatCard rotulo="Ponto mais fraco" valor={`${pontoFraco.taxa}%`} detalhe={pontoFraco.rotulo} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Acerto por tipo de golpe</h2>
          <p className="text-xs text-slate-500">Do pior para o melhor — comece o reforço pelo topo.</p>
          <ul className="mt-3 divide-y divide-slate-100">
            {porCategoria.map((l) => (
              <BarRow key={l.chave} linha={l} />
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Acerto por funcionário</h2>
          <p className="text-xs text-slate-500">Inclui mensagens legítimas (falsos alarmes contam como erro).</p>
          <ul className="mt-3 divide-y divide-slate-100">
            {porFuncionario.map((l) => (
              <BarRow key={l.chave} linha={l} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
