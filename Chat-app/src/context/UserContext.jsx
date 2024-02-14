import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [id, setId] = useState(null);
  useEffect(() => {
    axios.get("/profile").then((response) => {
      console.log(response.data);
    });
  }, []);
  return (
    <UserContext.Provider value={{ userEmail, setUserEmail, id, setId }}>
      {children}
    </UserContext.Provider>
  );
};
