export type WhatsAppBookingPayload = {
  ref: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes: string;
  lines: { name: string; qty: number; lineTotal: number }[];
  grandTotal: number;
};

export function formatKarachiBookingMessage(d: WhatsAppBookingPayload): string {
  const parts: string[] = [
    `*FadeCraft Studio — Karachi*`,
    `*Website se nai booking*`,
    ``,
    `Ref: *${d.ref}*`,
    `Naam: ${d.name}`,
    `Mobile: ${d.phone}`,
    `Tareekh: ${d.date}`,
    `Time: ${d.time}`,
    ``,
    `*Services:*`,
    ...d.lines.map(
      (x) =>
        `• ${x.name} ×${x.qty} — Rs. ${x.lineTotal.toLocaleString("en-PK")}`,
    ),
    ``,
    `*Total (tax + service fee ke saath):* Rs. ${d.grandTotal.toLocaleString("en-PK")}`,
  ];
  if (d.notes.trim()) {
    parts.push(``, `Notes: ${d.notes.trim()}`);
  }
  return parts.join("\n");
}

/**
 * Opens WhatsApp chat to YOUR number with a pre-filled booking message.
 * Set `VITE_WHATSAPP_NUMBER` in `.env` (digits only, country code, no +).
 * Example Pakistan mobile: 923001234567
 */
export function buildWhatsAppBookingUrl(message: string): string | null {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (typeof raw !== "string" || !raw.trim()) return null;

  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) return null;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function apiBase(): string {
  const b = import.meta.env.VITE_API_BASE;
  if (typeof b === "string" && b.trim()) return b.replace(/\/$/, "");
  return "";
}

/** POST → local Node server → CallMeBot (free) → WhatsApp on your phone */
export async function notifyOwnerViaBackend(
  body: WhatsAppBookingPayload,
): Promise<{ ok: boolean; error?: string }> {
  if (import.meta.env.VITE_DISABLE_NOTIFY === "1") {
    return { ok: false, error: "notify_disabled" };
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const sec = import.meta.env.VITE_NOTIFY_SECRET;
    if (typeof sec === "string" && sec.length > 0) {
      headers["X-Notify-Secret"] = sec;
    }

    const r = await fetch(`${apiBase()}/api/notify-booking`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const errText = await r.text();
      return { ok: false, error: errText.slice(0, 400) };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
