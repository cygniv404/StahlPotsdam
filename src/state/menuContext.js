import React, {createContext, useReducer} from "react";
import {reducer} from "./reducer";

export const MenuContext = createContext(undefined);

const MenuProvider = ({children}) => {
    const [menus, dispatch] = useReducer(reducer,
        {
            mainMenu: 0, subMenu: 0, category: 0, subCategory: 0, autoFocus: 0, user: {
                name: '',
                token: '',
                refresh: ''
            }
        });

    return (
        <MenuContext.Provider value={{menus, dispatch}}>
            {children}
        </MenuContext.Provider>
    );
};

export default MenuProvider;