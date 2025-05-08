import React, { ReactNode, createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

interface GlobalState {
    avatar: string,
    setAvatar: (avatar: string) => void,
    isAuthenticated :boolean | null,
    loading: boolean,
    setIsAuthenticated : (value:boolean) =>void,
    login:(token:string)=>void,
    logout:()=>void

  }
  interface GlobalStateProviderProps {
    children: ReactNode;
}

export const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider: React.FC<GlobalStateProviderProps>  = ({ children }) => {
  const [avatar, setAvatar] = useState<string>('Initial Global State');
  const [isAuthenticated , setIsAuthenticated] =useState<boolean | null>(null)
  const [loading, setLoading] = useState(true);

  const login = (token: any) => {
    setIsAuthenticated(true);
    console.log("Login successful, token:", token);
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
  };

  // ✅ Ping backend to check login status using cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);
  return (
    <GlobalStateContext.Provider value={{ avatar, setAvatar,isAuthenticated,setIsAuthenticated, login, logout,loading }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
