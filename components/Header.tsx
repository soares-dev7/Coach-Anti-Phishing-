import Link from "next/link";

/** Barra superior compartilhada por todas as páginas. */
export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-marca-escura">
          <span aria-hidden className="text-xl">🛡️</span>
          Coach Anti-Phishing
        </Link>
        <div className="flex gap-4 text-sm font-medium text-slate-600">
          <Link href="/treino" className="hover:text-marca">Treino</Link>
          <Link href="/painel" className="hover:text-marca">Painel do gestor</Link>
        </div>
      </nav>
    </header>
  );
}
