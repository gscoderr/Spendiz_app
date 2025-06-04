// 📁 utils/bankSynonymMap.js

export const bankSynonymMap = {
  "HDFC": ["HDFC", "HDFC Bank"],
  "ICICI": ["ICICI", "ICICI Bank"],
  "SBI": ["SBI", "SBI Card", "State Bank of India"],
  "AXIS": ["AXIS", "Axis Bank"],
  "BOB": ["BOB", "Bank of Baroda"],
  "IDFC": ["IDFC", "IDFC FIRST", "IDFC FIRST Bank"],
  "RBL": ["RBL", "RBL Bank"],
  "YES": ["YES", "Yes Bank", "YES Bank"],
  "SCB": ["SCB", "Standard Chartered", "Standard Chartered Bank"],
  "KOTAK": ["KOTAK", "Kotak", "Kotak Mahindra Bank"],
  "INDUSIND": ["INDUSIND", "IndusInd", "IndusInd Bank"],
  "AU": ["AU", "AU Small Finance Bank"],
  "FEDERAL": ["FEDERAL", "Federal", "Federal Bank"],
  "HSBC": ["HSBC", "HSBC Bank"],
  "BOI": ["BOI", "Bank of India"],
  "CANARA": ["CANARA", "Canara Bank"],
  "UNION": ["UNION", "Union Bank of India"],
  "PNB": ["PNB", "Punjab National Bank"], 
  "INDIAN": ["INDIAN", "Indian Bank"],
  "UCO": ["UCO", "UCO Bank"],
  "CENTRAL": ["CENTRAL", "Central Bank of India"],
  "CITY UNION": ["CITY UNION", "City Union Bank"],
  "SIB": ["SIB", "South Indian Bank"],
  "TMB": ["TMB", "Tamilnad Mercantile Bank"],
  "DBS": ["DBS", "DBS Bank"],
  "DHANLAXMI": ["DHANLAXMI", "Dhanlaxmi Bank"],
  "KARNATAKA": ["KARNATAKA", "Karnataka Bank"],
  "KVB": ["KVB", "Karur Vysya Bank"],
  "LIC": ["LIC", "LIC Cards"],
  "IDBI": ["IDBI", "IDBI Bank"],
  "OBC": ["OBC", "Oriental Bank of Commerce"]
};

export const normalizeBankName = (input) => {
  const clean = input?.trim().toUpperCase();
  for (const [canonical, aliases] of Object.entries(bankSynonymMap)) {
    if (aliases.map(a => a.toUpperCase()).includes(clean)) {
      return canonical;
    }
  }
  return clean; // fallback to input if no match found
};
