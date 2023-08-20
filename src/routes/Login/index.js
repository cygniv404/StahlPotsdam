import React, {useReducer, useEffect, useState, useContext} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import {authUser} from "./utils";
import {MenuContext} from "../../state/menuContext";
import {withRouter} from "react-router-dom";
import {CircularProgress} from "@material-ui/core";
import {useSnackbar} from "notistack";

const useStyles = makeStyles((theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            width: 400,
            margin: `${theme.spacing(0)} auto`
        },
        loginBtn: {
            marginTop: theme.spacing(2),
            flexGrow: 1
        },
        header: {
            textAlign: 'center',
            background: '#212121',
            color: '#fff'
        },
        card: {
            marginTop: theme.spacing(10)
        }
    })
);

const Login = (props) => {
    const classes = useStyles();
    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [isLogging, setIsLogging] = useState(false)
    const {menus, dispatch} = useContext(MenuContext)

    const redirectToHomePage = () => {
        props.history.push('/')
    }
    const handleLogin = () => {
        setIsLogging(true)
        authUser({name: userName, password: userPassword})
            .then((userAccount) => {
                setIsLogging(false)
                if (userAccount) {
                    dispatch({
                        type: 'UPDATE_USER_LOGIN',
                        value: userAccount
                    });
                    props.history.push('/')
                }
            })
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            if (userName.length > 0 && userPassword.length > 0) {
                handleLogin()
            }
        }
    };

    const handleUserNameChange = (event) => {
        setUserName(event.target.value)
    };

    const handlePasswordChange = (event) => {
        setUserPassword(event.target.value)
    }
    return (
        <form className={classes.container} noValidate autoComplete="off">
            <Card className={classes.card}>
                <CardHeader className={classes.header} title="Stahlhandel Potsdam"/>
                <CardContent>
                    <div>
                        <TextField
                            fullWidth
                            id="email"
                            type="email"
                            label="Name"
                            placeholder="Name"
                            margin="normal"
                            onChange={handleUserNameChange}
                            onKeyPress={handleKeyPress}
                        />
                        <TextField
                            fullWidth
                            id="password"
                            type="password"
                            label="Kennenwort"
                            placeholder="Kennenwort"
                            margin="normal"
                            onChange={handlePasswordChange}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        className={classes.loginBtn}
                        onClick={handleLogin}
                        disabled={isLogging}
                    >
                        {isLogging ? <CircularProgress/> : 'Einloggen'}
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        color="secondary"
                        className={classes.loginBtn}
                        onClick={redirectToHomePage}
                    >
                        Zurück Zum Menu
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
}

export default withRouter(Login);