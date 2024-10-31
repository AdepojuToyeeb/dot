"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalStateContextType {
  isSheetOpen: boolean;
  toggleCartSheet: () => void;
  resetAllStates: () => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const toggleCartSheet = () => setIsSheetOpen((prev) => !prev);

  const resetAllStates = () => {
    setIsSheetOpen(false);
  };

  const contextValue = {
    isSheetOpen,
    toggleCartSheet,
    resetAllStates,
  };

  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to use the global state
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);

  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }

  return context;
};
