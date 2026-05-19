import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { SERVICES } from "@/data/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="services" className="scroll-mt-24 py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Featured services
          </Badge>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Tailored grooming, executed like a product launch.
          </h2>
          <p className="mt-4 text-muted md:text-lg">
            Every service is time-boxed, transparently priced, and designed to
            stack cleanly into packages when you want the full reset.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_24px_80px_-40px_rgba(201,169,98,0.35)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  {s.category === "package" && (
                    <Badge className="mb-2">Package</Badge>
                  )}
                  <h3 className="font-display text-xl font-semibold text-white">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{s.description}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-muted">
                  {s.durationMin} min
                </span>
              </div>
              <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                <p className="font-display text-2xl font-semibold text-primary">
                  Rs. {s.price.toLocaleString("en-PK")}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-muted hover:text-primary"
                  asChild
                >
                  <Link to={`/booking?service=${s.id}`}>
                    Add on visit
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
