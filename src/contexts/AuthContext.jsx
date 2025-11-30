import { createContext, useState, useEffect } from 'react';

// Fake auth API that always succeeds regardless of password
const fakeAuthAPI = {
  login: async (username, password) => {
    // Always succeed, return a fake token and user
    return {
      success: true,
      data: {
        token: 'fake-token',
        user: { username, role: 'admin' }
      }
    };
  }
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fakeAuthAPI.login(username, password);
      if (response?.success && response?.data?.token && response?.data?.user) {
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }
      // If the API responds but not in the expected shape, surface error
      return { success: false, message: response?.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};