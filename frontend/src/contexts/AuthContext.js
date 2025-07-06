// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getProfile } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const response = await getProfile();
                    setUser(response.data.user);
                    console.log('✅ User authenticated from stored token');
                } catch (error) {
                    console.error('❌ Token validation failed:', error.response?.data?.message || error.message);
                    localStorage.removeItem('token');
                }
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await apiLogin(credentials);
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            setUser(user);

            console.log('✅ Login successful:', user.username);

            return { success: true, user };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            console.error('❌ Login failed:', errorMessage);

            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await apiRegister(userData);
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            setUser(user);

            console.log('✅ Registration successful:', user.username);

            return { success: true, user };
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.details ||
                'Registration failed';
            console.error('❌ Registration failed:', errorMessage);

            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        console.log('✅ User logged out');
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};