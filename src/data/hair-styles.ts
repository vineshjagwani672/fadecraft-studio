import { Scissors, Sparkles, Waves, Crown, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type HairStyle = {
  id: string;
  name: string;
  blurb: string;
  Icon: LucideIcon;
};

export const HAIR_STYLES: HairStyle[] = [
  {
    id: "mid-fade",
    name: "Mid Fade",
    blurb: "Balanced transition for professional and streetwear looks.",
    Icon: Waves,
  },
  {
    id: "low-taper",
    name: "Low Taper",
    blurb: "Subtle weight removal with a clean neckline.",
    Icon: Wind,
  },
  {
    id: "textured-crop",
    name: "Textured Crop",
    blurb: "Movement-forward finish with matte separation.",
    Icon: Scissors,
  },
  {
    id: "side-part",
    name: "Classic Side Part",
    blurb: "Polished silhouette for events and boardroom days.",
    Icon: Crown,
  },
  {
    id: "burst-fade",
    name: "Burst Fade",
    blurb: "Curved arc around the ear for a sculpted profile.",
    Icon: Sparkles,
  },
  {
    id: "french-crop",
    name: "French Crop",
    blurb: "Short fringe with tight sides for low-maintenance edge.",
    Icon: Scissors,
  },
];
