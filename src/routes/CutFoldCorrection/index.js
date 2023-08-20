import React, {useEffect, useRef, useState} from "react";
import {
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    makeStyles, Switch,
    TextField, Typography
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Identifiers from "./Indentifiers";
import {get, post} from "../../utils/requests";
import {useSnackbar} from 'notistack';
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: '80px'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    input: {
        marginTop: '0.25rem',
        marginBottom: '0.25rem',
        '&>div': {
            height: '35px',
        }
    },
    input2: {
        marginTop: '0.25rem',
        marginBottom: '0.25rem',
        '&>div': {
            height: '35px',
        }
    }
}));

export default function (props) {
    const classes = useStyles();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [documentId, setDocumentId] = useState('')
    const [clientData, setClientData] = useState({
        alias: '',
        address1Name1: '',
        address1Name2: '',
        address1Street: '',
        address1Post: '',
        address1Place: '',
    });
    const [cutCorrection, setCutCorrection] = useState({piece: 0, weight: 0})
    const [foldCorrection, setFoldCorrection] = useState({piece: 0, weight: 0})
    const _resetClient = () => {
        setClientData({
            alias: '',
            address1Name1: '',
            address1Name2: '',
            address1Street: '',
            address1Post: '',
            address1Place: '',
        })
    }
    const handleDocumentChange = (e) => {
        setDocumentId(e.target.value)
        get(`${props.documentType}/${e.target.value}`,
            (data) => {
                if (data.id) {
                    setClientData({
                        alias: data.client_alias,
                        address1Name1: data.client_address1_name1,
                        address1Name2: data.client_address1_name2,
                        address1Street: data.client_address1_street,
                        address1Post: data.client_address1_post,
                        address1Place: data.client_address1_place,
                    });
                } else {
                    _resetClient()
                }
            },
            null)
    }
    const loadDocument = (e) => {
        if (e.key === "ArrowDown") {
            get(`${props.documentType}/${e.target.value === '' ? 0 : e.target.value}/prev`,
                (data) => {
                    if (data.id) {
                        setDocumentId(data.id);
                        setClientData({
                            alias: data.client_alias,
                            address1Name1: data.client_address1_name1,
                            address1Name2: data.client_address1_name2,
                            address1Street: data.client_address1_street,
                            address1Post: data.client_address1_post,
                            address1Place: data.client_address1_place,
                        });
                    }
                },
                null)
        }
        if (e.key === "ArrowUp") {
            get(`${props.documentType}/${e.target.value === '' ? 0 : e.target.value}/next`,
                (data) => {
                    if (data.id) {
                        setDocumentId(data.id)
                        setClientData({
                            alias: data.client_alias,
                            address1Name1: data.client_address1_name1,
                            address1Name2: data.client_address1_name2,
                            address1Street: data.client_address1_street,
                            address1Post: data.client_address1_post,
                            address1Place: data.client_address1_place,
                        });
                    }
                },
                null)
        }
    }
    const handleCutChange = (e) => {
        const {name, value} = e.target;
        setCutCorrection({...cutCorrection, [name]: value})
    }
    const handleFoldChange = (e) => {
        const {name, value} = e.target;
        setFoldCorrection({...foldCorrection, [name]: value})
    }
    const saveCutFoldCorrection = e => {
        if (e.key === "Enter") {
            post({cutCorrection, foldCorrection}, `${props.documentType}/cutfold_correction/${documentId}`, (data) => {
                    if (data.id) {
                        enqueueSnackbar("Berichtigungen gespeichert!", {variant: "success"});
                        const documentRefElement = document.querySelector(
                            `[id=input-1]`
                        );
                        _resetClient()
                        setDocumentId('')
                        setCutCorrection({piece: 0, weight: 0})
                        setFoldCorrection({piece: 0, weight: 0})
                        setTimeout(() => documentRefElement.focus(), 100);
                    }
                }
                , null)
        }
    }
    const translate = (word) => {
        const translations = {
            piece: "Stück",
            weight: "Gewicht",
        }
        return translations[word]
    }
    return (
        <>
            <Grid item xs={12}>
                <Box display='flex' flexDirection='row' justifyContent='space-between' className={classes.root}>
                    <Identifiers
                        documentId={documentId}
                        loadDocument={loadDocument}
                        onChange={handleDocumentChange}
                    />
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Divider variant="middle"/>
            </Grid>

            <Grid item xs={5}>
                {clientData.alias && (
                    <Box display='flex' width='100%' flexDirection='row' justifyContent='space-between'>
                        <Box display='flex' width='100%' flexDirection='column' justifyContent='center'>
                            <TextField
                                id="label-1"
                                type="text"
                                labelWidth={0}
                                name="alias"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled
                                variant="outlined"
                                className={classes.input2}
                                value={clientData.alias}
                            />
                            <TextField
                                id="label-2"
                                labelWidth={0}
                                type="text"
                                name="address1Name1"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled
                                variant="outlined"
                                className={classes.input2}
                                value={clientData.address1Name1}
                            />
                            <TextField
                                id="label-3"
                                labelWidth={0}
                                type="text"
                                name="address1Name2"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled
                                variant="outlined"
                                className={classes.input2}
                                value={clientData.address1Name2}
                            />
                            <TextField
                                id="label-4"
                                labelWidth={0}
                                type="text"
                                name="address1Street"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled
                                variant="outlined"
                                className={classes.input2}
                                value={clientData.address1Street}
                            />
                            <TextField
                                id="label-5"
                                labelWidth={0}
                                type="text"
                                name="address1Post"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled
                                variant="outlined"
                                className={classes.input2}
                                value={clientData.address1Post}
                            />
                            <TextField
                                id="label-6"
                                labelWidth={0}
                                type="text"
                                name="address1Place"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled
                                variant="outlined"
                                className={classes.input2}
                                value={clientData.address1Place}
                            />
                        </Box>
                    </Box>
                )}
            </Grid>

            <Grid item xs={1}>
                <Box display="flex" justifyContent="center" width="100%" style={{height: "100%"}}>
                    <Divider variant="middle" orientation="vertical"/>
                </Box>
            </Grid>

            <Grid item xs={2}>
                <Typography variant='h6'>Schnitte</Typography>
                {Object.keys(cutCorrection).map((item, index) => {
                    return (
                        <>
                            <TextField
                                className={classes.input2}
                                id={`input-${1 + index + 1}`}
                                label={translate(item)}
                                type="number"
                                name={item}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                value={cutCorrection[item]}
                                onChange={handleCutChange}
                            />
                        </>
                    )
                })}
            </Grid>

            <Grid item xs={1}>
                <Box display="flex" justifyContent="center" width="100%" style={{height: "100%"}}>
                    <Divider variant="middle" orientation="vertical"/>
                </Box>
            </Grid>

            <Grid item xs={3}>
                <Typography variant='h6'>Abkantungen</Typography>
                {Object.keys(foldCorrection).map((item, index) => {
                    return (
                        <>
                            <TextField
                                className={classes.input2}
                                id={`input-${3 + index + 1}`}
                                label={translate(item)}
                                type="number"
                                name={item}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                value={foldCorrection[item]}
                                onChange={handleFoldChange}
                            />
                        </>
                    )
                })}
            </Grid>

            <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                    <Button id={`input-6`} variant="contained" color="primary"
                            onKeyDown={saveCutFoldCorrection}>
                        Speichern
                    </Button>
                </Box>
            </Grid>
        </>
    )
}