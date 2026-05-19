import { useNavigate } from "react-router-dom";
import { Crown, Gem, Sparkles, Building2 } from "lucide-react";

import { PricingModule, type PricingPlan } from "@/components/ui/pricing-module";

/** Lower “per visit” / retainer demo numbers for Karachi audience */
const PLANS: PricingPlan[] = [
  {
    id: "essential",
    name: "Essential",
    description: "Rozana / har 2 hafte — light maintenance.",
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    priceMonthly: 2800,
    priceYearly: 26000,
    users: "1 chair · ~60 min",
    features: [
      { label: "Signature haircut", included: true },
      { label: "Beard line-up", included: true },
      { label: "Facial add-on", included: false },
    ],
  },
  {
    id: "classic",
    name: "Classic",
    description: "Office walon ke liye — neat look har week.",
    icon: <Gem className="h-8 w-8 text-primary" />,
    priceMonthly: 3800,
    priceYearly: 35000,
    users: "Priority slot",
    features: [
      { label: "Haircut + styling", included: true },
      { label: "Beard sculpt", included: true },
      { label: "Hair wash & scalp", included: true },
    ],
  },
  {
    id: "executive",
    name: "Executive",
    description: "Full reset jab event / meeting week ho.",
    icon: <Crown className="h-8 w-8 text-primary" />,
    priceMonthly: 5200,
    priceYearly: 48000,
    users: "~2 hrs session",
    features: [
      { label: "Premium grooming package", included: true },
      { label: "Facial + steam", included: true },
      { label: "Complimentary drink", included: true },
    ],
    recommended: true,
  },
  {
    id: "house",
    name: "House Call",
    description: "DHA Phase 2 radius — ghar par senior barber.",
    icon: <Building2 className="h-8 w-8 text-primary" />,
    priceMonthly: 8500,
    priceYearly: 78000,
    users: "Travel + setup",
    features: [
      { label: "Senior barber travel", included: true },
      { label: "Portable kit", included: true },
      { label: "Same-day rush", included: false },
    ],
  },
];

export function PricingPlansSection() {
  const navigate = useNavigate();

  return (
    <section id="packages" className="scroll-mt-24 py-6 md:py-10">
      <PricingModule
        title="Packages (Karachi rates)"
        subtitle="Seedha Rs. — toggle se saalana retainer demo dekho. Asal bill services ke hisaab se booking page par banta hai."
        annualBillingLabel="Saalan package (demo)"
        buttonLabel="Is package se booking"
        plans={PLANS}
        currencyLabel="Rs. "
        onPlanSelect={(planId) => {
          navigate(`/booking?package=${planId}`);
        }}
      />
    </section>
  );
}
