import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coach Anti-Phishing",
  description:
    "Treino contra golpes digitais para funcionários de pequenas e médias empresas, numa caixa de entrada 100% simulada.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-slate-500">
          Ambiente de treino. Todas as mensagens são simuladas e usam marcas fictícias. Nenhum dado
          pessoal é coletado.
        </footer>
      </body>
    </html>
  );
}
