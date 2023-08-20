import LogoutIcon from "@mui/icons-material/Logout";
import Fab from "@mui/material/Fab";
import React from "react";
import {withRouter} from "react-router-dom";

function FabLogin(props) {
    const logoutUser = () => {
        props.dispatch({type: 'LOGOUT_USER'})
        props.history.push('/')
    }
    return (
        <Fab
            color="secondary"
            variant="extended"
            sx={{
                position: 'absolute',
                bottom: (theme) => theme.spacing(2),
                right: (theme) => theme.spacing(2),
            }}
            onClick={logoutUser}
        >
            {props.menus.user.name}
            <LogoutIcon sx={{ml: 1}}/>
        </Fab>
    )
}

export default withRouter(FabLogin)