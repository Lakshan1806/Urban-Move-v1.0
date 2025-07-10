import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validateSession() {
      try {
        const response = await axios.get("/admin/profile");
        const data = response.data;
        localStorage.setItem("userData", JSON.stringify(data));
        setUser(data);
      } catch (error) {
        console.error("Session validation failed:", error);
        localStorage.removeItem("userData");
        setUser(null);
      } finally {
        await new Promise((res) => setTimeout(res, 5000));
        setLoading(false);
      }
    }
    validateSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
