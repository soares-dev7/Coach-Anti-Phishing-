import Link from "next/link";
import { ROTULO_GOLPE } from "@/lib/rotulos";

const PASSOS = [
  {
    titulo: "1. Abra a caixa de entrada",
    texto: "E-mails e mensagens de WhatsApp simulados, misturando mensagens legítimas e golpes comuns no Brasil.",
  },
  {
    titulo: "2. Decida o que fazer",
    texto: "Para cada mensagem: Confiar, Denunciar ou Clicar no link. Como na vida real.",
  },
  {
    titulo: "3. Aprenda na hora",
    texto: "Feedback imediato com os sinais de golpe que estavam ali — remetente, urgência, link estranho…",
  },
  {
    titulo: "4. Gestor acompanha",
    texto: "Painel com taxa de acerto por pessoa e por tipo de golpe, para saber onde reforçar o treino.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="py-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-marca">
          Hack Brasil 2026 · Trilha Cibersegurança
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-marca-escura sm:text-5xl">
          Coach Anti-Phishing
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-700">
          Treino prático contra golpes digitais para funcionários de pequenas e médias empresas,
          dentro de uma caixa de entrada 100% simulada.
        </p>
        <Link
          href="/treino"
          className="mt-8 inline-block rounded-xl bg-marca px-6 py-3 text-lg font-semibold text-white shadow hover:bg-marca-escura"
        >
          Começar treino
        </Link>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold">O problema</h2>
          <p className="mt-2 text-slate-700">
            Pequenas e médias empresas são alvo constante de golpes: falso Pix, boleto adulterado,
            falsa central do banco, “chefe” pedindo transferência. Basta um clique ou um pagamento
            errado de um funcionário para causar prejuízo — e essas empresas raramente têm equipe
            de segurança ou orçamento para treinamentos.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold">A solução</h2>
          <p className="mt-2 text-slate-700">
            Um treino curto e realista, feito dentro do app: o funcionário pratica reconhecer golpes
            sem nenhum risco. Nunca enviamos mensagens reais, nunca pedimos senhas ou dados
            bancários e usamos apenas marcas fictícias.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-center text-2xl font-bold">Como funciona</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((p) => (
            <div key={p.titulo} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-marca-escura">{p.titulo}</h3>
              <p className="mt-2 text-sm text-slate-600">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-marca-escura p-6 text-white">
        <h2 className="text-xl font-bold">Golpes que você vai treinar</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {Object.values(ROTULO_GOLPE).map((g) => (
            <li key={g} className="rounded-full bg-white/15 px-3 py-1 text-sm">
              {g}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/treino" className="rounded-lg bg-white px-4 py-2 font-semibold text-marca-escura">
            Começar treino
          </Link>
          <Link href="/painel" className="rounded-lg border border-white/50 px-4 py-2 font-semibold">
            Ver painel do gestor
          </Link>
        </div>
      </section>
    </div>
  );
}
