import React from 'react';
import { makeStyles } from '@mui/styles';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

const useStyles = makeStyles({
  root: {
    width: 'inherit',
    background: 'transparent',
  },
});

export default function SimpleBottomNavigation({ navigationItems }) {
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
      {['[ESC] Abbruch', '[F1] Hilfe', ...navigationItems].map((item) => (
        <BottomNavigationAction
          label={item}
          style={{ color: '#565656' }}
        />
      ))}
    </BottomNavigation>
  );
}
