import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createApi } from "../utilities/apiHandler";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = useMemo(() => createApi(), []);

  // Fetch user data on app load
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const result = await api.get("/user");
        setUser(result);
      } catch (error) {
        //console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        api
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
