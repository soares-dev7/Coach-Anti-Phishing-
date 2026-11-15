# 🛡️ Coach Anti-Phishing

> Treino prático contra golpes digitais para funcionários de pequenas e médias empresas brasileiras — dentro de uma caixa de entrada 100% simulada.

Projeto do **Hack Brasil 2026**, trilha **Cibersegurança**.

---

## O problema

Pequenas e médias empresas (PMEs) são alvo diário de golpes por e-mail e WhatsApp: falso Pix, boleto adulterado, falsa central do banco, "chefe" pedindo transferência ou gift card, falsa entrega, falso RH. Basta **um** funcionário clicar no link errado ou pagar um boleto adulterado para gerar prejuízo financeiro ou vazamento de dados.

Essas empresas quase nunca têm equipe de segurança, e os treinamentos de conscientização disponíveis são caros, em inglês, genéricos ou baseados em enviar e-mails falsos reais para os funcionários (o que exige infraestrutura, gera desconfiança e tem riscos próprios).

## A solução

Um **coach** que treina o funcionário com situações realistas **sem sair do app**:

1. O funcionário abre uma **caixa de entrada simulada** (e-mail + WhatsApp) com mensagens legítimas misturadas com golpes comuns no Brasil.
2. Para cada mensagem escolhe: **Confiar**, **Denunciar** ou **Clicar no link**.
3. Recebe **feedback imediato**: acertou ou errou, e quais **sinais de golpe** estavam presentes.
4. O **gestor** acompanha, num painel, a taxa de acerto por pessoa e por tipo de golpe.
5. *(Futuro)* Uma **IA gera novas mensagens** a partir de modelos, para o treino nunca repetir.

## Público-alvo

- **Funcionários** de PMEs brasileiras, especialmente quem lida com financeiro, compras, RH e atendimento.
- **Donos e gestores** de PMEs que querem reduzir o risco de golpes sem contratar uma equipe de segurança.

## Regras de segurança e ética (obrigatórias)

- ❌ **Nunca** pedimos, capturamos ou armazenamos senhas, dados bancários ou dados pessoais reais — nem em simulação. Só registramos a **ação** (confiou / denunciou / clicou).
- ❌ **Nunca** enviamos e-mails ou mensagens reais de golpe. Todo o treino acontece dentro do app.
- 🔗 Links nas mensagens simuladas **não levam a sites externos**: são botões que abrem a tela interna "Você caiu no golpe" com a explicação. As URLs são apenas texto exibido.
- 🏷️ Os golpes usam **marcas fictícias** ("Banco Horizonte", "Entregas Já", "PagaFácil", "Gráfica Ponto Certo", "Distribuidora Aurora"), nunca nomes de bancos ou empresas reais.
- 🤖 Os prompts enviados à IA repetem essas regras (ver `lib/ai.ts`).

## Funcionalidades do MVP

| Funcionalidade | Rota | Status |
|---|---|---|
| Landing page (problema, como funciona, "Começar treino") | `/` | ✅ Pronto |
| Caixa de entrada simulada (e-mail + WhatsApp, filtro por canal) | `/treino` | ✅ Pronto |
| 12 mensagens mockadas (8 golpes cobrindo os 6 tipos + 4 legítimas) | `lib/data/mensagens.json` | ✅ Pronto |
| Ações Confiar / Denunciar / Clicar no link | `/treino` | ✅ Pronto |
| Tela de feedback com sinais de golpe e o que fazer | `/treino/feedback/[id]` | ✅ Pronto |
| Tela "Você caiu no golpe" (destino de todo link simulado) | `/treino/feedback/[id]?acao=clicar` | ✅ Pronto |
| Progresso do treino (respondidas / acertos) na sessão | `/treino` | ✅ Pronto (sessionStorage) |
| Painel do gestor: acerto geral, por tipo de golpe e por funcionário | `/painel` | ✅ Pronto (dados mockados) |
| Explicação personalizada por IA no feedback | `lib/ai.ts` → `explicarGolpe()` | ✅ Pronto (opcional, com fallback) |
| Geração de novas mensagens por IA | `lib/ai.ts` → `gerarMensagem()` | 🟡 Função pronta, ainda não ligada à interface |
| Persistência real das respostas (banco) | — | ⏳ Falta |
| Painel com dados reais do treino | — | ⏳ Falta |
| Login de funcionário / empresa | — | ⏳ Fora do escopo desta fase |

### Regra de acerto

Definida em `lib/avaliacao.ts`:

- **Golpe** → só **Denunciar** é correto. Confiar = deixou passar. Clicar = caiu no golpe (pior caso).
- **Legítima** → **Confiar** é correto; **Clicar** também, se a mensagem tiver link (link legítimo). Denunciar = falso alarme (erro leve).

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + **TypeScript**
- **Tailwind CSS 4**
- Dados mockados em **JSON** (`lib/data/`), atrás de uma camada fácil de trocar por **Convex** ou **Supabase**
- IA opcional via **SDK da Anthropic** (`@anthropic-ai/sdk`), com respostas mockadas quando não há chave
- Deploy pensado para **Vercel**

## Como rodar localmente

Pré-requisitos: **Node.js 20.9+** (testado com Node 22) e npm.

```bash
git clone https://github.com/soares-dev7/Coach-Anti-Phishing-.git
cd Coach-Anti-Phishing-
npm install
cp .env.example .env.local   # opcional: só se for usar IA
npm run dev
```

Acesse <http://localhost:3000>.

Outros comandos:

```bash
npm run build   # build de produção (também verifica os tipos)
npm run start   # sobe o build de produção
```

## Variáveis de ambiente

Todas são **opcionais**. Sem elas o app funciona com respostas mockadas.

| Variável | Descrição | Padrão |
|---|---|---|
| `LLM_API_KEY` | Chave da API da Anthropic (Claude). Ativa a explicação personalizada no feedback e a geração de mensagens. | vazio (modo mock) |
| `LLM_MODEL` | Modelo usado nas chamadas. | `claude-opus-5-5` |

> A chave só é lida no servidor (`lib/ai.ts`), nunca vai para o navegador. Nunca commite o `.env.local`.
> Na Vercel, configure em *Project Settings → Environment Variables*.

## Estrutura de pastas

```
.
├── app/                          # Rotas (Next.js App Router)
│   ├── layout.tsx                # Layout base (cabeçalho e rodapé)
│   ├── globals.css               # Tailwind + cores do produto
│   ├── page.tsx                  # Landing page  (/)
│   ├── treino/
│   │   ├── page.tsx              # Caixa de entrada simulada  (/treino)
│   │   └── feedback/[id]/page.tsx# Feedback / "Você caiu no golpe"
│   └── painel/page.tsx           # Painel do gestor  (/painel)
├── components/
│   ├── Header.tsx
│   ├── inbox/                    # Inbox, InboxList, MessageView, FeedbackCard, ChannelBadge
│   └── painel/                   # StatCard, BarRow
├── lib/
│   ├── types.ts                  # Tipos do domínio (Mensagem, Acao, TipoGolpe…)
│   ├── rotulos.ts                # Nomes amigáveis de golpes e ações
│   ├── avaliacao.ts              # Regra de acerto
│   ├── painel.ts                 # Agregações do painel
│   ├── ai.ts                     # explicarGolpe() e gerarMensagem() (IA opcional)
│   └── data/
│       ├── index.ts              # getMensagens(), getMensagem(), getPainel()  ← trocar por Convex/Supabase
│       ├── respostas.ts          # Registro das ações no navegador (sessionStorage)
│       ├── mensagens.json        # Mensagens simuladas
│       └── painel.json           # Dados de demonstração do painel
├── docs/ROADMAP.md               # Plano até 30/11, por pessoa
├── .env.example
└── LICENSE                       # MIT
```

### Como adicionar uma mensagem nova

Inclua um objeto em `lib/data/mensagens.json` seguindo o tipo `Mensagem` (`lib/types.ts`): `id` único, `canal`, `remetente`, `assunto`, `corpo`, `ehGolpe`, `tipoGolpe` (ou `null`), `sinais` e `explicacao`. O `link` é opcional. Use apenas marcas fictícias.

### Como trocar os dados mockados por um banco

As páginas só usam as funções de `lib/data/index.ts` e `lib/data/respostas.ts`. Reimplemente essas funções com Convex ou Supabase mantendo as mesmas assinaturas e o resto do app não precisa mudar.

## Próximos passos

O plano completo, dividido por pessoa, está em [`docs/ROADMAP.md`](docs/ROADMAP.md). Resumo:

1. **Back-end**: persistir as respostas (Convex ou Supabase) e alimentar o painel com dados reais.
2. **IA**: ligar `gerarMensagem()` à caixa de entrada, com revisão e validação das mensagens geradas.
3. **Front-end**: tela de resumo no fim do treino, acessibilidade e polimento mobile.
4. **Conteúdo/validação**: ampliar o banco de mensagens, testar com funcionários de PMEs reais e medir a melhora.

## Licença

[MIT](LICENSE)
