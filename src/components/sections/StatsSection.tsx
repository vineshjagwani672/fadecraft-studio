import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Users, Star, Clock } from "lucide-react";

const STATS = [
  { label: "Guests served", value: "12,400+", Icon: Users },
  { label: "Years crafting fades", value: "09", Icon: Award },
  { label: "Studio rating", value: "4.9", Icon: Star },
  { label: "Attention to detail", value: "100%", Icon: Clock },
];

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="border-b border-white/5 py-14 md:py-20">
      <div ref={ref} className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-inner backdrop-blur-xl transition-all duration-300 hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    {s.label}
                  </p>
                  <p className="mt-3 font-display text-3xl font-semibold tabular-nums text-white">
                    {s.value}
                  </p>
                </div>
                <s.Icon className="h-6 w-6 text-primary/80 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
