export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

export const TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Zain Alvi",
    role: "Lead Barber · Fades",
    bio: "Specialist in skin fades, texture styling, and razor line architecture.",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Rayan Qureshi",
    role: "Master Barber · Beards",
    bio: "Beard geometry, hot towel rituals, and executive grooming sessions.",
    image:
      "https://images.unsplash.com/photo-1621605815971-fb98fc665db8?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Saad Mirza",
    role: "Creative Director",
    bio: "Shapes modern silhouettes for shoots, weddings, and everyday confidence.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
];
