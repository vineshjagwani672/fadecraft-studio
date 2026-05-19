import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BookingCtaSection() {
  return (
    <section
      id="booking"
      className="scroll-mt-24 border-y border-white/10 bg-gradient-to-br from-primary/15 via-transparent to-transparent py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 p-10 shadow-2xl backdrop-blur-2xl md:p-14"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                <CalendarClock className="h-4 w-4" />
                Appointment booking
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Online cart + slot — phir WhatsApp par detail hum tak
              </h2>
              <p className="mt-4 max-w-xl text-muted md:text-lg">
                Services add karein, total dekhein, date/time choose karein.
                Confirm ke baad WhatsApp button se poori booking message aapke
                set number par chali jaye gi (jab <code className="rounded bg-white/10 px-1 text-xs">.env</code> configure ho).
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/booking">Booking page kholein</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#services">Services dekhein</a>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-sm text-muted">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  Live total — tax aur chhota service fee included.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  Booked slots par{" "}
                  <span className="font-medium text-white">Already Booked</span>{" "}
                  — select band.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  Confirm ke baad WhatsApp handoff (aapka number config ho).
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
