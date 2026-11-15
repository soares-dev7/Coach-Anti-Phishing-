"use client";

/**
 * Registro das respostas do funcionário NO NAVEGADOR (sessionStorage).
 *
 * Por regra de segurança guardamos apenas: id da mensagem, ação escolhida,
 * se acertou e o horário. Nenhum dado pessoal, senha ou dado bancário.
 *
 * Próximo passo: enviar esse mesmo objeto para o back-end (Convex/Supabase)
 * para alimentar o painel do gestor com dados reais.
 */
import type { Resposta } from "@/lib/types";

const CHAVE = "coach-anti-phishing:respostas";

export function listarRespostas(): Resposta[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE) ?? "[]") as Resposta[];
  } catch {
    return [];
  }
}

/** Salva (ou substitui) a resposta de uma mensagem. */
export function registrarResposta(resposta: Resposta): void {
  const outras = listarRespostas().filter((r) => r.mensagemId !== resposta.mensagemId);
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify([...outras, resposta]));
  } catch {
    // Navegação privada ou armazenamento bloqueado: o treino continua sem histórico.
  }
}

export function limparRespostas(): void {
  try {
    sessionStorage.removeItem(CHAVE);
  } catch {
    /* ignorado */
  }
}
