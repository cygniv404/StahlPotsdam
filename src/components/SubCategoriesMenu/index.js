import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { withRouter } from '../../utils/withRouter';
import { MenuContext } from '../../state/menuContext';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tab: {
    minHeight: '28px',
    '&>span': {
      alignItems: 'baseline',
    },
  },
}));

function SubCategoriesMenu({
  navigate, onKeyDown, items, subCategoriesMenuRef,
}) {
  const classes = useStyles();
  const { menus, dispatch } = useContext(MenuContext);
  const [value, setValue] = React.useState(menus.subCategory);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    dispatch({ type: 'UPDATE_SUB_CATEGORY', value: newValue });
  };

  const navigateTo = (event, pathname) => {
    if (event.key === 'Enter') {
      console.log(`redirectTo ${pathname}`);
      navigate(pathname);
    }
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="fullWidth"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
        selectionFollowsFocus
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => (
          <Tab
            autoFocus={value === i && menus.autoFocus === 3}
            ref={value === i ? subCategoriesMenuRef : null}
            label={item.category}
            className={classes.tab}
            {...a11yProps(i)}
            onKeyDown={(event) => navigateTo(event, item.route)}
          />
        ))}
      </Tabs>
    </div>
  );
}

export default withRouter(SubCategoriesMenu);
