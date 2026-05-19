import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

import {
  FooterBackgroundGradient,
  TextHoverEffect,
} from "@/components/ui/hover-footer";

const footerLinks = [
  {
    title: "Studio",
    links: [
      { label: "Services", href: "/#services" },
      { label: "Packages", href: "/#packages" },
      { label: "Gallery", href: "/#gallery" },
      { label: "Booking", href: "/booking" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/#contact" },
      { label: "Privacy", href: "#" },
    ],
  },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "X", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="relative mx-4 mb-8 mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0c]/80 md:mx-8">
      <div className="relative z-10 mx-auto max-w-7xl p-10 md:p-14">
        <div className="grid grid-cols-1 gap-10 pb-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          <div className="space-y-4">
            <p className="font-display text-2xl font-semibold tracking-tight text-white">
              FadeCraft<span className="text-primary">.</span>
            </p>
            <p className="text-sm leading-relaxed text-muted">
              Precision cuts and modern grooming for guests who care about
              silence, symmetry, and schedule.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">
                {section.title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") || link.href === "#" ? (
                      <a
                        href={link.href}
                        className="text-muted transition-colors hover:text-primary"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-muted transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">
              Social
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted transition-all hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted">
              © {new Date().getFullYear()} FadeCraft Studio. University demo
              frontend — brand and copy are fictional.
            </p>
          </div>
        </div>

        <div className="hidden h-52 lg:flex lg:-translate-y-6">
          <TextHoverEffect text="FadeCraft" className="z-20 max-w-full" />
        </div>
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
