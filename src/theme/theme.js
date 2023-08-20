import {red} from '@material-ui/core/colors';
import {createTheme} from '@material-ui/core/styles';
import {deDE} from '@material-ui/core/locale';

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