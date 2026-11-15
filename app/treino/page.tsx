import type { Metadata } from "next";
import Inbox from "@/components/inbox/Inbox";
import { getMensagens } from "@/lib/data";

export const metadata: Metadata = { title: "Treino · Coach Anti-Phishing" };

export default async function TreinoPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const [{ m }, mensagens] = await Promise.all([searchParams, getMensagens()]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Caixa de entrada simulada</h1>
        <p className="text-sm text-slate-600">
          Você trabalha na <strong>Distribuidora Aurora</strong>. Abra cada mensagem e decida:
          confiar, denunciar ou clicar no link. Nada aqui é real — nenhum link sai do app.
        </p>
      </div>
      <Inbox mensagens={mensagens} inicial={m} />
    </div>
  );
}
