import { createContext, useContext, useState } from "react";

const ContractContext = createContext();

export function ContractProvider({ children }) {
  const [selectedContract, setSelectedContract] = useState(
    "V2_WITH_L2_GAS_VERIF"
  );

  return (
    <ContractContext.Provider value={{ selectedContract, setSelectedContract }}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
}
