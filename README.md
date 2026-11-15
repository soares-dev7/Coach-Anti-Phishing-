# Coach Anti-Phishing

Treino contra golpes digitais para funcionários de pequenas e médias empresas brasileiras, feito numa caixa de entrada simulada.

Hack Brasil 2026 · Trilha Cibersegurança

## Problema

PMEs recebem golpes todos os dias por e-mail e WhatsApp: falso Pix, boleto adulterado, falsa central do banco, "chefe" pedindo transferência. Um clique errado de um funcionário já causa prejuízo, e essas empresas quase nunca têm equipe ou orçamento para treinamento de segurança.

## Solução

O funcionário treina dentro do app, sem risco:

1. Abre uma caixa de entrada simulada (e-mail e WhatsApp) com mensagens legítimas e golpes misturados.
2. Escolhe para cada mensagem: **Confiar**, **Denunciar** ou **Clicar no link**.
3. Vê na hora se acertou e quais sinais de golpe estavam ali.
4. O gestor acompanha a taxa de acerto por pessoa e por tipo de golpe.

**Público-alvo:** funcionários de PMEs (principalmente financeiro, compras, RH e atendimento) e os donos/gestores dessas empresas.

## Regras de segurança

- Não pedimos nem guardamos senhas, dados bancários ou dados pessoais. Só registramos a ação escolhida.
- Não enviamos mensagens reais. Os links das mensagens não abrem sites externos: levam à tela interna "Você caiu no golpe".
- Usamos apenas marcas fictícias (Banco Horizonte, Entregas Já, PagaFácil, Distribuidora Aurora).

## Status do MVP

**Pronto**

- Landing page (`/`)
- Caixa de entrada com 12 mensagens: 8 golpes cobrindo 6 tipos e 4 legítimas (`/treino`)
- Tela de feedback com os sinais de golpe (`/treino/feedback/[id]`)
- Painel do gestor com dados de demonstração (`/painel`)
- Explicação por IA no feedback, opcional (sem chave, usa texto pronto)

**Falta**

- Salvar as respostas num banco (hoje ficam só no navegador)
- Painel com dados reais do treino
- Usar a IA para gerar novas mensagens no treino (a função `gerarMensagem()` já existe)

Plano completo, dividido por pessoa: [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, dados em JSON e IA opcional via SDK da Anthropic. Deploy na Vercel.

## Como rodar

Requer Node.js 20.9 ou superior.

```bash
npm install
npm run dev
```

Acesse http://localhost:3000. Para o build de produção: `npm run build`.

## Variáveis de ambiente

Opcionais. Copie `.env.example` para `.env.local`.

| Variável | Para que serve |
|---|---|
| `LLM_API_KEY` | Chave da API da Anthropic. Sem ela, o app usa respostas prontas. |
| `LLM_MODEL` | Modelo usado. Padrão: `claude-opus-5-5`. |

## Estrutura

```
app/            páginas: /, /treino, /treino/feedback/[id], /painel
components/     componentes da caixa de entrada e do painel
lib/types.ts    tipos (Mensagem, Acao, TipoGolpe)
lib/avaliacao.ts regra de acerto
lib/ai.ts       explicarGolpe() e gerarMensagem()
lib/data/       mensagens e dados do painel (trocar aqui por Convex ou Supabase)
docs/           roadmap
```

Para adicionar uma mensagem, inclua um item em `lib/data/mensagens.json` seguindo o tipo `Mensagem`.

## Próximos passos

1. Back-end: guardar as respostas (Convex ou Supabase) e ligar o painel a elas.
2. IA: gerar mensagens novas para o treino, com validação e revisão do gestor.
3. Front-end: resumo no fim do treino, versão mobile e acessibilidade.
4. Conteúdo: chegar a 30+ mensagens e testar com PMEs reais.

## Licença

MIT
