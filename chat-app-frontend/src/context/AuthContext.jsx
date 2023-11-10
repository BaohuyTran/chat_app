import { createContext, useCallback, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [registerError, setRegisterError] = useState(null);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(async (event) => {
    event.preventDefault();

    setIsRegisterLoading(true);
    setRegisterError(null);

    const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
    console.log(JSON.stringify(registerInfo));

    setIsRegisterLoading(false);

    if (response.error) {
      return setRegisterError(response);
    }

    localStorage.setItem("User", JSON.stringify(response)); // to remember the user
    setUser(response);
  }, [registerInfo]);

  return (
    <AuthContext.Provider value={{ user, registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
