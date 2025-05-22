// import { synonymMap } from "./synonym.map.js";

// export const normalizeInput = (input) => {
//   const term = input.toLowerCase().trim();
//   for (const key in synonymMap) {
//     if (synonymMap[key].includes(term) || key === term) {
//       return key;
//     }
//   }
//   return term;
// };





// utils/normalizeInput.js

import { synonymMap } from "./synonym.map.js";

/**
 * Normalizes a user input based on the predefined synonym map.
 * E.g. "Flights" or "air travel" → "flights"
 *
 * @param {string} input - The user-entered category/subcategory.
 * @returns {string} - Standardized key to be used in DB matching.
 */
export const normalizeInput = (input = "") => {
  const term = input.toLowerCase().trim();

  // ✅ First check direct key match
  for (const key in synonymMap) {
    if (key.toLowerCase() === term) {
      return key;
    }
  }

  // ✅ Then check values match inside synonymMap
  for (const key in synonymMap) {
    const values = synonymMap[key].map((v) => v.toLowerCase().trim());
    if (values.includes(term)) {
      return key;
    }
  }

  // 🔁 Default: return cleaned version
  return term;
};