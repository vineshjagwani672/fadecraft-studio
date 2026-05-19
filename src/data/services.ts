export type ServiceCategory = "cut" | "beard" | "care" | "package" | "kids";

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
  category: ServiceCategory;
};

/** Karachi-friendly demo rates (PKR) — adjust anytime */
export const SERVICES: Service[] = [
  {
    id: "haircut",
    name: "Signature Haircut",
    description: "Consultation, clean cut, finish — office ya college dono ke liye.",
    price: 1800,
    durationMin: 45,
    category: "cut",
  },
  {
    id: "skin-fade",
    name: "Skin Fade",
    description: "Tight fade, neat lines — Clifton / DHA style finish.",
    price: 2200,
    durationMin: 55,
    category: "cut",
  },
  {
    id: "beard-trim",
    name: "Beard Sculpt",
    description: "Shape, line-up, soft towel finish.",
    price: 1200,
    durationMin: 30,
    category: "beard",
  },
  {
    id: "hair-wash",
    name: "Hair Wash & Scalp",
    description: "Fresh wash, light massage — garmi mein best add-on.",
    price: 800,
    durationMin: 20,
    category: "care",
  },
  {
    id: "facial",
    name: "Refresh Facial",
    description: "Steam, cleanse, hydrate — thakawat utarne ke liye.",
    price: 2500,
    durationMin: 40,
    category: "care",
  },
  {
    id: "styling",
    name: "Hair Styling",
    description: "Shaadi / event look — matte ya natural shine.",
    price: 1500,
    durationMin: 25,
    category: "care",
  },
  {
    id: "kids",
    name: "Kids Haircut",
    description: "Aram se, patient cut — chhotay guests ke liye.",
    price: 1400,
    durationMin: 35,
    category: "kids",
  },
  {
    id: "premium-grooming",
    name: "Premium Grooming Package",
    description: "Haircut + beard + wash + facial + styling — full reset ek session mein.",
    price: 5200,
    durationMin: 120,
    category: "package",
  },
];

export const TAX_RATE = 0.05;
export const SERVICE_FEE_PKR = 100;

export function getServiceById(id: string) {
  return SERVICES.find((s) => s.id === id);
}
