import { taxa } from "./avaliacao";
import type { Categoria, DadosPainel, Placar } from "./types";

/** Soma dois placares. */
function somar(a: Placar, b: Placar): Placar {
  return { acertos: a.acertos + b.acertos, total: a.total + b.total, cliques: a.cliques + b.cliques };
}

const VAZIO: Placar = { acertos: 0, total: 0, cliques: 0 };

export interface LinhaResumo {
  chave: string;
  rotulo: string;
  placar: Placar;
  taxa: number;
}

/** Agrega os dados mockados nos três recortes do painel. */
export function resumirPainel(dados: DadosPainel, rotulos: Record<Categoria, string>) {
  const porCategoria = new Map<Categoria, Placar>();

  const porFuncionario: LinhaResumo[] = dados.funcionarios.map((f) => {
    let placar = VAZIO;
    for (const [cat, p] of Object.entries(f.resultados) as [Categoria, Placar][]) {
      placar = somar(placar, p);
      porCategoria.set(cat, somar(porCategoria.get(cat) ?? VAZIO, p));
    }
    return { chave: f.id, rotulo: `${f.nome} · ${f.setor}`, placar, taxa: taxa(placar.acertos, placar.total) };
  });

  const categorias: LinhaResumo[] = [...porCategoria.entries()].map(([cat, placar]) => ({
    chave: cat,
    rotulo: rotulos[cat],
    placar,
    taxa: taxa(placar.acertos, placar.total),
  }));

  const geral = porFuncionario.reduce((acc, l) => somar(acc, l.placar), VAZIO);

  return {
    geral: { ...geral, taxa: taxa(geral.acertos, geral.total) },
    // Ordenamos do pior para o melhor: o gestor vê primeiro onde treinar.
    porCategoria: categorias.sort((a, b) => a.taxa - b.taxa),
    porFuncionario: porFuncionario.sort((a, b) => a.taxa - b.taxa),
  };
}
