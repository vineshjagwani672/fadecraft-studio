export type BookingPayload = {
  ref: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes: string;
  lines: { name: string; qty: number; lineTotal: number }[];
  grandTotal: number;
};
export function formatEmailBookingMessage(d: BookingPayload): string {
  const lines = [
    `New booking from website`,
    `Ref: ${d.ref}`,
    `Name: ${d.name}`,
    `Phone: ${d.phone}`,
    `Date: ${d.date}`,
    `Time: ${d.time}`,
    ``,
    `Services:`,
    ...d.lines.map((x) => `- ${x.name} ×${x.qty} — Rs. ${x.lineTotal.toLocaleString("en-PK")}`),
    ``,
    `Total: Rs. ${d.grandTotal.toLocaleString("en-PK")}`,
  ];
  if (d.notes && d.notes.trim()) lines.push(``, `Notes: ${d.notes.trim()}`);
  return lines.join("\n");
}

function apiBase(): string {
  const b = import.meta.env.VITE_API_BASE;
  if (typeof b === "string" && b.trim()) return b.replace(/\/$/, "");
  return "";
}

/** POST → local Node server → CallMeBot (free) → WhatsApp on your phone */
export async function notifyOwnerViaBackend(
  body: BookingPayload,
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
