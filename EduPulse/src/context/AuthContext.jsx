import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));
  useEffect(() => {
    if (!localStorage.getItem("token")) return setLoading(false);
    API.get("/auth/me").then(({ data }) => setUser(data.data.user)).catch(() => { localStorage.removeItem("token"); localStorage.removeItem("user"); setToken(null); setUser(null); }).finally(() => setLoading(false));
  }, []);
  const login = ({ token: nextToken, user: currentUser }) => { localStorage.setItem("token", nextToken); localStorage.setItem("user", JSON.stringify(currentUser)); setToken(nextToken); setUser(currentUser); };
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); setToken(null); setUser(null); };
  return <AuthContext.Provider value={{ user, token, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
