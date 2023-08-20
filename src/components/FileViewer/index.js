import React, {useEffect, useState} from 'react';
import Button from "@material-ui/core/Button";
import {AppBar, Dialog, makeStyles, Slide} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import {get} from "../../utils/requests";
import {Document, Page} from 'react-pdf/dist/esm/entry.webpack';
import Box from "@material-ui/core/Box";
import DeleteIcon from "@mui/icons-material/Delete";

const useStyles = makeStyles((theme) => ({
    page: {
        '-webkit-box-shadow': '2px 0px 15px -5px #000000',
        boxShadow: '2px 0px 15px -5px #000000',
        border: '1px solid black',
        borderRadius: '5px',
        marginBottom: '5px'
    },
    dialog: {
        '&>div>div': {
            backgroundColor: 'transparent',
        }
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ({fileId, deleteFile}) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleDelete = () => {
        handleClose();
        deleteFile();
    }
    useEffect(() => {
        get(`files/${fileId}`, (data) => {
            if (data.name) {
                setFileName(data.name);
                setFileContent(data.content);
            }
        }, null)
    }, [])
    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Anschauen
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                className={classes.dialog}
            >
                <AppBar sx={{position: 'relative', height: '70px'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                            autoFocus
                        >
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                            {fileName}
                        </Typography>
                        <Button variant="raised" component="span" onClick={handleDelete}>
                            <DeleteIcon style={{color: 'white'}}/>
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box display='flex' width={'100%'} flexDirection='row' justifyContent='center'
                     style={{marginTop: '62px', backgroundColor: 'transparent', height: '100%'}}>
                    {/*<Document*/}
                    {/*    file={fileContent}*/}
                    {/*    onLoadSuccess={onDocumentLoadSuccess}*/}
                    {/*    onLoadError={(error) => console.log('PDF ERROR:', error)}*/}
                    {/*>*/}
                    {/*    {Array.from(new Array(numPages), (el, index) => (*/}
                    {/*        <Page key={`page_${index + 1}`} pageNumber={index + 1} className={classes.page}*/}
                    {/*              scale={1.5}/>*/}
                    {/*    ))}*/}
                    {/*</Document>*/}
                    <iframe style={{width: '100%', height: '100%'}} src={fileContent}/>
                </Box>
            </Dialog>
        </div>
    )
}