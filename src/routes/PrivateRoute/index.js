import React, {useContext, useEffect, useState} from 'react';
import {Route, Redirect} from 'react-router-dom'
import {MenuContext} from "../../state/menuContext";
import jwtDecode from 'jwt-decode';
import {refreshToken} from "../Login/utils";


const PrivateRoute = ({component: Component, ...rest}) => {
    const {menus, dispatch} = useContext(MenuContext)
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    useEffect(() => {
        const isDevMode = window.require('electron-is-dev');
        if (isDevMode) {
            setIsAuthenticated(true)
        } else {
            let token = menus.user?.token ?? null
            if (token) {
                let tokenExpiration = jwtDecode(token).exp;
                let dateNow = new Date();

                if (tokenExpiration < dateNow.getTime() / 1000) {
                    refreshToken(menus.user.refresh).then((newToken) => {
                        if (newToken) {
                            dispatch({type: 'REFRESH_USER_TOKEN', value: newToken})
                            setIsAuthenticated(true)
                        } else {
                            setIsAuthenticated(false)
                        }
                    })
                } else {
                    setIsAuthenticated(true)
                }
            } else {
                setIsAuthenticated(false)
            }
        }
    }, [])

    if (isAuthenticated === null) {
        return <></>
    }

    return (
        <Route {...rest} render={props =>
            !isAuthenticated ? (
                <Redirect to='/login'/>
            ) : (
                <Component {...props} />
            )
        }
        />
    );
};

export default PrivateRoute;