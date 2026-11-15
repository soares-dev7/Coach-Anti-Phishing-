/**
 * Camada de acesso a dados.
 *
 * Nesta fase tudo vem de arquivos JSON locais. As funções já são `async`
 * de propósito: para trocar por Convex ou Supabase basta reimplementar
 * este arquivo mantendo as mesmas assinaturas — as páginas não mudam.
 */
import type { DadosPainel, Mensagem } from "@/lib/types";
import mensagensJson from "./mensagens.json";
import painelJson from "./painel.json";

const mensagens = mensagensJson as Mensagem[];
const painel = painelJson as DadosPainel;

/** Lista todas as mensagens da caixa de entrada simulada. */
export async function getMensagens(): Promise<Mensagem[]> {
  return mensagens;
}

/** Busca uma mensagem pelo id (ou `undefined` se não existir). */
export async function getMensagem(id: string): Promise<Mensagem | undefined> {
  return mensagens.find((m) => m.id === id);
}

/** Dados agregados do painel do gestor (mockados). */
export async function getPainel(): Promise<DadosPainel> {
  return painel;
}
