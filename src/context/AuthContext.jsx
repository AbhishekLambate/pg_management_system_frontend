import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authLogin } from '../helper/firebase_helper';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('pg_auth_token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUser({
                        username: decoded.sub || decoded.username || 'User',
                        ...decoded
                    });
                } catch (error) {
                    console.error("Invalid token:", error);
                    localStorage.removeItem('pg_auth_token');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authLogin({ username, password });
            const { access_token, token_type } = response.data;

            if (!access_token) {
                return { success: false, error: 'No token received from server.' };
            }

            // Persist token — api_helper interceptor will attach it to all future requests
            localStorage.setItem('pg_auth_token', access_token);

            // Decode JWT to extract user info (sub = username in your backend)
            try {
                const decoded = jwtDecode(access_token);
                setUser({
                    username: decoded.sub || username,
                    name: decoded.sub || username,
                    email: decoded.email || '',
                    role: decoded.role || 'user',
                    ...decoded,
                });
            } catch {
                // Fallback if decode fails
                setUser({ username, name: username });
            }

            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            const detail = error.response?.data?.detail;

            // FastAPI 422 returns detail as an array of validation error objects
            // e.g. [{ type, loc, msg, input, url }] — must convert to string
            let msg;
            if (Array.isArray(detail)) {
                msg = detail.map(d => d.msg || JSON.stringify(d)).join(', ');
            } else if (typeof detail === 'string') {
                msg = detail;
            } else {
                msg = error.response?.data?.message || 'Invalid username or password.';
            }

            return { success: false, error: msg };
        }
    };

    const logout = () => {
        localStorage.removeItem('pg_auth_token');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
