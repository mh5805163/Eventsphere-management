import { createContext, useContext, useEffect, useState } from "react";
import { demoStore, hasDemoSession, signOut } from "../services/demoStore";
const Context = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (hasDemoSession())
      demoStore("/auth/me")
        .then(setUser)
        .catch(signOut)
        .finally(() => setLoading(false));
    else setLoading(false);
  }, []);
  async function authenticate(action, values) {
    const result = await demoStore(`/auth/${action}`, {
      method: "POST",
      body: values,
    });
    setUser(result.user);
    return result.user;
  }
  function logout() {
    signOut();
    setUser(null);
  }
  return (
    <Context.Provider value={{ user, setUser, loading, authenticate, logout }}>
      {children}
    </Context.Provider>
  );
}
export const useAuth = () => useContext(Context);
