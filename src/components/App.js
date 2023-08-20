import React, {Fragment, useContext, useEffect, useState} from 'react';
import MainMenu from './MainMenu';
import Page from './../routes/index';
import Login from './../routes/Login';
import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {MenuContext} from "../state/menuContext";
import FabLogin from "./FabLogin";
import FabProfile from "./FabProfile";
import PrivateRoute from "../routes/PrivateRoute";
import {get} from "../utils/requests";

const {ipcRenderer} = window.require('electron');

function App() {
    const {menus, dispatch} = useContext(MenuContext)
    const handleKeyDown = e => {
        if (e.key === "PageDown" || e.key === "PageUp") {
            const {id} = document.activeElement;
            const [fieldName, fieldIndex] = id.split("-");
            let nextSibling;
            if (e.key === "PageDown") {
                nextSibling = document.querySelector(
                    `[id=input-${parseInt(fieldIndex, 10) + 1}]`
                );
            }
            if (e.key === "PageUp") {
                nextSibling = document.querySelector(
                    `[id=input-${parseInt(fieldIndex, 10) - 1}]`
                );
            }
            if (nextSibling !== null) {
                nextSibling.focus();
                if (nextSibling.select) {
                    nextSibling.select();
                }
            } else {
                nextSibling = document.getElementById("input-1")
                if (nextSibling !== null) {
                    nextSibling.focus();
                    if (nextSibling.select) {
                        nextSibling.select();
                    }
                } else {
                    nextSibling = document.getElementById("a11y-tab-0")
                    if (nextSibling !== null) {
                        nextSibling.focus();
                        dispatch({type: "RESET_MENU"})
                    }
                }
            }
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        const settings = ipcRenderer.sendSync('get-user-settings');

        async function isUserLoggedIn() {
            get('status', (data) => {
                if (data.ok) {
                    dispatch({type: "UPDATE_USER", value: settings.user})
                } else {
                    dispatch({type: 'LOGOUT_USER'})
                }
            }, null)
        }

        isUserLoggedIn()

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [])
    return (
        <Fragment>
            <Router>
                <Switch>
                    <Route exact
                           path="/login"
                    >
                        <Login/>
                    </Route>
                    <PrivateRoute exact
                                  path="/:page"
                                  component={Page}
                    />
                    <Route path="/">
                        <MainMenu/>
                        {menus.user?.name?.length > 0 ?
                            <FabProfile menus={menus} dispatch={dispatch}/> :
                            <FabLogin menus={menus} dispatch={dispatch}/>}
                    </Route>
                </Switch>
            </Router>
        </Fragment>
    );
}

export default App;
