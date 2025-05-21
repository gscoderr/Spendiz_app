import { synonymMap } from "./synonym.map.js";

export const normalizeInput = (input) => {
  const term = input.toLowerCase().trim();
  for (const key in synonymMap) {
    if (synonymMap[key].includes(term) || key === term) {
      return key;
    }
  }
  return term;
};
