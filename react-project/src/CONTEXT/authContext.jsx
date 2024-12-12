/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children, currentPath }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const allowedRoutes = ["/","/firstView"];

  useEffect(() => {
    async function fetchData() {
      console.log(currentPath);
    if(!allowedRoutes.includes(currentPath))
      return;
      await initializeUser();
    }
    fetchData();
  }, []);

  async function initializeUser() {
    setLoading(true);
    const token = localStorage.getItem("token");
    // console.log("___________________________________")
    // console.log(token);

    if(token){
      try{
        const response = await axios.get("http://localhost:3000/verifyToken", {
          headers: {Authorization: token},
        });
        console.log(response.data.user)
        if(response.data && response.data.user){
          setCurrentUser(response.data.user);
          setUserLoggedIn(true);
        } else {
          logout();
        }
      } catch (error) {
        console.log("Token validation failed:", error);
        logout();
      }
    } else {
      logout();
    }

    setLoading(false);
  }

  function logout() {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setUserLoggedIn(false);
  }

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    logout,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
