import { useContext } from "react";
import AuthContext from "./AuthContext";

const useAuth = (): [any | null, string | null] => {
  const context = useContext<any | undefined>(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, token } = context;
  return [user, token];
};

export default useAuth;
