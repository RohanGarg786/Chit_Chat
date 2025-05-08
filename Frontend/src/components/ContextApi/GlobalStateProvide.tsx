import React, { ReactNode, createContext, useState } from 'react';
import Cookies from 'js-cookie';

interface GlobalState {
    avatar: string,
    setAvatar: (avatar: string) => void,
    isAuthenticated :boolean,
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
  const [isAuthenticated , setIsAuthenticated] =useState<boolean>(!!Cookies.get('token'));

  const login = (token: any) => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
  };

  return (
    <GlobalStateContext.Provider value={{ avatar, setAvatar,isAuthenticated,setIsAuthenticated, login, logout }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
