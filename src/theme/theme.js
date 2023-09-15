import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { deDE } from '@mui/material/locale';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
}, deDE);

export default theme;
