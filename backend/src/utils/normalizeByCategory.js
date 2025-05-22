import { synonymMap } from "./synonym.map.js";

export const findSubCategoryKey = (category = "", input = "") => {
  const cat = category.toLowerCase().trim();
  const term = input.toLowerCase().trim();

  const subMap = synonymMap[cat];
  if (!subMap) return term;

  for (const key in subMap) {
    if (subMap[key].includes(term)) {
      return key; // 'Flights' → 'flight'
    }
  }

  return term;
};
