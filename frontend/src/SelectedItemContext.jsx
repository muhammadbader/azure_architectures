// src/SelectedItemContext.jsx
import { createContext, useContext, useState } from "react";

const Ctx = createContext();

export function SelectedItemProvider({ children }) {
  const [item, setItem] = useState(null);
  return <Ctx.Provider value={{ item, setItem }}>{children}</Ctx.Provider>;
}

export const useSelectedItem = () => useContext(Ctx);
