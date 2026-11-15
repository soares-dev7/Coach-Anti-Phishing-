import type { Canal } from "@/lib/types";

/** Etiqueta visual do canal (e-mail ou WhatsApp). */
export default function ChannelBadge({ canal }: { canal: Canal }) {
  const estilo =
    canal === "email" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${estilo}`}>
      {canal === "email" ? "✉️ E-mail" : "💬 WhatsApp"}
    </span>
  );
}
