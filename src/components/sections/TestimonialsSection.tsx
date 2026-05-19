import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, Star } from "lucide-react";

import { REVIEWS } from "@/data/reviews";

export function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="border-y border-white/5 py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="text-center font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Trusted by Karachi&apos;s most particular.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted md:text-lg">
          Real words from guests who expect quiet luxury, sharp lines, and
          respectful pacing.
        </p>

        <div className="mt-12 flex gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.id}
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              className="min-w-[260px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:min-w-0"
            >
              <Quote className="h-6 w-6 text-primary/70" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-muted">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-5 border-t border-white/10 pt-4">
                <p className="font-medium text-white">{r.name}</p>
                <p className="text-xs text-muted">{r.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
