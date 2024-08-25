import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { OAuthUser } from '../Interface/interfaces';

interface OAuthContextProps {
    user: OAuthUser | null;
    setUser: (user: OAuthUser | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
}

const OAuthContext = createContext<OAuthContextProps | undefined>(undefined);

export const OAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<OAuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Retrieve token from localStorage
        const storedToken = localStorage.getItem("google_token");
        if (storedToken) {
          setToken(storedToken);
          // Add logic to fetch and set the user based on the token
        }
      }, []);
    
      useEffect(() => {
        if (token) {
          localStorage.setItem("google_token", token);
        } else {
          localStorage.removeItem("google_token");
        }
      }, [token]);
    
      const logout = () => {
        localStorage.removeItem("google_token");
        setToken(null);
        setUser(null);
      };

    return (
        <OAuthContext.Provider value={{ user, setUser, token, setToken, logout }}>
            {children}
        </OAuthContext.Provider>
    );
};

export const useOAuth = (): OAuthContextProps => {
    const context = useContext(OAuthContext);
    if (!context) {
        throw new Error('useOAuth must be used within an OAuthProvider');
    }
    return context;
};
