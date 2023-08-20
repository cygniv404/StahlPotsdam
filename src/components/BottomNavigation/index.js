import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {Box, Typography} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        width: 'inherit',
        background: 'transparent',
    },
});

export default function SimpleBottomNavigation({navigationItems}) {
    const classes = useStyles();
    const [value, setValue] = React.useState(null);

    return (
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            className={classes.root}
        >
            {["[ESC] Abbruch", "[F1] Hilfe", ...navigationItems].map((item, index) => <BottomNavigationAction
                key={index} label={item} style={{color: '#565656'}}/>)}
        </BottomNavigation>
    );
}