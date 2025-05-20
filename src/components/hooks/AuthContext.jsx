import { createContext, useState, useEffect } from 'react';
import { getUser, saveUser, deleteUser } from './LocalStorageUser';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const validateUser = async () => {
  const u = getUser('user');
  if (!u || !u.email || !u.password || !u.role) {
    deleteUser();
    return;
  }

  const data = {
    email: u.email,
    password: u.password,
    role: u.role,
    encrypted: true
  };

  try {
    const response = await axios.post('http://localhost:8080/api/user/login', data, {
      headers: { 'Content-Type': 'application/json' }
    });
    saveUser(response.data);
    setUser(response.data);
  } catch (error) {
    if (error.status === 500) {
      deleteUser();
      setUser(null);
      console.log("Login error: " + error.message);
    }
    console.log("Error: "+error.message);
  }
};


  useEffect(() => {
    validateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
