import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Droplets, Shield, Sparkles, Armchair } from "lucide-react";

const ITEMS = [
  {
    title: "Hygiene-first ritual",
    body: "Medical-grade sanitation between every guest — tools, capes, and stations reset to zero.",
    Icon: Shield,
    className: "md:col-span-2",
  },
  {
    title: "Lighting & acoustics",
    body: "Warm, low-glare lighting and a quiet floor so consultations feel focused, not rushed.",
    Icon: Armchair,
    className: "",
  },
  {
    title: "Product discipline",
    body: "We select finishes for scalp health and camera-ready texture — never heavy build-up.",
    Icon: Droplets,
    className: "",
  },
  {
    title: "Design-led craft",
    body: "Every line is drafted before blades touch hair — fades are architecture, not accidents.",
    Icon: Sparkles,
    className: "md:col-span-2",
  },
];

export function WhySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="why"
      className="scroll-mt-24 border-y border-white/5 bg-white/[0.02] py-20 md:py-28"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Why FadeCraft
          </h2>
          <p className="mt-4 text-muted md:text-lg">
            A modern barbershop should feel like a private studio — calm,
            confident, and obsessively considered.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className={`rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl ${item.className}`}
            >
              <item.Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
