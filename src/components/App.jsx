import React, { useContext, useEffect } from 'react';
import {
  HashRouter as Router,
  Routes as Switch,
  Route,
} from 'react-router-dom';
import MainMenu from './MainMenu';
import Page from '../routes/index';
import Login from '../routes/Login';
import { MenuContext } from '../state/menuContext';
import FabLogin from './FabLogin';
import FabProfile from './FabProfile';
import PrivateRoute from '../routes/PrivateRoute';
import { get } from '../utils/requests';

const { ipcRenderer } = window.require('electron');

function App() {
  const { menus, dispatch } = useContext(MenuContext);
  const settings = ipcRenderer.sendSync('get-user-settings');

  const handleKeyDown = (e) => {
    if (e.key === 'PageDown' || e.key === 'PageUp') {
      const { id } = document.activeElement;
      const [, fieldIndex] = id.split('-');
      let nextSibling;
      if (e.key === 'PageDown') {
        nextSibling = document.querySelector(
          `[id=input-${parseInt(fieldIndex, 10) + 1}]`,
        );
      }
      if (e.key === 'PageUp') {
        nextSibling = document.querySelector(
          `[id=input-${parseInt(fieldIndex, 10) - 1}]`,
        );
      }
      if (nextSibling !== null) {
        nextSibling.focus();
        if (nextSibling.select) {
          nextSibling.select();
        }
      } else {
        nextSibling = document.getElementById('input-1');
        if (nextSibling !== null) {
          nextSibling.focus();
          if (nextSibling.select) {
            nextSibling.select();
          }
        } else {
          nextSibling = document.getElementById('a11y-tab-0');
          if (nextSibling !== null) {
            nextSibling.focus();
            dispatch({ type: 'RESET_MENU' });
          }
        }
      }
    }
  };

  useEffect(() => {
    function checkUserLoginStatus() {
      get('status', (data) => {
        if (data.ok) {
          if (settings.user.token !== menus.user?.token) {
            dispatch({ type: 'UPDATE_USER', value: settings.user });
          }
        } else {
          dispatch({ type: 'LOGOUT_USER' });
        }
      }, null, settings.user.token);
    }

    document.addEventListener('keydown', handleKeyDown);

    if (settings?.user?.token) {
      checkUserLoginStatus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });
  return (
    <Router>
      <Switch>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/:page" element={<PrivateRoute />}>
          <Route exact path="/:page" element={<Page />} />
        </Route>
        <Route
          path="/"
          element={(
            <>
              <MainMenu />
              {menus.user?.name?.length > 0
                ? <FabProfile menus={menus} dispatch={dispatch} />
                : <FabLogin menus={menus} dispatch={dispatch} />}
            </>
        )}
        />
      </Switch>
    </Router>
  );
}

export default App;
