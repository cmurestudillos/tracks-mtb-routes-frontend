import { createContext, useEffect, useState } from 'react';
import service from '../service/config.service';

const AuthContext = createContext();

function AuthWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);

  const authenticateUser = async () => {
    try {
      const response = await service.get('/auth/verify');
      setIsLoggedIn(true);
      setLoggedUserId(response.data._id);
    } catch {
      setIsLoggedIn(false);
      setLoggedUserId(null);
    }
  };
  const passedContext = {
    isLoggedIn,
    loggedUserId,
    authenticateUser,
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return <AuthContext.Provider value={passedContext}>{props.children}</AuthContext.Provider>;
}

export { AuthContext, AuthWrapper };
