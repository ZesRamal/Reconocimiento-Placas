import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        setIsAuthenticated(!!token);
        setAccessToken(token);
    }, []);
    
    const login = (access_token, refresh_token) => {
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        setAccessToken(access_token);
        setIsAuthenticated(true);
    };
    
    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setAccessToken(null);
        setIsAuthenticated(false);
    };
    
    const renewAccessToken = async () => {
        const refresh_token = localStorage.getItem("refresh_token");
        if (!refresh_token) {
            logout();
            return;
        }
        try {
            const response = await axios.post("http://localhost:5000/refresh", {}, {
                headers: {
                    Authorization: `Bearer ${refresh_token}`,
                },
            });
            const { access_token } = response.data;
            localStorage.setItem("access_token", access_token);
            setAccessToken(access_token);
        } catch (error) {
            console.error("Error renovando el token de acceso:", error);
            logout();
        }
    };

    const authHeader = () => ({
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, renewAccessToken, authHeader }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);