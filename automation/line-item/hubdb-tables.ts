export const HUBDB = {
  radioSpots: {
    tableId: "714873037",
    filterColumns: ["name", "week_type", "time_category", "plattform"] as const,
  },
  digitalSpots: {
    tableId: "714786038",
    filterColumns: ["name", "plattform", "count_of_targetings"] as const,
  },
  audioProduction: {
    tableId: "756822227",
    filterColumns: ["name", "production_type"] as const,
  },
  radioSponsoring: {
    tableId: "714873039",
    filterColumns: ["name", "rubric", "plattform"] as const,
  },
} as const;

export type ProductType = keyof typeof HUBDB;

export function resolveProductType(
  name: string | null | undefined,
): ProductType | undefined {
  if (!name) return undefined;
  const n = name.trim();
  if (n === "Radio Spots") return "radioSpots";
  if (n === "Digital Spots") return "digitalSpots";
  if (n === "Audio Produktion") return "audioProduction";
  if (n === "Radio Sponsoring") return "radioSponsoring";
  return undefined;
}

