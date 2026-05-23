import { Suspense, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SERVICES, SERVICE_FEE_PKR, TAX_RATE, getServiceById } from "@/data/services";
import { PACKAGE_PRESETS } from "@/data/package-presets";
import {
  bookingSlotKey,
  generateTimeSlots,
  INITIAL_MOCK_BOOKED_KEYS,
} from "@/lib/booking-utils";
import { notifyOwnerViaBackend, type BookingPayload } from "@/lib/whatsapp";

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function BookingContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [bookedKeys, setBookedKeys] = useState(
    () => new Set(INITIAL_MOCK_BOOKED_KEYS),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<BookingPayload | null>(null);

 
  // ─── URL param → cart pre-fill ────────────────────────────────────────────
  useEffect(() => {
    const service = searchParams.get("service");
    const pkg = searchParams.get("package");
    if (!service && !pkg) return;

    const validService = Boolean(service && getServiceById(service));
    const validPkg = Boolean(pkg && PACKAGE_PRESETS[pkg]);

    if (!validService && !validPkg) {
      setSearchParams({}, { replace: true });
      return;
    }

    let toastMsg = "";
    setCart((prev) => {
      const next = { ...prev };
      if (validService && service) {
        next[service] = (next[service] || 0) + 1;
        toastMsg = `${getServiceById(service)!.name} added to cart.`;
      }
      if (validPkg && pkg) {
        for (const id of PACKAGE_PRESETS[pkg].serviceIds) {
          if (!getServiceById(id)) continue;
          next[id] = (next[id] || 0) + 1;
        }
        toastMsg = `${PACKAGE_PRESETS[pkg].label} preset loaded.`;
      }
      return next;
    });

    if (toastMsg) toast.success(toastMsg);
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  // ─── Derived values ───────────────────────────────────────────────────────
  const slots = useMemo(() => generateTimeSlots(), []);

  const subtotal = useMemo(
    () =>
      Object.entries(cart).reduce((sum, [id, qty]) => {
        const s = getServiceById(id);
        return s ? sum + s.price * qty : sum;
      }, 0),
    [cart],
  );

  const tax = subtotal > 0 ? Math.round(subtotal * TAX_RATE) : 0;
  const serviceFee = subtotal > 0 ? SERVICE_FEE_PKR : 0;
  const grandTotal = subtotal + tax + serviceFee;
  const cartLines = Object.entries(cart).filter(([, q]) => q > 0);

  // ─── Cart helpers ─────────────────────────────────────────────────────────
  function setQty(id: string, qty: number) {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  function addOne(id: string) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    toast.message(`${getServiceById(id)?.name} added.`);
  }

  function removeLine(id: string) {
    setQty(id, 0);
    toast("Removed from cart.");
  }

  function slotState(t: string) {
    return bookedKeys.has(bookingSlotKey(date, t)) ? ("booked" as const) : ("open" as const);
  }

  // ─── FIX 1 + 2 + 3 + 4: proper async confirm handler ─────────────────────
  
  async function handleConfirmBooking() {

  console.log("🚀 API CALL START HUI"); // 👈 ADD THIS

    // — guard checks —
    if (!time || cartLines.length === 0) {
      toast.error("Select services and a time slot first.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone are required.");
      return;
    }
    const key = bookingSlotKey(date, time);
    if (bookedKeys.has(key)) {
      toast.error("That slot was just taken — pick another.");
      return;
    }

    // — snapshot all values before any async work —
    const linesSnapshot = cartLines.map(([id, qty]) => {
      const s = getServiceById(id)!;
      return { name: s.name, qty, lineTotal: s.price * qty };
    });
    const totalSnapshot = grandTotal;
    const dateSnapshot = date;
    const timeSnapshot = time;
    const nameSnapshot = name.trim();
    const phoneSnapshot = phone.trim();
    const notesSnapshot = notes.trim();

    setSubmitting(true);

    const bookingData = {
      customer_name: nameSnapshot,
      customer_phone: phoneSnapshot,
      service: linesSnapshot.map((item) => item.name).join(", "),
      appointment_date: dateSnapshot,
      appointment_time: timeSnapshot,
      notes: notesSnapshot,
      total: totalSnapshot,
    };
try {
  console.log("🚀 API CALL START HUI");

  const res = await fetch(
    "https://fadecraft-backend-production.up.railway.app/book-appointment",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    }
  );

  console.log("📩 RESPONSE AAYA", res.status);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Booking failed");
  }
} catch (err) {
  const msg = err instanceof Error ? err.message : "Network error";
  toast.error(`Booking save nahi ho saka: ${msg}`);
  setSubmitting(false);
  return;
}

    // ── FIX 4: consistent state — mark slot booked before closing modal ───────
    setBookedKeys((prev) => {
      const n = new Set(prev);
      n.add(key);
      return n;
    });

    const ref = `FC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const payload: BookingPayload = {
      ref,
      date: dateSnapshot,
      time: timeSnapshot,
      name: nameSnapshot,
      phone: phoneSnapshot,
      notes: notesSnapshot,
      lines: linesSnapshot,
      grandTotal: totalSnapshot,
    };

    // ── FIX 1: notify variable was missing — now properly awaited ─────────────
    let notify: { ok: boolean } = { ok: false };
    try {
      notify = await notifyOwnerViaBackend(payload);
    } catch {
      // non-fatal — booking is already saved; just warn below
      notify = { ok: false };
    }

    // ── FIX 4: close confirm modal, update success state atomically ───────────
    setConfirmOpen(false);
    setSubmitting(false);
    setSuccess(payload);

    if (notify.ok) {
      toast.success("Booking saved — owner notified by email.");
    } else {
      toast.message("Booking saved.");
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="pb-24 pt-8 md:pt-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="secondary">Online booking</Badge>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Apni visit plan karein
            </h1>
            <p className="mt-2 max-w-xl text-muted">
              Services cart mein add karein, total amount dekhein aur apna preferred time slot choose karein.

              Booking confirm hone ke baad aap ki details hamare record mein successfully save ho jaati hain aur aap ka selected timing slot humein email par receive ho jata hai.

              Hamari team jald hi aap ko email par appointment confirmation bhej degi. Thank you for choosing Fadecraft Studio ✂️
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-8">
            {/* Service Menu */}
            <Card>
              <CardHeader>
                <CardTitle>Service menu</CardTitle>
                <CardDescription>
                  Jo service chahiye &quot;Add&quot; dabayein — side cart se
                  quantity adjust karein.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {SERVICES.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-white">{s.name}</p>
                      <p className="text-xs text-muted">
                        Rs. {s.price.toLocaleString("en-PK")}
                      </p>
                    </div>
                    <Button size="sm" type="button" onClick={() => addOne(s.id)}>
                      Add
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Date & time
                </CardTitle>
                <CardDescription>
                  Slots generate from 10:00 to 20:00 in 30-minute increments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label
                    htmlFor="visit-date"
                    className="text-xs font-semibold uppercase tracking-widest text-muted"
                  >
                    Appointment date
                  </label>
                  <input
                    id="visit-date"
                    type="date"
                    min={todayISO()}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setTime(null);
                    }}
                    className="mt-2 w-full max-w-xs rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none ring-primary/40 focus:ring-2"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Available slots
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {slots.map((t) => {
                      const state = slotState(t);
                      const selected = time === t;
                      const disabled = state === "booked";
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={disabled}
                          onClick={() => setTime(t)}
                          className={`relative rounded-xl border px-2 py-3 text-xs font-medium transition-all md:text-sm ${
                            disabled
                              ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-muted/50 line-through"
                              : selected
                                ? "border-primary bg-primary/15 text-white shadow-lg shadow-primary/20"
                                : "border-white/10 bg-white/[0.03] text-muted hover:border-primary/40 hover:text-white"
                          }`}
                        >
                          <span className="flex items-center justify-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {t}
                          </span>
                          {disabled && (
                            <span className="mt-1 block text-[10px] font-normal uppercase tracking-wide text-destructive">
                              Already Booked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle>Your details</CardTitle>
                <CardDescription>
                  Apna mobile number likhein taake hum slot confirm kar saken.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-1">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Full name
                  </label>
                  <input
                    id="full-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none ring-primary/40 focus:ring-2"
                    placeholder="Your full name"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Phone
                  </label>
                  <input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none ring-primary/40 focus:ring-2"
                    placeholder="03xx-xxxxxxx"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none ring-primary/40 focus:ring-2"
                    placeholder="Barber preference, allergy, ya koi link..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Cart */}
          <aside className="lg:sticky lg:top-28">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Live cart
                </CardTitle>
                <CardDescription>Quantities, fees, and grand total.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartLines.length === 0 ? (
                  <p className="text-sm text-muted">
                    Your cart is empty — add services from the menu.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {cartLines.map(([id, qty]) => {
                      const s = getServiceById(id)!;
                      return (
                        <li
                          key={id}
                          className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">{s.name}</p>
                            <p className="text-xs text-muted">
                              Rs. {s.price.toLocaleString("en-PK")} each
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => setQty(id, qty - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-6 text-center text-sm tabular-nums">{qty}</span>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => setQty(id, qty + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeLine(id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="tabular-nums text-white">
                      Rs. {subtotal.toLocaleString("en-PK")}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Tax ({Math.round(TAX_RATE * 100)}%)</span>
                    <span className="tabular-nums text-white">
                      Rs. {tax.toLocaleString("en-PK")}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Studio service fee</span>
                    <span className="tabular-nums text-white">
                      Rs. {serviceFee.toLocaleString("en-PK")}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-3 font-display text-lg font-semibold text-white">
                    <span>Grand total</span>
                    <span className="tabular-nums text-primary">
                      Rs. {grandTotal.toLocaleString("en-PK")}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full"
                  disabled={cartLines.length === 0 || !time}
                  onClick={() => setConfirmOpen(true)}
                >
                  Review & confirm
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            key="confirm"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="confirm-card"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0c0f] p-6 shadow-2xl"
            >
              <h2 className="font-display text-xl font-semibold text-white">
                Confirm booking
              </h2>
              <p className="mt-2 text-sm text-muted">
                {date} · {time ?? "—"} · {name || "Guest"}
              </p>
              <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto text-sm">
                {cartLines.map(([id, qty]) => {
                  const s = getServiceById(id)!;
                  return (
                    <li key={id} className="flex justify-between text-muted">
                      <span>
                        {s.name} <span className="text-white">×{qty}</span>
                      </span>
                      <span>Rs. {(s.price * qty).toLocaleString("en-PK")}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 flex justify-between border-t border-white/10 pt-4 font-semibold text-white">
                Total due
                <span className="text-primary">
                  Rs. {grandTotal.toLocaleString("en-PK")}
                </span>
              </p>
              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={submitting}
                  onClick={() => setConfirmOpen(false)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  disabled={submitting}
                  onClick={handleConfirmBooking}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div
            key="success"
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="success-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/15 to-[#0c0c0f] p-8 text-center shadow-[0_30px_120px_-40px_rgba(201,169,98,0.55)]"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
              </motion.div>
              <h2 className="mt-4 font-display text-2xl font-semibold text-white">
                Booking save ho gayi
              </h2>
              <p className="mt-2 text-sm text-muted">
                Ref <span className="font-mono text-white">{success.ref}</span> ·{" "}
                {success.date} @ {success.time}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                Your booking has been saved successfully. We will contact you soon.
              </p>
              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-left text-sm text-white">
                Booking details have been sent to our studio inbox. We will contact you by email or phone if we need further information.
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSuccess(null)}
                >
                  Dobara booking
                </Button>
                <Button variant="ghost" type="button" asChild>
                  <Link to="/">Home</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-muted">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
