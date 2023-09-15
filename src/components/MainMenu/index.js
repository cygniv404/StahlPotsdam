import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import SubMenu from '../SubMenu';
import { menuTree } from '../../utils/menuTree';
import { MenuContext } from '../../state/menuContext';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`a11y-tabpanel-${index}`}
      aria-labelledby={`a11y-tab-${index}`}
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

function DemoTabs(props) {
  const {
    labelId, onChange, selectionFollowsFocus, value, onKeyDown, autoFocus, tabRef, items,
  } = props;
  const logout = () => {
    console.log('logout');
  };
  return (
    <AppBar position="static">
      <Tabs
        aria-labelledby={labelId}
        onChange={onChange}
        selectionFollowsFocus={selectionFollowsFocus}
        value={value}
        variant="fullWidth"
        onClick={() => (value === 4 ? logout() : null)}
        onKeyDown={onKeyDown}
      >
        {items.map((item, index) => (
          <Tab
            ref={value === index ? tabRef : null}
            autoFocus={index === 0 && autoFocus === 0}
            label={item}
            aria-controls={`a11y-tabpanel-${index}`}
            id={`a11y-tab-${index}`}
          />
        ))}
      </Tabs>
    </AppBar>
  );
}

DemoTabs.propTypes = {
  labelId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selectionFollowsFocus: PropTypes.bool,
  value: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function AccessibleTabs() {
  const classes = useStyles();
  const { menus, dispatch } = useContext(MenuContext);
  const { autoFocus } = menus;
  const [value, setValue] = React.useState(menus.mainMenu);
  const tabRef = useRef();
  const subTabRef = useRef();
  const categoriesMenuRef = useRef();
  const subCategoriesMenuRef = useRef();
  const handleChange = (event, newValue) => {
    setValue(newValue);
    dispatch({ type: 'UPDATE_MAIN_MENU', value: newValue });
    dispatch({ type: 'UPDATE_AUTOFOCUS', value: 0 });
  };
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || (event.key === 'Enter')) {
      if (autoFocus === 0) {
        if (subTabRef.current) {
          subTabRef.current.focus();
          dispatch({ type: 'UPDATE_AUTOFOCUS', value: 1 });
        }
      }
      if (autoFocus === 1) {
        if (categoriesMenuRef.current) {
          categoriesMenuRef.current.focus();
          dispatch({ type: 'UPDATE_AUTOFOCUS', value: 2 });
        }
      }
      console.log('key is down');
    }
    if (event.key === 'ArrowUp' || event.key === 'Escape') {
      console.log('key is up');
      if (autoFocus === 1) {
        if (tabRef.current) {
          dispatch({ type: 'RESET_SUB_MENU' });
          tabRef.current.focus();
          dispatch({ type: 'UPDATE_AUTOFOCUS', value: 0 });
        }
      }
    }
    if (event.key === 'Escape') {
      console.log('key is up');
      if (autoFocus === 2) {
        if (subTabRef.current) {
          dispatch({ type: 'RESET_CATEGORY' });
          subTabRef.current.focus();
          dispatch({ type: 'UPDATE_AUTOFOCUS', value: 1 });
        }
      }
      if (autoFocus === 3) {
        if (categoriesMenuRef.current) {
          dispatch({ type: 'RESET_SUB_CATEGORY' });
          categoriesMenuRef.current.focus();
          dispatch({ type: 'UPDATE_AUTOFOCUS', value: 2 });
        }
      }
    }

    if (event.key === 'Enter') {
      console.log('key is down');
      if (autoFocus === 2) {
        if (subCategoriesMenuRef.current) {
          subCategoriesMenuRef.current.focus();
          dispatch({ type: 'UPDATE_AUTOFOCUS', value: 3 });
        }
      }
    }
  };

  return (
    <div className={classes.root}>
      <DemoTabs
        labelId="demo-a11y-tabs-automatic-label"
        selectionFollowsFocus
        onChange={handleChange}
        value={value}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        tabRef={tabRef}
        items={[...Object.keys(menuTree),
        ]}
      />
      {
          Object.keys(menuTree).map((mainMenu, index) => (
            <TabPanel value={value} index={index}>
              <SubMenu
                autoFocus={autoFocus}
                onKeyDown={handleKeyDown}
                subTabRef={subTabRef}
                items={menuTree[mainMenu]}
                categoriesMenuRef={categoriesMenuRef}
                subCategoriesMenuRef={subCategoriesMenuRef}
              />
            </TabPanel>
          ))
      }
    </div>
  );
}

export default AccessibleTabs;
