/**
 * Integração com LLM (opcional).
 *
 * - Se `LLM_API_KEY` estiver definida, usamos a API da Anthropic (Claude).
 * - Se não estiver, ou se a chamada falhar, devolvemos respostas mockadas.
 *   Assim o app funciona 100% sem IA (ótimo para demo e desenvolvimento).
 *
 * IMPORTANTE: este módulo só deve ser importado em código de servidor
 * (Server Components, Route Handlers), para a chave nunca ir ao navegador.
 */
import Anthropic from "@anthropic-ai/sdk";
import { ROTULO_ACAO, ROTULO_GOLPE } from "./rotulos";
import type { Acao, Mensagem, TipoGolpe } from "./types";

const MODELO = process.env.LLM_MODEL || "claude-opus-5-5";

/** Regras de segurança repetidas em todo prompt enviado ao modelo. */
const REGRAS = `Você apoia um treinamento anti-golpe para funcionários de pequenas e médias empresas brasileiras.
Regras obrigatórias:
- Escreva em português do Brasil, linguagem simples.
- Use apenas marcas e empresas fictícias (ex.: "Banco Horizonte", "Entregas Já", "PagaFácil", "Distribuidora Aurora"). Nunca cite bancos, empresas ou pessoas reais.
- Nunca inclua dados pessoais reais, senhas, números de cartão ou chaves Pix reais.`;

function cliente(): Anthropic | null {
  const apiKey = process.env.LLM_API_KEY;
  return apiKey ? new Anthropic({ apiKey }) : null;
}

/** Faz uma chamada simples e devolve o texto, ou `null` se algo der errado. */
async function chamarModelo(
  prompt: string,
  maxTokens: number,
  formato?: Anthropic.Beta.BetaJSONOutputFormat,
): Promise<string | null> {
  const client = cliente();
  if (!client) return null;

  try {
    const resposta = await client.beta.messages.create({
      model: MODELO,
      max_tokens: maxTokens,
      system: REGRAS,
      // Esforço baixo: são textos curtos e queremos resposta rápida na tela.
      output_config: { effort: "low", ...(formato ? { format: formato } : {}) },
      // Se o modelo recusar, a API tenta automaticamente um modelo alternativo.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      messages: [{ role: "user", content: prompt }],
    });

    if (resposta.stop_reason === "refusal") return null;
    const texto = resposta.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return texto || null;
  } catch (erro) {
    // Qualquer falha (rede, chave inválida, limite) cai no mock: o treino não pode parar.
    console.error("[ai] falha ao chamar o LLM, usando mock:", erro);
    return null;
  }
}

/**
 * Explica, em linguagem simples, por que a mensagem é (ou não) golpe,
 * levando em conta a ação que a pessoa escolheu.
 */
export async function explicarGolpe(mensagem: Mensagem, acao: Acao): Promise<string> {
  const prompt = `Um funcionário recebeu a mensagem abaixo e escolheu "${ROTULO_ACAO[acao]}".
A mensagem ${mensagem.ehGolpe ? `É um golpe do tipo "${ROTULO_GOLPE[mensagem.tipoGolpe!]}"` : "é LEGÍTIMA"}.
Sinais já identificados: ${mensagem.sinais.join("; ")}.

Canal: ${mensagem.canal}
De: ${mensagem.remetente.nome} <${mensagem.remetente.endereco}>
Assunto: ${mensagem.assunto}
${mensagem.corpo}
${mensagem.link ? `Link exibido: ${mensagem.link.urlExibida}` : ""}

Escreva um feedback de no máximo 3 frases, sem julgamentos, dizendo se a escolha foi boa e o que fazer da próxima vez numa situação parecida. Não use markdown.`;

  return (await chamarModelo(prompt, 1024)) ?? mensagem.explicacao;
}

/** Esquema JSON que o modelo deve seguir ao gerar uma nova mensagem. */
const ESQUEMA_MENSAGEM: Anthropic.Beta.BetaJSONOutputFormat = {
  type: "json_schema",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["canal", "remetenteNome", "remetenteEndereco", "assunto", "corpo", "linkTexto", "linkUrlExibida", "sinais", "explicacao"],
    properties: {
      canal: { type: "string", enum: ["email", "whatsapp"] },
      remetenteNome: { type: "string" },
      remetenteEndereco: { type: "string" },
      assunto: { type: "string" },
      corpo: { type: "string" },
      linkTexto: { type: "string", description: "Texto do link; vazio se não houver link" },
      linkUrlExibida: { type: "string", description: "URL fictícia exibida; vazio se não houver link" },
      sinais: { type: "array", items: { type: "string" } },
      explicacao: { type: "string" },
    },
  },
};

interface MensagemGerada {
  canal: "email" | "whatsapp";
  remetenteNome: string;
  remetenteEndereco: string;
  assunto: string;
  corpo: string;
  linkTexto: string;
  linkUrlExibida: string;
  sinais: string[];
  explicacao: string;
}

/**
 * Gera uma nova mensagem de golpe a partir de um tipo, para o treino não repetir.
 * (Ainda não está ligada à interface — ver docs/ROADMAP.md.)
 */
export async function gerarMensagem(tipo: TipoGolpe): Promise<Mensagem> {
  const prompt = `Crie UMA mensagem simulada de golpe do tipo "${ROTULO_GOLPE[tipo]}", realista para o contexto brasileiro, destinada a um funcionário da empresa fictícia "Distribuidora Aurora".
Inclua de 3 a 4 sinais de alerta que um funcionário atento conseguiria perceber, e uma explicação curta de como agir.
Se usar link, use um domínio claramente fictício.`;

  const texto = await chamarModelo(prompt, 4096, ESQUEMA_MENSAGEM);
  if (texto) {
    try {
      const g = JSON.parse(texto) as MensagemGerada;
      return {
        id: `ia-${Date.now()}`,
        canal: g.canal,
        remetente: { nome: g.remetenteNome, endereco: g.remetenteEndereco },
        assunto: g.assunto,
        corpo: g.corpo,
        recebidaEm: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        link: g.linkTexto && g.linkUrlExibida ? { texto: g.linkTexto, urlExibida: g.linkUrlExibida } : undefined,
        ehGolpe: true,
        tipoGolpe: tipo,
        sinais: g.sinais,
        explicacao: g.explicacao,
      };
    } catch (erro) {
      console.error("[ai] resposta do LLM não é um JSON válido, usando mock:", erro);
    }
  }
  return mensagemMock(tipo);
}

/** Mensagem fixa usada quando não há IA disponível. */
function mensagemMock(tipo: TipoGolpe): Mensagem {
  return {
    id: `mock-${tipo}`,
    canal: "whatsapp",
    remetente: { nome: "Contato desconhecido", endereco: "+55 11 9 0000-0000" },
    assunto: `Exemplo gerado (modo sem IA): ${ROTULO_GOLPE[tipo]}`,
    corpo:
      "Olá! Precisamos que você resolva uma pendência URGENTE hoje. Clique no link abaixo e confirme seus dados para evitar bloqueio.",
    recebidaEm: "--:--",
    link: { texto: "Resolver pendência", urlExibida: "https://pendencia-urgente.exemplo/resolver" },
    ehGolpe: true,
    tipoGolpe: tipo,
    sinais: ["Urgência artificial", "Remetente desconhecido", "Pede dados por link", "Ameaça de bloqueio"],
    explicacao: "Mensagem de exemplo gerada sem IA. Configure LLM_API_KEY para gerar variações realistas.",
  };
}
