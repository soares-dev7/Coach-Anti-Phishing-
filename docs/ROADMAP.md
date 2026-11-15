# Roadmap — Coach Anti-Phishing (até 30/11/2026)

Base inicial entregue em **15/11**: projeto rodando, landing, caixa de entrada simulada, feedback, painel com dados mockados e integração de IA opcional (ver README → "O que está pronto").

## Papéis

| Pessoa | Papel | Dono(a) de |
|---|---|---|
| **P1** | Front-end | `app/`, `components/`, experiência do treino, acessibilidade, mobile |
| **P2** | Back-end | `lib/data/`, banco (Convex ou Supabase), API, deploy na Vercel |
| **P3** | IA | `lib/ai.ts`, prompts, geração e validação de mensagens |
| **P4** | Conteúdo, painel e validação | `mensagens.json`, painel do gestor, testes com usuários, pitch |

> Regras que valem para todos: nada de dados pessoais reais, senhas ou dados bancários; nenhum link externo nas mensagens; só marcas fictícias. Toda PR deve respeitar isso.

## Marcos

| Data | Marco |
|---|---|
| **16/11 (dom)** | Kickoff: todos rodando o projeto, papéis e decisão Convex × Supabase |
| **19/11 (qua)** | Respostas persistidas no banco + deploy de preview na Vercel |
| **22/11 (sáb)** | **MVP integrado**: treino → banco → painel com dados reais; IA gerando mensagens em modo revisão |
| **26/11 (qua)** | Teste com usuários reais (PMEs) e congelamento de funcionalidades |
| **28/11 (sex)** | Correções, polimento, pitch e vídeo prontos |
| **30/11 (dom)** | **Entrega final** |

---

## Semana 1 — 16/11 a 22/11: integrar o fluxo de ponta a ponta

### P1 — Front-end
- [ ] Tela de **resumo ao fim do treino** (acertos por tipo de golpe, dicas para os erros)
- [ ] Indicar mensagens já respondidas e levar automaticamente à próxima não respondida
- [ ] Versão mobile da caixa de entrada (lista → mensagem em telas separadas)
- [ ] Estados de carregamento/erro nas páginas que vão passar a buscar dados no banco
- [ ] Acessibilidade básica: foco visível, navegação por teclado, contraste, `aria-label`s

### P2 — Back-end
- [ ] Decidir **Convex ou Supabase** (critérios: tempo de setup, tier gratuito, integração com Vercel)
- [ ] Modelar tabelas/coleções: `empresas`, `funcionarios` (só nome/apelido e setor), `mensagens`, `respostas` (só ação + acerto + data)
- [ ] Reimplementar `lib/data/index.ts` e `lib/data/respostas.ts` mantendo as assinaturas
- [ ] Identificação simples do funcionário **sem senha** (ex.: código da empresa + apelido) — sem autenticação real nesta fase
- [ ] Deploy de preview na **Vercel** com variáveis de ambiente configuradas

### P3 — IA
- [ ] Testar `explicarGolpe()` com chave real e ajustar tom/tamanho do feedback
- [ ] Criar **modelos (templates)** por tipo de golpe para `gerarMensagem()`: elementos obrigatórios, variações de remetente/canal, sinais esperados
- [ ] Validador automático da saída da IA: marcas da lista de fictícias, sem nomes de bancos/empresas reais, sem dados que pareçam reais (CPF, cartão, chave Pix), domínio de link fictício
- [ ] Rota de servidor `/api/gerar` (ou server action) que gera e salva mensagens em status "rascunho"

### P4 — Conteúdo, painel e validação
- [ ] Ampliar `mensagens.json` para **30+ mensagens** (≥ 4 por tipo de golpe e ~30% legítimas)
- [ ] Revisar os sinais e explicações com linguagem simples (público não técnico)
- [ ] Definir as métricas do painel com dados reais: evolução no tempo, % de cliques em golpes, falsos alarmes
- [ ] Recrutar **3 a 5 PMEs/pessoas** para o teste da semana 2 e preparar roteiro de teste

## Semana 2 — 23/11 a 29/11: IA no treino, validação e pitch

### P1 — Front-end
- [ ] Painel do gestor ligado aos dados reais (com P2), filtros por setor e período
- [ ] Marcar visualmente mensagens geradas por IA no modo gestor
- [ ] Ajustes a partir do teste com usuários
- [ ] Polimento visual final e capturas de tela para o pitch

### P2 — Back-end
- [ ] Endpoints/queries agregadas para o painel (por pessoa, por tipo, por período)
- [ ] Seed do banco a partir de `mensagens.json`
- [ ] Revisão de segurança: chave da IA só no servidor, nenhuma coleta além da ação, validação de entrada nas rotas
- [ ] Deploy de produção na Vercel e checklist de estabilidade para a demo

### P3 — IA
- [ ] Ligar mensagens geradas à caixa de entrada: misturar X% de mensagens novas por sessão
- [ ] Fluxo de **revisão do gestor** (aprovar/rejeitar mensagens geradas antes de entrarem no treino)
- [ ] Cache das explicações para não chamar a IA repetidamente na demo
- [ ] Garantir que tudo funciona **sem chave** (fallback mock) — essencial para a apresentação

### P4 — Conteúdo, painel e validação
- [ ] Rodar o **teste com usuários** (26/11): taxa de acerto na 1ª rodada × 2ª rodada
- [ ] Consolidar resultados e depoimentos para o pitch
- [ ] Roteiro do **pitch (3–5 min)** e **vídeo de demonstração**
- [ ] Revisar README e documentação final

## 30/11 — Entrega
- [ ] Build de produção sem erros e deploy no ar
- [ ] README atualizado ("o que está pronto" × "o que falta")
- [ ] Pitch, vídeo e link da demo enviados

---

## Fora do escopo (após o hackathon)

- Autenticação real e multiempresa com papéis (gestor × funcionário)
- Pagamentos/planos
- Trilhas de treino recorrentes (ex.: 5 minutos por semana) e lembretes
- Novos canais simulados (SMS, ligação/áudio, QR Code)
- Certificado de conclusão para o funcionário
