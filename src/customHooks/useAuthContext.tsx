import { useContext } from "react";
import { AuthProvider } from "../contexts/UserContext";

export const useAuthContext = () => {
  const context = useContext(AuthProvider);
  if (context === undefined) {
    throw new Error("useAuthContext() must be used inside a auth provider");
  }

  return context;
};