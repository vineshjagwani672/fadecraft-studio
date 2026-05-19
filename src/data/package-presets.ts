export const PACKAGE_PRESETS: Record<
  string,
  { label: string; serviceIds: string[] }
> = {
  essential: {
    label: "Essential duo",
    serviceIds: ["haircut", "beard-trim"],
  },
  classic: {
    label: "Classic triple",
    serviceIds: ["haircut", "beard-trim", "hair-wash"],
  },
  executive: {
    label: "Executive reset",
    serviceIds: ["premium-grooming"],
  },
  house: {
    label: "House call",
    serviceIds: ["premium-grooming", "styling"],
  },
};
