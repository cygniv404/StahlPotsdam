import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { MenuContext } from '../../state/menuContext';
import { refreshToken } from '../Login/utils';

function PrivateRoute() {
  const { menus, dispatch } = useContext(MenuContext);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    const isDev = window.require('electron-is-dev');
    if (isDev) {
      setIsAuthenticated(true);
    } else {
      const token = menus.user?.token ?? null;
      if (token) {
        const tokenExpiration = jwtDecode(token).exp;
        const dateNow = new Date();

        if (tokenExpiration < dateNow.getTime() / 1000) {
          refreshToken(menus.user.refresh).then((newToken) => {
            if (newToken) {
              dispatch({ type: 'REFRESH_USER_TOKEN', value: newToken });
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          });
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [dispatch, menus.user]);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
