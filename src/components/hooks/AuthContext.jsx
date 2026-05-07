import { createContext, useState, useEffect } from 'react';
import { getUser, saveUser, deleteUser } from './LocalStorageUser';
import axios, { isAxiosError } from 'axios';
import API  from './API';
import { BrowserRouter, useNavigate } from 'react-router';

export const AuthContext = createContext();

const useApi = API();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const validateUser = async () => {
    const currentPath = window.location.pathname;
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

      const response = await axios.post(
        useApi.url + '/user/login',
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      saveUser(response.data);
      setUser(response.data);

    } catch (error) {

      if (
        axios.isAxiosError(error) &&
        error?.response?.status === 403
      ) {
        
        if(currentPath !== '/suspended') {
          window.location.href = '/suspended';
        }
        return;
      }

      if (
        axios.isAxiosError(error) &&
        error?.response?.status === 500
      ) {

        deleteUser();
        setUser(null);
      }

      console.log(error);
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
