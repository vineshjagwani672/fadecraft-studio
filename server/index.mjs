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
import nodemailer from "nodemailer";

const PORT = Number(process.env.PORT || 8787);
const NOTIFY_SECRET = process.env.NOTIFY_SECRET?.trim();

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST?.trim();
const EMAIL_PORT = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
const EMAIL_USER = process.env.EMAIL_USER?.trim();
const EMAIL_PASS = process.env.EMAIL_PASS?.trim();
const EMAIL_TO = process.env.EMAIL_TO?.trim();

let transporter = null;
if (EMAIL_HOST && EMAIL_PORT && EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

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
  const ready = Boolean(transporter && EMAIL_TO);
  res.json({ ok: true, emailReady: ready });
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
  if (!transporter || !EMAIL_TO) {
    return res.status(503).json({ error: "Email sender not configured" });
  }

  const linesText = (Array.isArray(b.lines) ? b.lines : []).map(
    (x) => `• ${x.name} ×${x.qty} — Rs.${Number(x.lineTotal).toLocaleString("en-PK")}`,
  ).join("\n");

  const text = [
    `FadeCraft — new booking`,
    `Ref: ${b.ref}`,
    `Name: ${b.name}`,
    `Phone: ${b.phone}`,
    `Date: ${b.date}`,
    `Time: ${b.time}`,
    `\nServices:\n${linesText}`,
    `\nTotal: Rs.${Number(b.grandTotal).toLocaleString("en-PK")}`,
    b.notes ? `\nNotes: ${String(b.notes).slice(0, 800)}` : "",
  ].join("\n");

  try {
    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_TO,
      subject: `New booking — ${b.ref} — ${b.date} ${b.time}`,
      text,
    });
    return res.json({ ok: true, info: String(info.response || info.messageId || '') });
  } catch (e) {
    return res.status(502).json({ error: "Email send failed", detail: String(e?.message || e).slice(0, 300) });
  }
});

app.listen(PORT, () => {
  console.log(`[fadecraft-notify] http://127.0.0.1:${PORT}`);
  console.log(
    `[fadecraft-notify] CallMeBot: ${CALLMEBOT_API_KEY && CALLMEBOT_PHONE ? "configured" : "NOT configured — add .env keys"}`,
  );
});
