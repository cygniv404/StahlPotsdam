import 'index.scss';

import * as serviceWorker from 'serviceWorker';
import {MuiThemeProvider} from '@material-ui/core/styles';

import App from 'components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import {CssBaseline} from "@material-ui/core";
import theme from "./theme/theme";
import MenuProvider from "./state/menuContext";

ReactDOM.render(
    <React.StrictMode>
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <MenuProvider>
                <App/>
            </MenuProvider>
        </MuiThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
