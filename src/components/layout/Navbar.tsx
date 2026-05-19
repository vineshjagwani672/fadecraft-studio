import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Philosophy", href: "#why" },
  { label: "Styles", href: "#styles" },
  { label: "Team", href: "#team" },
  { label: "Packages", href: "#packages" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent transition-all duration-300",
        scrolled || open
          ? "border-white/10 bg-background/75 backdrop-blur-2xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-tight text-white md:text-xl"
        >
          FadeCraft<span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={isHome ? item.href : `/${item.href}`}
              className="transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="goldOutline" size="sm" asChild>
            <a href={isHome ? "#booking" : "/#booking"}>Reserve</a>
          </Button>
          <Button size="sm" asChild>
            <Link to="/booking">Book Appointment</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/10 bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={isHome ? item.href : `/${item.href}`}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-muted hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <Button className="mt-2" asChild>
                <Link to="/booking">Book Appointment</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
