import * as React from "react";
import { Check, X } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  priceMonthly: number;
  priceYearly: number;
  users: string;
  features: PlanFeature[];
  recommended?: boolean;
}

export interface PricingModuleProps {
  title?: string;
  subtitle?: string;
  annualBillingLabel?: string;
  buttonLabel?: string;
  plans: PricingPlan[];
  defaultAnnual?: boolean;
  className?: string;
  currencyLabel?: string;
  onPlanSelect?: (planId: string) => void;
}

export function PricingModule({
  title = "Packages",
  subtitle = "Choose a plan that fits your grooming goals.",
  annualBillingLabel = "Member pricing (10% off)",
  buttonLabel = "Book this package",
  plans,
  defaultAnnual = false,
  className,
  currencyLabel = "Rs.",
  onPlanSelect,
}: PricingModuleProps) {
  const [isAnnual, setIsAnnual] = React.useState(defaultAnnual);

  return (
    <section
      className={cn(
        "w-full bg-transparent py-20 text-foreground md:px-8 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-muted md:text-lg">{subtitle}</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={(checked) => setIsAnnual(checked)}
          />
          <label
            htmlFor="billing-toggle"
            className="cursor-pointer text-sm text-muted"
          >
            {annualBillingLabel}
          </label>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative border border-white/10 bg-white/[0.03] text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_20px_60px_-30px_rgba(201,169,98,0.35)]",
                plan.recommended &&
                  "scale-[1.02] border-primary/40 ring-1 ring-primary/25",
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                  Signature
                </div>
              )}

              <CardHeader className="pt-8 text-center">
                <div className="mb-4 flex justify-center">{plan.icon}</div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                <div className="text-3xl font-bold tabular-nums transition-all duration-300">
                  {currencyLabel}
                  {isAnnual ? plan.priceYearly : plan.priceMonthly}
                </div>
                <p className="mb-4 text-sm text-muted">
                  / {isAnnual ? "year (billed upfront)" : "visit baseline"}
                </p>

                <Button
                  type="button"
                  variant={plan.recommended ? "default" : "outline"}
                  className="mb-6 w-full"
                  onClick={() => onPlanSelect?.(plan.id)}
                >
                  {buttonLabel}
                </Button>

                <div className="text-left text-sm">
                  <h4 className="mb-2 font-semibold">Capacity</h4>
                  <p className="mb-4 text-muted">✓ {plan.users}</p>

                  <h4 className="mb-2 font-semibold">Highlights</h4>
                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {f.included ? (
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <X className="h-4 w-4 shrink-0 text-muted" />
                        )}
                        <span
                          className={
                            f.included
                              ? "text-muted"
                              : "text-muted/60 line-through"
                          }
                        >
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
