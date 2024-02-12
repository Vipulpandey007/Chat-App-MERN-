import { createContext, useState } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [id, setId] = useState(null);
  return (
    <UserContext.Provider value={{ userEmail, setUserEmail, id, setId }}>
      {children}
    </UserContext.Provider>
  );
};
