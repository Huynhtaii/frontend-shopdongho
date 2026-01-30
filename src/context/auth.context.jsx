import { createContext, useState } from 'react';

const AuthContext = createContext({
   auth: {
      isLoading: true,
      isAuthenticated: false,
      user: {
         id: '',
         email: '',
         name: '',
         role: '',
      },
   },
   setAuth: () => {},
});

export const AuthWrapper = ({ children }) => {
   const [auth, setAuth] = useState({
      isLoading: true,
      isAuthenticated: false,
      user: {
         id: '',
         email: '',
         name: '',
         role: '',   
      },
   });

   return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
