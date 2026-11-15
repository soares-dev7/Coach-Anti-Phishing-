import type { LinhaResumo } from "@/lib/painel";

/** Cor da barra conforme a taxa: vermelho (precisa treino), âmbar, verde. */
function corDaTaxa(taxa: number): string {
  if (taxa < 60) return "bg-golpe";
  if (taxa < 80) return "bg-amber-500";
  return "bg-seguro";
}

/** Linha com rótulo, barra horizontal e números (o número sempre visível, não só a cor). */
export default function BarRow({ linha }: { linha: LinhaResumo }) {
  const { rotulo, taxa, placar } = linha;
  return (
    <li className="py-2">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate">{rotulo}</span>
        <span className="shrink-0 tabular-nums">
          <strong>{taxa}%</strong>{" "}
          <span className="text-xs text-slate-500">
            ({placar.acertos}/{placar.total}
            {placar.cliques > 0 && ` · ${placar.cliques} clique${placar.cliques > 1 ? "s" : ""} em golpe`})
          </span>
        </span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-100" role="presentation">
        <div className={`h-2 rounded-full ${corDaTaxa(taxa)}`} style={{ width: `${taxa}%` }} />
      </div>
    </li>
  );
}
