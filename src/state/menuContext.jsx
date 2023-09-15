import React, { createContext, useMemo, useReducer } from 'react';
import reducer from './reducer';

export const MenuContext = createContext(undefined);

function MenuProvider({ children }) {
  const [menus, dispatch] = useReducer(
    reducer,
    {
      mainMenu: 0,
      subMenu: 0,
      category: 0,
      subCategory: 0,
      autoFocus: 0,
      user: {
        name: '',
        token: '',
        refresh: '',
      },
    },
    undefined,
  );
  const menuContextProviderValue = useMemo(
    () => ({ menus, dispatch }),
    [menus, dispatch],
  );

  return (
    <MenuContext.Provider value={menuContextProviderValue}>
      {children}
    </MenuContext.Provider>
  );
}

export default MenuProvider;
