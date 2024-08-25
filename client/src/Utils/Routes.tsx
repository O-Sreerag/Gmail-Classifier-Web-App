import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useOAuth } from '../Contexts/OAuthContext';
import axios from 'axios';

interface ProtectedRouteProps {
    children: ReactNode;
}

const fetchData = async (google_token: string, setUser: (user: any) => void) => {
    try {
        const userinfoRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json`,
            {
                headers: {
                    Authorization: `Bearer ${google_token}`,
                    Accept: 'application/json'
                }
            }
        );
        // console.log(userinfoRes.data);
        setUser(userinfoRes.data);
    } catch (error) {
        console.error(error);
    }
};

export const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { setUser, setToken } = useOAuth();
    const google_token: string | null = localStorage.getItem("google_token");

    useEffect(() => {
        if (google_token) {
            setToken(google_token);
            fetchData(google_token, setUser);
        }
    }, [google_token, setToken, setUser]);

    return google_token ? (
        <Navigate to='/home' />
    ) : (
        <>{children}</>
    );
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { setUser, setToken } = useOAuth();
    const google_token: string | null = localStorage.getItem("google_token");

    useEffect(() => {
        if (google_token) {
            setToken(google_token);
            fetchData(google_token, setUser);
        }
    }, [google_token, setToken, setUser]);

    return google_token ? (
        <>{children}</>
    ) : (
        <Navigate to='/login' />
    );
};
