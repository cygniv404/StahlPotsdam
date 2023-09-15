import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CategoriesMenu from '../CategoriesMenu';
import { MenuContext } from '../../state/menuContext';
import { withRouter } from '../../utils/withRouter';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tab: {
    fontSize: '0.8rem',
  },
}));

function SimpleTabs({
  navigate, onKeyDown, items, subCategoriesMenuRef, subTabRef, categoriesMenuRef,
}) {
  const classes = useStyles();
  const { menus, dispatch } = useContext(MenuContext);
  const [value, setValue] = React.useState(menus.subMenu);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    dispatch({ type: 'UPDATE_SUB_MENU', value: newValue });
  };
  const navigateTo = (event, pathname) => {
    if (event.key === 'Enter' && pathname) {
      console.log(`redirectTo: ${pathname}`);
      navigate(pathname);
    }
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          selectionFollowsFocus
          aria-label="simple tabs example"
          onKeyDown={onKeyDown}
          centered={value !== 1 && value !== 0}
          variant="fullWidth"
        >
          {items && Object.keys(items).map((label, i) => (
            <Tab
              autoFocus={value === i && menus.autoFocus === 1}
              ref={value === i ? subTabRef : null}
              label={label}
              {...a11yProps(i)}
              className={classes.tab}
              wrapped
              onKeyDown={(event) => navigateTo(event, items[label].route)}
            />
          ))}
        </Tabs>
      </AppBar>
      {Object.keys(items).map((subMenu, index) => {
        const categories = items[subMenu].subMenus;
        if (categories) {
          return (
            <TabPanel value={value} index={index}>
              <CategoriesMenu
                items={categories}
                onKeyDown={onKeyDown}
                categoriesMenuRef={categoriesMenuRef}
                subCategoriesMenuRef={subCategoriesMenuRef}
              />
            </TabPanel>
          );
        }
        return null;
      })}
    </div>
  );
}

export default withRouter(SimpleTabs);
