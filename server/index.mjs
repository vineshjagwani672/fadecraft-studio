/**
 * FadeCraft — tiny notify backend (CallMeBot free WhatsApp API).
 * @see https://www.callmebot.com/blog/whatsapp-from-php/
 *
 * Setup:
 * 1) WhatsApp bot +34 623 78 64 49 → send: I allow callmebot to send me messages
 * 2) Copy API key from bot reply into CALLMEBOT_API_KEY
 * 3) CALLMEBOT_PHONE = your WhatsApp in international form (+923153516936)
 */
import "dotenv/config";
import express from "express";
import cors from "cors";

const PORT = Number(process.env.PORT || 8787);
const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY?.trim();
const CALLMEBOT_PHONE = process.env.CALLMEBOT_PHONE?.trim();
const NOTIFY_SECRET = process.env.NOTIFY_SECRET?.trim();

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "48kb" }));

const allowed = (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowed.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
  }),
);

/** Very small abuse brake (per IP, rolling hour). */
const hits = new Map();
function allow(ip) {
  const now = Date.now();
  const h = hits.get(ip) || { n: 0, t: now + 3_600_000 };
  if (now > h.t) {
    h.n = 0;
    h.t = now + 3_600_000;
  }
  h.n += 1;
  hits.set(ip, h);
  return h.n <= 40;
}

function buildMessage(body) {
  const lines = [
    `*FadeCraft — nai booking*`,
    `Ref: *${body.ref}*`,
    `Naam: ${body.name}`,
    `Mobile: ${body.phone}`,
    `Slot: ${body.date} @ ${body.time}`,
    ``,
    `*Services*`,
    ...(Array.isArray(body.lines) ? body.lines : []).map(
      (x) => `• ${x.name} ×${x.qty} — Rs.${Number(x.lineTotal).toLocaleString("en-PK")}`,
    ),
    ``,
    `Total: Rs.${Number(body.grandTotal).toLocaleString("en-PK")}`,
  ];
  if (body.notes) lines.push(``, `Notes: ${String(body.notes).slice(0, 800)}`);
  return lines.join("\n").slice(0, 3900);
}

app.get("/api/health", (_req, res) => {
  const ready = Boolean(CALLMEBOT_API_KEY && CALLMEBOT_PHONE);
  res.json({ ok: true, whatsappReady: ready });
});

app.post("/api/notify-booking", async (req, res) => {
  const ip = String(req.ip || req.socket.remoteAddress || "unknown");
  if (!allow(ip)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  if (NOTIFY_SECRET) {
    const got = String(req.headers["x-notify-secret"] || "");
    if (got !== NOTIFY_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  if (!CALLMEBOT_API_KEY || !CALLMEBOT_PHONE) {
    return res.status(503).json({
      error: "Server missing CALLMEBOT_API_KEY or CALLMEBOT_PHONE in .env",
    });
  }

  const b = req.body || {};
  const required = ["ref", "date", "time", "name", "phone", "grandTotal"];
  for (const k of required) {
    if (b[k] === undefined || b[k] === null || b[k] === "") {
      return res.status(400).json({ error: `Missing field: ${k}` });
    }
  }
  if (!Array.isArray(b.lines) || b.lines.length === 0) {
    return res.status(400).json({ error: "lines required" });
  }

  const text = buildMessage(b);
  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("source", "fadecraft-studio");
  url.searchParams.set("phone", CALLMEBOT_PHONE);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", CALLMEBOT_API_KEY);

  try {
    const r = await fetch(url.toString(), { method: "GET" });
    const raw = await r.text();
    if (!r.ok) {
      return res.status(502).json({
        error: "CallMeBot HTTP error",
        status: r.status,
        detail: raw.slice(0, 500),
      });
    }
    return res.json({ ok: true, callmebot: raw.slice(0, 200) });
  } catch (e) {
    return res.status(502).json({
      error: "CallMeBot request failed",
      detail: String(e?.message || e).slice(0, 300),
    });
  }
});

app.listen(PORT, () => {
  console.log(`[fadecraft-notify] http://127.0.0.1:${PORT}`);
  console.log(
    `[fadecraft-notify] CallMeBot: ${CALLMEBOT_API_KEY && CALLMEBOT_PHONE ? "configured" : "NOT configured — add .env keys"}`,
  );
});
