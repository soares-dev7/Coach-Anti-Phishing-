import type { Acao, Categoria, TipoGolpe } from "./types";

/** Nomes amigáveis dos tipos de golpe, usados em toda a interface. */
export const ROTULO_GOLPE: Record<TipoGolpe, string> = {
  pix_falso: "Falso Pix",
  boleto_adulterado: "Boleto adulterado",
  falsa_central: "Falsa central do banco",
  chefe_falso: "Chefe pedindo transferência/gift card",
  entrega_falsa: "Falsa entrega",
  rh_falso: "Falso RH",
};

export const ROTULO_CATEGORIA: Record<Categoria, string> = {
  ...ROTULO_GOLPE,
  legitima: "Mensagens legítimas",
};

export const ROTULO_ACAO: Record<Acao, string> = {
  confiar: "Confiar",
  denunciar: "Denunciar",
  clicar: "Clicar no link",
};
