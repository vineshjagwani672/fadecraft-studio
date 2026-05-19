import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { FAQ_ITEMS } from "@/data/faq";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <h2 className="text-center font-display text-3xl font-semibold tracking-tight md:text-4xl">
          FAQ
        </h2>
        <p className="mt-4 text-center text-muted">
          Straight answers — no filler, no mystery pricing.
        </p>

        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium text-white">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted transition-transform",
                      isOpen && "rotate-180 text-primary",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="border-t border-white/5 px-5 pb-4 pt-0 text-sm leading-relaxed text-muted">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
