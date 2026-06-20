import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const DUMMY_USERS = [
  { id: 'u001', name: 'Admin User', email: 'admin@imperialwheels.com', password: 'admin123', role: 'admin', phone: '+91-75127-16271', joinDate: '2024-01-15', status: 'active', avatar: 'AD' },
  { id: 'u002', name: 'John Doe', email: 'john@example.com', password: 'john123', role: 'customer', phone: '+91-98765-43210', joinDate: '2024-03-20', status: 'active', avatar: 'JD' },
  { id: 'u003', name: 'Priya Sharma', email: 'priya@example.com', password: 'priya123', role: 'customer', phone: '+91-87654-32109', joinDate: '2024-04-12', status: 'active', avatar: 'PS' },
  { id: 'u004', name: 'Rahul Verma', email: 'rahul@example.com', password: 'rahul123', role: 'customer', phone: '+91-76543-21098', joinDate: '2024-05-08', status: 'active', avatar: 'RV' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedUsers = localStorage.getItem('users');
      let users = null;
      if (storedUsers) {
        users = JSON.parse(storedUsers);
      }

      if (!Array.isArray(users) || users.length === 0) {
        localStorage.setItem('users', JSON.stringify(DUMMY_USERS));
      }
    } catch (error) {
      localStorage.setItem('users', JSON.stringify(DUMMY_USERS));
      localStorage.removeItem('currentUser');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('users') || '[]');
    } catch (error) {
      users = DUMMY_USERS;
      localStorage.setItem('users', JSON.stringify(DUMMY_USERS));
    }

    const foundUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!foundUser) {
      return { success: false, error: 'Invalid email or password.' };
    }

    if (foundUser.status === 'blocked') {
      return { success: false, error: 'Your account is blocked.' };
    }

    if (foundUser.password !== normalizedPassword) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const { password: _, ...safeUser } = foundUser;
    setUser(safeUser);
    localStorage.setItem('currentUser', JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isCustomer, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
