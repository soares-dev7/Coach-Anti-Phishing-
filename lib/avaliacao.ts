import type { Acao, Mensagem } from "./types";

/**
 * Regra de acerto do treino:
 *
 * - Golpe:      só "denunciar" é correto. "confiar" deixa o golpe passar e
 *               "clicar" é o pior caso (caiu no golpe).
 * - Legítima:   "confiar" é correto. "clicar" também é correto quando a
 *               mensagem tem link (é um link legítimo). "denunciar" conta como
 *               erro (falso alarme), mas é o erro menos grave.
 */
export function avaliarAcao(mensagem: Mensagem, acao: Acao): boolean {
  if (mensagem.ehGolpe) return acao === "denunciar";
  if (acao === "clicar") return Boolean(mensagem.link);
  return acao === "confiar";
}

export type Gravidade = "acerto" | "falso_alarme" | "deixou_passar" | "caiu_no_golpe";

/** Classifica o resultado para escolher título, cor e tom do feedback. */
export function gravidade(mensagem: Mensagem, acao: Acao): Gravidade {
  if (avaliarAcao(mensagem, acao)) return "acerto";
  if (!mensagem.ehGolpe) return "falso_alarme";
  return acao === "clicar" ? "caiu_no_golpe" : "deixou_passar";
}

/** Converte acertos/total em porcentagem inteira (0 quando não há dados). */
export function taxa(acertos: number, total: number): number {
  return total === 0 ? 0 : Math.round((acertos / total) * 100);
}
