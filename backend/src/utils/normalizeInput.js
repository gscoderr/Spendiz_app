// // import { synonymMap } from "./synonym.map.js";

// // export const normalizeInput = (input) => {
// //   const term = input.toLowerCase().trim();
// //   for (const key in synonymMap) {
// //     if (synonymMap[key].includes(term) || key === term) {
// //       return key;
// //     }
// //   }
// //   return term;
// // };





// // utils/normalizeInput.js

// import { synonymMap } from "./synonym.map.js";

// /**
//  * Normalizes a user input based on the predefined synonym map.
//  * E.g. "Flights" or "air travel" → "flights"
//  *
//  * @param {string} input - The user-entered category/subcategory.
//  * @returns {string} - Standardized key to be used in DB matching.
//  */
// // export const normalizeInput = (input = "") => {
// //   const term = input.toLowerCase().trim();

// //   // ✅ First check direct key match
// //   for (const key in synonymMap) {
// //     if (key.toLowerCase() === term) {
// //       return key;
// //     }
// //   }

// //   // ✅ Then check values match inside synonymMap
// //   for (const key in synonymMap) {
// //     const values = synonymMap[key].map((v) => v.toLowerCase().trim());
// //     if (values.includes(term)) {
// //       return key;
// //     }
// //   }

// //   // 🔁 Default: return cleaned version
// //   return term;
// // };

// export const normalizeInput = (input = "") => {
//   const term = input.toLowerCase().trim();
//   if (synonymMap[term]) return term;
//   for (const key in synonymMap) {
//     if (synonymMap[key].includes(term)) return key;
//   }
//   return term;
// };

import { synonymMap } from "./synonym.map.js";

/**
 * Maps a user-entered subcategory like "Flights" to internal key like "flight"
 * within the context of the selected main category (e.g., "travel").
 */
export const findSubCategoryKey = (mainCategory = "", userInput = "") => {
  const category = mainCategory.toLowerCase().trim();
  const input = userInput.toLowerCase().trim();

  const subMap = synonymMap[category];
  if (!subMap) return input;

  for (const subKey in subMap) {
    if (subMap[subKey].includes(input)) {
      return subKey; // ✅ 'Flights' → 'flight'
    }
  }

  return input; // fallback if no match
};