import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { TEAM } from "@/data/team";

export function TeamSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="team" className="scroll-mt-24 py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            The barber team
          </h2>
          <p className="mt-4 text-muted md:text-lg">
            Senior artists with runway, editorial, and everyday craft experience
            — aligned on one standard: invisible precision.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TEAM.map((m, i) => (
            <motion.article
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-black/40 transition-all duration-300 hover:border-primary/35"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={m.image}
                  alt={m.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-xl font-semibold text-white">
                    {m.name}
                  </h3>
                  <p className="text-xs font-medium uppercase tracking-widest text-primary">
                    {m.role}
                  </p>
                  <p className="mt-2 text-sm text-muted">{m.bio}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
