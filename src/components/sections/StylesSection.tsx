import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { HAIR_STYLES } from "@/data/hair-styles";

export function StylesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="styles" className="scroll-mt-24 py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Popular haircut styles
            </h2>
            <p className="mt-4 text-muted md:text-lg">
              Reference cuts our team executes daily — each adapted to your
              head shape, growth patterns, and lifestyle.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HAIR_STYLES.map((style, i) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-6 transition-shadow duration-300 hover:border-primary/30 hover:shadow-[0_20px_60px_-35px_rgba(201,169,98,0.3)]"
            >
              <style.Icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold text-white">
                {style.name}
              </h3>
              <p className="mt-2 text-sm text-muted">{style.blurb}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
