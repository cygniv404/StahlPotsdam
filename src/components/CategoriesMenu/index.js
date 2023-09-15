import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import SubCategoriesMenu from '../SubCategoriesMenu';
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
    minWidth: '50px',
    '&>span': {
      alignItems: 'baseline',
    },
  },
}));

function CategoriesMenu({
  navigate, onKeyDown, items, categoriesMenuRef, subCategoriesMenuRef,
}) {
  const classes = useStyles();
  const { menus, dispatch } = useContext(MenuContext);
  const [value, setValue] = React.useState(menus.category);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    dispatch({ type: 'UPDATE_CATEGORY', value: newValue });
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
        {Object.keys(items).map((item, i) => (
          <Tab
            autoFocus={value === i && menus.autoFocus === 2}
            ref={value === i ? categoriesMenuRef : null}
            label={item}
            className={classes.tab}
            {...a11yProps(i)}
            onKeyDown={(event) => (items[item].route ? navigateTo(event, items[item].route) : null)}
          />
        ))}
      </Tabs>
      {Object.keys(items).map((item, i) => {
        if (items[item]?.categories) {
          return (
            <TabPanel value={value} index={i}>
              <SubCategoriesMenu
                items={items[item].categories}
                onKeyDown={onKeyDown}
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

export default withRouter(CategoriesMenu);
