import { MapPin, Mail, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 pb-24 pt-6 md:pb-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl md:grid-cols-2 md:p-12">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Visit the studio
            </h2>
            <p className="mt-4 text-muted md:text-lg">
              FadeCraft Studio welcomes scheduled guests in DHA Phase 2. For
              collaborations and private days, email the desk — we respond
              within one business day.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex gap-3 text-muted">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>
                  DHA Phase 2, Karachi, Pakistan
                  <span className="mt-1 block text-xs text-muted/80">
                    Exact unit shared on confirmation.
                  </span>
                </span>
              </li>
              <li className="flex gap-3 text-muted">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <a
                  href="mailto:studio@fadecraft.pk"
                  className="text-white underline-offset-4 hover:text-primary hover:underline"
                >
                  studio@fadecraft.pk
                </a>
              </li>
              <li className="flex gap-3 text-muted">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                Daily · 10:00 — 20:00 (last chair 19:00)
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-black/40 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Concierge
              </p>
              <p className="mt-2 text-sm text-muted">
                Share your desired look, reference imagery, and timing
                constraints — we align the right barber before you arrive.
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="mailto:studio@fadecraft.pk">Email the desk</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
