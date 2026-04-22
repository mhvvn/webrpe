import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { USERS_DATA } from '../constants';
import { User, Role } from '../types';
import api from '../services/api';
import Toast from '../components/Toast';

interface UserContextType {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: User) => Promise<boolean>;
  updateUser: (user: User) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning'; show: boolean }>({
    message: '',
    type: 'success',
    show: false
  });

  // Initialize: Check if user is already logged in
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const user = await api.getMe();
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        } catch (err) {
          console.warn('Session expired or invalid');
          api.logout();
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Auto-logout on inactivity (7 minutes)
  useEffect(() => {
    const TIMEOUT_DURATION = 7 * 60 * 1000; // 7 minutes
    let timeoutId: NodeJS.Timeout;

    const handleInactive = () => {
      if (currentUser) {
        console.warn('User logged out due to inactivity');
        logout();
        setToast({
          show: true,
          message: 'Sesi Anda telah berakhir.',
          type: 'warning'
        });
      }
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (currentUser) {
        timeoutId = setTimeout(handleInactive, TIMEOUT_DURATION);
      }
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    if (currentUser) {
      resetTimer();
      events.forEach(event => document.addEventListener(event, resetTimer));
    }

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [currentUser]);

  // Fetch users from API (for admin panel)
  const refreshUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.warn('Failed to fetch users from API, using mock data');
      setUsers([]);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await api.login(username, password);
      setCurrentUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      return true;
    } catch (error) {
      console.error('Login failed:', error);

      return false;
    }
  };

  const logout = () => {
    api.logout();
    setCurrentUser(null);
  };

  const addUser = async (user: User): Promise<boolean> => {
    try {
      const newUser = await api.createUser(user);
      setUsers(prev => [...prev, newUser]);
      return true;
    } catch (err) {
      console.error('Failed to add user:', err);
      return false;
    }
  };

  const updateUser = async (user: User): Promise<boolean> => {
    try {
      const updated = await api.updateUser(user.id, user);
      setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));

      // Update current user if editing self
      if (currentUser && currentUser.id === updated.id) {
        setCurrentUser(updated);
        localStorage.setItem('currentUser', JSON.stringify(updated));
      }
      return true;
    } catch (err) {
      console.error('Failed to update user:', err);
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      await api.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      return true;
    } catch (err) {
      console.error('Failed to delete user:', err);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        loading,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        refreshUsers,
      }}
    >
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};