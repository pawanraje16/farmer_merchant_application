import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../utils/api"; // Your axios instance with withCredentials: true

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isFarmer, setIsFarmer] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    // (async () => {
    //   try {
    //     const { data } = await api.get("/api/v1/users/is-auth"); // ✅ use consistent path
    //     if (data.success) {
    //       setUser(data.user);
    //       // setIsFarmer(data.user.userType === "farmer");
    //     }
    //   } catch (error) {
    //     setUser(null);
    //   } finally {
    //     setLoadingAuth(false);
    //   }
    // })();
  }, []);

  // Register
  const register = async (payload) => {
    try {
      const { data } = await api.post("/api/v1/users/register", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      data.success
        ? handleAuthSuccess(data.user)
        : toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Login
  const login = async (payload) => {
    try {
      const { data: responseData } = await api.post("/api/v1/users/login",
        {
        email: payload.email, 
        password: payload.password
      });
      const {success, data}=responseData;
      if(success){
        handleAuthSuccess(data.user)
        return data.user;
      }
      else {
        toast.error(data.message);
        return null;
      }
      
    } catch (err) {
      toast.error(err.message);
      return null;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const response  = await api.post("/api/v1/users/logout");
      toast.success(response?.data?.message);
    } catch(error){
      toast.error("Log out failed");
      console.error(error.message);
    } 
    finally {
      setUser(null);
      setIsFarmer(false);
    }
  };

  const handleAuthSuccess = (u) => {
    setUser(u);
    // setIsFarmer(u.userType === "farmer");
    toast.success("Welcome to AgroConnect!");
  };

  return (
    <AuthContext.Provider
      value={{ user, isFarmer, loadingAuth, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
