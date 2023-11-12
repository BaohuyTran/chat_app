import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: ""
  });


  useEffect(() => {
    const user = localStorage.getItem("User");
    setUser(JSON.parse(user));
  }, [])

  // Register
  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setActionError(null);

    const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
    console.log(JSON.stringify(registerInfo));

    setIsLoading(false);

    if (response.error) {
      return setActionError(response);
    }

    localStorage.setItem("User", JSON.stringify(response)); // to remember the user
    setUser(response);
  }, [registerInfo]);

  // Log in
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const loginUser = useCallback(async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setActionError(null);

    const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
    console.log(JSON.stringify(loginInfo));

    setIsLoading(false);

    if (response.error) {
      return setActionError(response);
    }

    localStorage.setItem("User", JSON.stringify(response)); // to remember the user
    setUser(response);
  }, [loginInfo]);

  // Log out
  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        actionError,
        isLoading,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        loginInfo,
        updateLoginInfo,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
