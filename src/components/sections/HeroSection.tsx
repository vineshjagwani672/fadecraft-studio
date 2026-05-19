import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { LuxuryRadialShader } from "@/components/ui/radial-shader";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.55,
      ease: "easeOut" as const,
    },
  }),
};

/** Clear barbershop photo — full opacity so it never looks “empty” */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=85&w=1400&auto=format&fit=crop";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-white/5 pb-16 pt-10 md:pb-24 md:pt-14"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,98,0.14),_transparent_55%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:gap-16 md:px-6">
        <div className="max-w-xl">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Karachi · DHA Phase 2
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance text-white md:text-5xl lg:text-6xl"
          >
            Precision cuts.
            <span className="block text-primary">Karachi style.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-5 text-lg leading-relaxed text-muted md:text-xl"
          >
            FadeCraft Studio — seedha, saaf, professional look. Garmi, dust,
            aur busy schedule ke liye sessions time par, zyada drama ke
            baghair.{" "}
            <span className="text-white/90">
              Neat fades, beard shape, aur packages jo pocket par zyada
              load na daalen.
            </span>
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" asChild>
              <Link to="/booking" className="gap-2">
                Abhi slot book karein
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#packages">Packages dekhein</a>
            </Button>
          </motion.div>

          <motion.dl
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 text-sm"
          >
            <div>
              <dt className="text-muted">Timings</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-white">
                10am — 8pm
              </dd>
            </div>
            <div>
              <dt className="text-muted">Avg. time</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-white">
                45–60 min
              </dd>
            </div>
            <div>
              <dt className="text-muted">Location</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-white">
                DHA Ph. 2
              </dd>
            </div>
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 shadow-[0_40px_120px_-40px_rgba(201,169,98,0.45)] md:max-w-none"
        >
          <div className="absolute inset-0 z-0 opacity-50">
            <LuxuryRadialShader />
          </div>

          <img
            src={HERO_IMAGE}
            alt="Karachi barber shop — clean chairs, warm lights, professional cut"
            width={1200}
            height={1500}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 z-[1] h-full w-full object-cover"
          />

          <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black via-black/35 to-black/10" />

          <ProgressiveBlur
            className="pointer-events-none absolute bottom-0 left-0 z-[3] h-[30%] w-full"
            blurIntensity={0.5}
          />

          <div className="absolute inset-x-4 bottom-4 z-[4] rounded-2xl border border-white/15 bg-black/55 p-5 text-left shadow-2xl backdrop-blur-xl sm:inset-x-5 sm:bottom-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Featured
            </p>
            <p className="mt-2 font-display text-xl font-semibold text-white">
              Full Grooming Package
            </p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-300">
              Haircut, beard, wash, facial aur styling — ek hi visit mein fresh
              feel.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
