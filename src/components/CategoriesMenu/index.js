import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SubCategoriesMenu from './../SubCategoriesMenu';
import {withRouter} from "react-router-dom";
import {MenuContext} from "../../state/menuContext";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

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
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
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
        }
    },
}));

function VerticalTabs(props) {
    const classes = useStyles();
    const {menus, dispatch} = useContext(MenuContext)
    const [value, setValue] = React.useState(menus.category);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        dispatch({type: "UPDATE_CATEGORY", value: newValue})

    };

    const navigateTo = (event, pathname) => {
        if (event.key === "Enter") {
            console.log('redirectTo ' + pathname)
            props.history.push(pathname)
        }
    }
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
                onKeyDown={props.onKeyDown}
            >
                {Object.keys(props.items).map((item, i) => (
                    <Tab autoFocus={value === i && menus.autoFocus === 2}
                         ref={value === i ? props.categoriesMenuRef : null}
                         label={item}
                         className={classes.tab}
                         {...a11yProps(i)}
                         onKeyDown={(event) => props.items[item].route ? navigateTo(event, props.items[item].route) : null}
                    />
                ))}
            </Tabs>
            {Object.keys(props.items).map((item, i) => {
                if (props.items[item]?.categories) {
                    return (<TabPanel key={i} value={value} index={i}>
                        <SubCategoriesMenu
                            items={props.items[item].categories}
                            onKeyDown={props.onKeyDown}
                            subCategoriesMenuRef={props.subCategoriesMenuRef}
                        />
                    </TabPanel>)
                }
            })}
        </div>
    );
}

export default withRouter(VerticalTabs);