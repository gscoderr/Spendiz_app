import React, { createContext, useContext, useState } from "react";

const BestCardContext = createContext();

export const BestCardProvider = ({ children }) => {
  const [bestCard, setBestCard] = useState(null);

  return (
    <BestCardContext.Provider value={{ bestCard, setBestCard }}>
      {children}
    </BestCardContext.Provider>
  );
};

export const useBestCard = () => useContext(BestCardContext);
