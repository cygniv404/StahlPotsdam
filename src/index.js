import 'index.scss';

import * as serviceWorker from 'serviceWorker';
import { ThemeProvider } from '@mui/styles';
import { createRoot } from 'react-dom/client';

import App from 'components/App';
import React from 'react';
import { CssBaseline } from '@mui/material';
import theme from './theme/theme';
import MenuProvider from './state/menuContext';

function AppWithThemeProvider() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MenuProvider>
          <App />
        </MenuProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AppWithThemeProvider />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
