/**
 * Tipos centrais do domínio. Toda a aplicação (UI, dados mockados, IA)
 * conversa através destes tipos — trocar a fonte de dados não deve exigir
 * mudanças aqui.
 */

export type Canal = "email" | "whatsapp";

/** Tipos de golpe cobertos no MVP (os mais comuns em PMEs brasileiras). */
export type TipoGolpe =
  | "pix_falso"
  | "boleto_adulterado"
  | "falsa_central"
  | "chefe_falso"
  | "entrega_falsa"
  | "rh_falso";

/** Ações que o funcionário pode tomar. É a ÚNICA coisa que registramos. */
export type Acao = "confiar" | "denunciar" | "clicar";

export interface LinkSimulado {
  /** Texto exibido no botão/link dentro da mensagem. */
  texto: string;
  /** URL apenas exibida (nunca acessada). Domínios fictícios. */
  urlExibida: string;
}

export interface Mensagem {
  id: string;
  canal: Canal;
  remetente: {
    nome: string;
    /** E-mail ou telefone exibido. Sempre fictício. */
    endereco: string;
  };
  /** Assunto (e-mail) ou primeira linha de prévia (WhatsApp). */
  assunto: string;
  corpo: string;
  /** Horário exibido na caixa de entrada, ex.: "09:12". */
  recebidaEm: string;
  link?: LinkSimulado;
  ehGolpe: boolean;
  /** `null` quando a mensagem é legítima. */
  tipoGolpe: TipoGolpe | null;
  /**
   * Se for golpe: sinais de alerta presentes.
   * Se for legítima: sinais que indicam que é confiável.
   */
  sinais: string[];
  /** Explicação curta e didática usada na tela de feedback. */
  explicacao: string;
}

/** Resposta registrada localmente (sem nenhum dado pessoal). */
export interface Resposta {
  mensagemId: string;
  acao: Acao;
  correta: boolean;
  respondidaEm: string;
}

/** Resultado agregado de um funcionário em uma categoria. */
export interface Placar {
  acertos: number;
  total: number;
  /** Quantas vezes clicou no link de um golpe ("caiu"). */
  cliques: number;
}

/** Categoria usada no painel: um tipo de golpe ou mensagens legítimas. */
export type Categoria = TipoGolpe | "legitima";

export interface FuncionarioPainel {
  id: string;
  nome: string;
  setor: string;
  resultados: Partial<Record<Categoria, Placar>>;
}

export interface DadosPainel {
  empresa: string;
  atualizadoEm: string;
  funcionarios: FuncionarioPainel[];
}
