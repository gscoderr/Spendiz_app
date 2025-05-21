import React, { createContext, useContext, useState } from "react";

const BestCardContext = createContext();

export const BestCardProvider = ({ children }) => {
  const [bestCards, setBestCards] = useState([]);

  return (
  <BestCardContext.Provider value={{ bestCards, setBestCards }}>

      {children}
    </BestCardContext.Provider>
  );
};

export const useBestCard = () => useContext(BestCardContext);
