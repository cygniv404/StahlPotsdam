import React, {useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ImageList from "./ImageList";
import {Modal} from "@material-ui/core";
import {get} from "../../utils/requests";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({
                                             bendGroup,
                                             open,
                                             handleClose,
                                             chosenEdge,
                                             dimX,
                                             dimY,
                                             scale,
                                             showLabel,
                                             width,
                                             height
                                         }) {
    const classes = useStyles();
    const [bendTypeData, setBendTypeData] = useState(null)
    useEffect(() => {
        get(`bend_type/${bendGroup}`, (data) => setBendTypeData(data), null)
    }, [])
    return (
        <>
            <Dialog
                fullScreen
                TransitionComponent={Transition}
                open={open}
                onClose={handleClose}
                disableRestoreFocus
            >
                <>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon/>
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Bilder
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    {bendTypeData && (
                        <ImageList
                            chosenEdge={chosenEdge}
                            bendTypeData={bendTypeData}
                            dimX={dimX}
                            dimY={dimY}
                            scale={scale}
                            showLabel={showLabel}
                            width={width}
                            height={height}
                        />
                    )}
                </>
            </Dialog>
        </>
    );
}