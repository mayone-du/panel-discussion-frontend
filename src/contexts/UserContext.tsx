import { createContext, useState } from "react";
import { USER_CONTEXT } from "src/types/types";

export const UserContext = createContext<any>({});

export const UserContextProvider: React.FC = ({ children }) => {
  const [adminUsername, setAdminUsername] = useState('');

  const value = {
    adminUsername: adminUsername,
    setAdminUsername: setAdminUsername,
  }

  return (
    <>
      <UserContext.Provider value={value}>{children}</UserContext.Provider>
    </>
  );
};
