export type Review = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Ahmed Raza",
    role: "Product Lead, Karachi",
    quote:
      "Easily the most consistent fades I have had in the city. The studio feels private, calm, and intentional.",
    rating: 5,
  },
  {
    id: "2",
    name: "Hassan Malik",
    role: "Creative Director",
    quote:
      "They actually listen — line work is sharp, timing is respectful, and the finish photographs beautifully.",
    rating: 5,
  },
  {
    id: "3",
    name: "Omar Siddiqui",
    role: "Founder, Studio North",
    quote:
      "Premium grooming without the theatrics. The package session is worth every rupee before a big pitch week.",
    rating: 5,
  },
  {
    id: "4",
    name: "Bilal Khan",
    role: "Architect",
    quote:
      "Spotless space, thoughtful lighting, and barbers who obsess over symmetry. This is my monthly ritual now.",
    rating: 5,
  },
];
