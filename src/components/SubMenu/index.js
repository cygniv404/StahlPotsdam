import React, {useContext, useRef} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CategoriesMenu from "../CategoriesMenu";
import Box from '@material-ui/core/Box';
import {MenuContext} from "../../state/menuContext";
import {withRouter} from "react-router-dom";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

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
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
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

function SimpleTabs(props) {
    const classes = useStyles();
    const {menus, dispatch} = useContext(MenuContext);
    const [value, setValue] = React.useState(menus.subMenu);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        dispatch({type: "UPDATE_SUB_MENU", value: newValue})
    };
    const navigateTo = (event, pathname) => {
        if (event.key === "Enter" && pathname) {
            console.log('redirectTo: ' + pathname)
            props.history.push(pathname)
        }
    }
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={value}
                      onChange={handleChange}
                      selectionFollowsFocus
                      aria-label="simple tabs example"
                      onKeyDown={props.onKeyDown}
                      centered={value !== 1 && value !== 0}
                      variant="fullWidth"
                >
                    {props.items && Object.keys(props.items).map((label, i) => (
                        <Tab key={i}
                             autoFocus={value === i && menus.autoFocus === 1}
                             ref={value === i ? props.subTabRef : null}
                             label={label} {...a11yProps(i)}
                             className={classes.tab}
                             wrapped
                             onKeyDown={(event) => navigateTo(event, props.items[label].route)}

                        />
                    ))}
                </Tabs>
            </AppBar>
            {Object.keys(props.items).map((subMenu, index) => {
                const categories = props.items[subMenu].subMenus
                if (categories) {
                    return (
                        <TabPanel key={index} value={value} index={index}>
                            <CategoriesMenu
                                items={categories}
                                onKeyDown={props.onKeyDown}
                                categoriesMenuRef={props.categoriesMenuRef}
                                subCategoriesMenuRef={props.subCategoriesMenuRef}
                            />
                        </TabPanel>)
                }
            })}
        </div>
    );
}

export default withRouter(SimpleTabs);