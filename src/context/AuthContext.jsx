import React, { createContext, useContext, useState, useEffect } from 'react';

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

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Register new user
    const register = (username, email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if user already exists
        if (users.some((u) => u.email === email)) {
            throw new Error('Email đã được sử dụng');
        }

        if (users.some((u) => u.username === username)) {
            throw new Error('Tên đăng nhập đã tồn tại');
        }

        const newUser = {
            id: Date.now(),
            username,
            email,
            password,
            tickets: []
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after register
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        setUser(userWithoutPassword);
        localStorage.setItem(
            'currentUser',
            JSON.stringify(userWithoutPassword)
        );

        return userWithoutPassword;
    };

    // Login user
    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(
            (u) => u.email === email && u.password === password
        );

        if (!user) {
            throw new Error('Email hoặc mật khẩu không đúng');
        }

        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        setUser(userWithoutPassword);
        localStorage.setItem(
            'currentUser',
            JSON.stringify(userWithoutPassword)
        );

        return userWithoutPassword;
    };

    // Logout user
    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    // Update user tickets
    const addTicket = (ticket) => {
        if (!user) return;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u) => u.id === user.id);

        if (userIndex !== -1) {
            users[userIndex].tickets = users[userIndex].tickets || [];
            users[userIndex].tickets.push(ticket);
            localStorage.setItem('users', JSON.stringify(users));

            const updatedUser = { ...user, tickets: users[userIndex].tickets };
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
    };

    // Check if user is admin
    const isAdmin = () => {
        return user && user.email === 'admin@cinema.vn';
    };

    // Initialize admin account if not exists
    useEffect(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const adminExists = users.some((u) => u.email === 'admin@cinema.vn');

        if (!adminExists) {
            const adminUser = {
                id: 0,
                username: 'admin',
                email: 'admin@cinema.vn',
                password: 'admin123',
                tickets: [],
                isAdmin: true
            };
            users.push(adminUser);
            localStorage.setItem('users', JSON.stringify(users));
        }
    }, []);

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        addTicket,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
