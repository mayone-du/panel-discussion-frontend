import { createContext, useState } from "react";
import { USER_CONTEXT } from "src/types/types";

export const UserContext = createContext<USER_CONTEXT>({
  isAdminLogin: false,
  setIsAdminLogin: () => {},
});

export const UserContextProvider: React.FC = ({ children }) => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const value = {
    isAdminLogin: isAdminLogin,
    setIsAdminLogin: setIsAdminLogin,
  };

  return (
    <>
      <UserContext.Provider value={value}>{children}</UserContext.Provider>
    </>
  );
};
