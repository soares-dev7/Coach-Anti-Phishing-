import { Mail, MessageCircle } from "lucide-react";
import type { Canal } from "@/lib/types";

/** Etiqueta visual do canal (e-mail ou WhatsApp). */
export default function ChannelBadge({ canal }: { canal: Canal }) {
  const estilo =
    canal === "email" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${estilo}`}>
      {canal === "email" ? <Mail aria-hidden className="size-3" /> : <MessageCircle aria-hidden className="size-3" />}
      {canal === "email" ? "E-mail" : "WhatsApp"}
    </span>
  );
}
