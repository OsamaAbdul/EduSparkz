import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("user"); 
    }
    setIsLoading(false); 
  }, []);

  // ========Logout=========
  const logOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };


  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logOut}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);