import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import menuTree from "../utils/menuTree";
import {Box, Container, Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import BottomNavigation from "../components/BottomNavigation";
import Typography from "@material-ui/core/Typography";
import {get} from "../utils/requests";
import {SnackbarProvider} from 'notistack';

function getRoutesFromMenuTree() {
    const routes = [];
    for (const mainMenu in menuTree) {
        for (const subMenu in menuTree[mainMenu]) {
            if (menuTree[mainMenu][subMenu].route) {
                routes.push({
                    path: menuTree[mainMenu][subMenu].route,
                    navigationItems: menuTree[mainMenu][subMenu].navigationItems,
                    component: menuTree[mainMenu][subMenu].component ?? <span id="input-1">{subMenu}</span>
                })
            }
            for (const mainCategory in menuTree[mainMenu][subMenu].subMenus) {
                if (menuTree[mainMenu][subMenu].subMenus[mainCategory].route) {
                    routes.push({
                        path: menuTree[mainMenu][subMenu].subMenus[mainCategory].route,
                        navigationItems: menuTree[mainMenu][subMenu].subMenus[mainCategory].navigationItems,
                        component: menuTree[mainMenu][subMenu].subMenus[mainCategory].component ??
                            <span id="input-1">{mainCategory}</span>
                    })
                }
                if (menuTree[mainMenu][subMenu].subMenus[mainCategory].categories) {
                    for (const subCategory of menuTree[mainMenu][subMenu].subMenus[mainCategory].categories) {
                        routes.push({
                            path: subCategory.route,
                            navigationItems: subCategory.navigationItems,
                            component: subCategory.component ?? <span id="input-1">{subCategory.category}</span>
                        })
                    }
                }
            }
        }
    }
    return routes;
}

const useStyles = makeStyles({
    root: {
        backgroundColor: '#cfe8fc',
        height: '100vh'
    },
    content: {
        backgroundColor: 'whitesmoke',
        minHeight: '750px',
        height: '100%',
        padding: '1rem',
        '-webkit-box-shadow': '0px 6px 12px -8px #000000',
        'box-shadow': '0px 6px 12px -8px #000000',
    },
    footer: {
        height: '50px'
    }
});

function WithInputNavigator(props) {
    const handleKeyUp = e => {
        if (e.key === "Enter") {
            const {id} = document.activeElement;
            const [fieldName, fieldIndex] = id.split("-");
            const nextSibling = document.querySelector(
                `[id=input-${parseInt(fieldIndex, 10) + 1}]`
            );
            if (nextSibling !== null) {
                nextSibling.focus();
                if (nextSibling.select) {
                    nextSibling.select();
                }
            }
        }
    }
    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            if (document.activeElement.className.indexOf('MuiDialog-container') === -1) {
                props.history.goBack()
            }

        }
    }

    useEffect(() => {
        console.log("init activeElement:", document.activeElement.tagName)
        if (document.activeElement.tagName === 'BODY') {
            setTimeout(() => {
                let documentRefElement = document.getElementById("input-1")
                if (!documentRefElement) {
                    documentRefElement = document.getElementById("image-0")
                }
                if (documentRefElement) documentRefElement.parentElement.focus()
            }, 500)
        }
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keydown', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyUp);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [])

    return (
        <>{props.children}</>
    )
}

export default function Page(props) {
    const classes = useStyles();
    const {page} = props.match.params;
    const routes = getRoutesFromMenuTree()
    const [route] = routes.filter((route) => route.path === `/${page}`)
    const {component, navigationItems} = route;
    return (
        <SnackbarProvider maxSnack={3}>
            <div className={classes.root}>
                <Container maxWidth="xl">
                    <Typography component="div" className={classes.content}>
                        <Grid container spacing={4} tabIndex="0">
                            <WithInputNavigator {...props}>{component}</WithInputNavigator>
                        </Grid>
                    </Typography>
                    <Box width="100%" justifyContent="center" display="flex" className={classes.footer}>
                        <BottomNavigation navigationItems={navigationItems}/>
                    </Box>
                </Container>
            </div>
        </SnackbarProvider>
    )
}