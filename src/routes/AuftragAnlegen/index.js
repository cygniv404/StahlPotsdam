import React, {useContext, useEffect, useState} from "react";
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider,
    Grid,
    makeStyles,
    MenuItem,
    TextField
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import InputAdornment from '@material-ui/core/InputAdornment';
import {get, post} from '../../utils/requests'
import {useHistory} from "react-router-dom";
import Identifiers from './Indentifiers';
import {useSnackbar} from "notistack";
import {MenuContext} from "../../state/menuContext";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
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
        margin: '0.25rem',
        '&>div': {
            height: '35px',
        }
    }
}));

export default ({documentType}) => {
    const classes = useStyles();
    const {menus, dispatch} = useContext(MenuContext)
    let history = useHistory();
    const [copiedOffer, setCopiedOffer] = useState(false)
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [open, setOpen] = useState(false);
    const [documentId, setDocumentId] = useState("")
    const [clientId, setClientId] = useState("")
    const [costId, setCostId] = useState("")
    const [clientData, setClientData] = useState({
        alias: '',
        address1Name1: '',
        address1Name2: '',
        address1Street: '',
        address1Post: '',
        address1Place: '',
    })
    const [costData, setCostData] = useState({
        address2Name1: '',
        address2Name2: '',
        address2Street: '',
        address2Post: '',
        address2Place: '',
        bleche: 0,
        hem: 0,
        stahl6: 0,
        stahl8: 0,
        stahl10: 0,
        stahl12_32: 0,
        mattenQ: 0,
        mattenR: 0,
        hea: 0,
        heb: 0,
        stabstahl: 0,
        bv_1: '',
        bv_2: '',
        bv_3: '',
        ipe_u: 0
    })
    const [documentData, setDocumentData] = useState({
        bem: '',
        bearbeiter: menus.user.name,
        bauteilt: '',
        plan: '',
        bestelldatum: new Date().toJSON().slice(0, 10),
        lieferdatum: new Date().toJSON().slice(0, 10),
        bestellart: '',
        versandart: '',
        mehrwertssteuer: 19,
    })

    const [shippingMethod, setShippingMethod] = useState([])
    const [orderMethod, setOrderMethod] = useState([])

    const _resetCost = () => setCostData({
        address2Name1: '',
        address2Name2: '',
        address2Street: '',
        address2Post: '',
        address2Place: '',
        bleche: 0,
        hem: 0,
        stahl6: 0,
        stahl8: 0,
        stahl10: 0,
        stahl12_32: 0,
        mattenQ: 0,
        mattenR: 0,
        hea: 0,
        heb: 0,
        stabstahl: 0,
        ipe_u: 0,
        bv_1: '',
        bv_2: '',
        bv_3: '',
    })
    const _resetClient = () => {
        setClientData({
            alias: '',
            address1Name1: '',
            address1Name2: '',
            address1Street: '',
            address1Post: '',
            address1Place: '',
        })
        _resetCost();
        setCostId("");
    }
    const _resetDocument = () => setDocumentData({
        bem: '',
        bearbeiter: '',
        bauteilt: '',
        plan: '',
        bestelldatum: new Date().toJSON().slice(0, 10),
        lieferdatum: new Date().toJSON().slice(0, 10),
        bestellart: '',
        versandart: '',
        mehrwertssteuer: 19,
    })
    const _resetAll = () => {
        _resetCost();
        _resetClient();
        _resetDocument();
        setClientId("");
        setCostId("");
    }

    const resetCost = (e) => {
        if (e.key === "Enter" && e.target.value === "0") {
            _resetCost();
        }
    }
    const resetForm = () => {
        _resetAll()
    }
    const handleInputChange = e => {
        const {name} = e.target;
        if (Object.keys(clientData).indexOf(name) > -1) {
            setClientData({...clientData, [e.target.name]: e.target.value})
        } else if (Object.keys(costData).indexOf(name) > -1) {
            setCostData({
                ...costData,
                [e.target.name]: (name.indexOf("address") > -1 || name.indexOf("bv") > -1) ? e.target.value : parseInt(e.target.value)
            })
        } else if (Object.keys(documentData).indexOf(name) > -1) {
            setDocumentData({...documentData, [e.target.name]: e.target.value})
        }
    }
    const handleSelectChange = (e, id) => {
        const [fieldName, fieldIndex] = id.split("-");
        const nextSibling = document.querySelector(
            `[id=input-${parseInt(fieldIndex, 10) + 1}]`
        );
        if (nextSibling !== null && e.target.value !== '') {
            setDocumentData({...documentData, [e.target.name]: e.target.value})
            setTimeout(() => nextSibling.focus(), 200)
        }
        setDocumentData({...documentData, [e.target.name]: e.target.value})

    }

    const handleDocumentIdChange = (e) => {
        setDocumentId(e.target.value);
        get(`${documentType}/${e.target.value === '' ? 0 : parseInt(e.target.value)}`,
            (data) => {
                if (data.id) {
                    setCostId(data.cost_id);
                    setClientId(data.client_id);
                    setClientData({
                        alias: data.client_alias,
                        address1Name1: data.client_address1_name1,
                        address1Name2: data.client_address1_name2,
                        address1Street: data.client_address1_street,
                        address1Post: data.client_address1_post,
                        address1Place: data.client_address1_place,
                    });
                    setCostData({
                        address2Name1: data.cost_address2_name1,
                        address2Name2: data.cost_address2_name2,
                        address2Street: data.cost_address2_street,
                        address2Post: data.cost_address2_post,
                        address2Place: data.cost_address2_place,
                        bleche: data.sheet,
                        hem: data.hem,
                        stahl6: data.stahl6,
                        stahl8: data.stahl8,
                        stahl10: data.stahl10,
                        stahl12_32: data.stahl12_32,
                        mattenQ: data.matten_q,
                        mattenR: data.matten_r,
                        hea: data.hea,
                        heb: data.hem,
                        stabstahl: data.stabstahl,
                        ipe_u: data.ipe,
                        bv_1: data.bv_1,
                        bv_2: data.bv_2,
                        bv_3: data.bv_3,
                    })
                    setDocumentData({
                        bem: data.bem,
                        bearbeiter: data.bearbeiter,
                        bauteilt: data.bauteilt,
                        plan: data.plan,
                        bestelldatum: data.bestelldatum,
                        lieferdatum: data.lieferdatum,
                        bestellart: data.bestellart,
                        versandart: data.versandart,
                        mehrwertssteuer: data.mehrwertssteuer,
                    })
                } else {
                    _resetAll()
                }
            },
            null)
    }

    const handleClientIdChange = (e) => {
        setClientId(e.target.value);
        get(`client/${e.target.value === '' ? 0 : parseInt(e.target.value)}`,
            (data) => {
                if (data.id) {
                    setCostId(data.cost_center_ids?.[0] ?? "")
                    setClientData({
                        alias: data.alias,
                        address1Name1: data.name1,
                        address1Name2: data.name2,
                        address1Street: data.street,
                        address1Post: data.postal_code,
                        address1Place: data.location,
                    });
                    _resetCost()
                } else {
                    _resetClient()
                }
            },
            null)
    }

    const handleCostIdChange = (e) => {
        setCostId(e.target.value)
        get(`cost_center/${e.target.value === '' ? "0" : e.target.value.toString().replace("/", "_")}`,
            (data) => {
                if (data.id) {
                    setCostData({
                        ...costData,
                        address2Name1: data.name1,
                        address2Name2: data.name2,
                        address2Street: data.street,
                        address2Post: data.postal_code,
                        address2Place: data.location,
                        bleche: data.price_sheet,
                        hem: data.price_hem,
                        stahl6: data.price_6,
                        stahl8: data.price_8,
                        stahl10: data.price_10,
                        stahl12_32: data.price_12_32,
                        mattenQ: data.price_mat,
                        mattenR: data.price_mat,
                        hea: data.price_hea,
                        heb: data.price_heb,
                        stabstahl: data.price_steel_stick,
                        ipe_u: data.price_ipe,
                        bv_1: data.project,
                    })
                } else {
                    _resetCost()
                }
            },
            null)
    }
    const loadDocument = (event) => {
        if (event.key === "ArrowDown") {
            get(`${documentType}/${documentId === '' ? 0 : parseInt(documentId)}/prev`,
                (data) => {
                    if (data.id) {
                        setDocumentId(data.id);
                        setCostId(data.cost_id);
                        setClientId(data.client_id);
                        setClientData({
                            alias: data.client_alias,
                            address1Name1: data.client_address1_name1,
                            address1Name2: data.client_address1_name2,
                            address1Street: data.client_address1_street,
                            address1Post: data.client_address1_post,
                            address1Place: data.client_address1_place,
                        });
                        setCostData({
                            address2Name1: data.cost_address2_name1,
                            address2Name2: data.cost_address2_name2,
                            address2Street: data.cost_address2_street,
                            address2Post: data.cost_address2_post,
                            address2Place: data.cost_address2_place,
                            bleche: data.sheet,
                            hem: data.hem,
                            stahl6: data.stahl6,
                            stahl8: data.stahl8,
                            stahl10: data.stahl10,
                            stahl12_32: data.stahl12_32,
                            mattenQ: data.matten_q,
                            mattenR: data.matten_r,
                            hea: data.hea,
                            heb: data.hem,
                            stabstahl: data.stabstahl,
                            ipe_u: data.ipe,
                            bv_1: data.bv_1,
                            bv_2: data.bv_2,
                            bv_3: data.bv_3,
                        })
                        setDocumentData({
                            bem: data.bem,
                            bearbeiter: data.bearbeiter,
                            bauteilt: data.bauteilt,
                            plan: data.plan,
                            bestelldatum: data.bestelldatum,
                            lieferdatum: data.lieferdatum,
                            bestellart: data.bestellart,
                            versandart: data.versandart,
                            mehrwertssteuer: data.mehrwertssteuer,
                        })
                    } else {
                        _resetAll()
                    }
                },
                null)
        }
        if (event.key === "ArrowUp") {
            get(`${documentType}/${documentId === '' ? 0 : parseInt(documentId)}/next`,
                (data) => {
                    if (data.id) {
                        setDocumentId(data.id)
                        setClientId(data.client_id);
                        setCostId(data.cost_id)
                        setClientData({
                            alias: data.client_alias,
                            address1Name1: data.client_address1_name1,
                            address1Name2: data.client_address1_name2,
                            address1Street: data.client_address1_street,
                            address1Post: data.client_address1_post,
                            address1Place: data.client_address1_place,
                        });
                        setCostData({
                            address2Name1: data.cost_address2_name1,
                            address2Name2: data.cost_address2_name2,
                            address2Street: data.cost_address2_street,
                            address2Post: data.cost_address2_post,
                            address2Place: data.cost_address2_place,
                            bleche: data.sheet,
                            hem: data.hem,
                            stahl6: data.stahl6,
                            stahl8: data.stahl8,
                            stahl10: data.stahl10,
                            stahl12_32: data.stahl12_32,
                            mattenQ: data.matten_q,
                            mattenR: data.matten_r,
                            hea: data.hea,
                            heb: data.hem,
                            stabstahl: data.stabstahl,
                            ipe_u: data.ipe,
                            bv_1: data.bv_1,
                            bv_2: data.bv_2,
                            bv_3: data.bv_3,
                        })
                        setDocumentData({
                            bem: data.bem,
                            bearbeiter: data.bearbeiter,
                            bauteilt: data.bauteilt,
                            plan: data.plan,
                            bestelldatum: data.bestelldatum,
                            lieferdatum: data.lieferdatum,
                            bestellart: data.bestellart,
                            versandart: data.versandart,
                            mehrwertssteuer: data.mehrwertssteuer,
                        })
                    } else {
                        _resetAll()
                    }
                },
                null)
        }
    }

    const loadClient = (event) => {
        if (event.key === "ArrowDown") {
            get(`client/${clientId === '' ? 0 : parseInt(clientId)}/prev`,
                (data) => {
                    setClientId(data.id);
                    setCostId(data.cost_center_ids?.[0] ?? "")
                    setClientData({
                        alias: data.alias,
                        address1Name1: data.name1,
                        address1Name2: data.name2,
                        address1Street: data.street,
                        address1Post: data.postal_code,
                        address1Place: data.location,
                    });
                    _resetCost()
                },
                null)
        }
        if (event.key === "ArrowUp") {
            get(`client/${clientId === '' ? 0 : parseInt(clientId)}/next`,
                (data) => {
                    setClientId(data.id);
                    setCostId(data.cost_center_ids?.[0] ?? "")
                    setClientData({
                        alias: data.alias,
                        address1Name1: data.name1,
                        address1Name2: data.name2,
                        address1Street: data.street,
                        address1Post: data.postal_code,
                        address1Place: data.location,
                    });
                    _resetCost()
                },
                null)
        }
    }

    const loadCost = (event) => {
        if (event.key === "ArrowDown") {
            get(`cost_center/${parseInt(clientId)}/${costId === '' ? "0" : costId.toString().replace("/", "e")}/prev`,
                (data) => {
                    if (data.id) {
                        setCostId(data.id)
                        setCostData({
                            ...costData,
                            address2Name1: data.name1,
                            address2Name2: data.name2,
                            address2Street: data.street,
                            address2Post: data.postal_code,
                            address2Place: data.location,
                            bleche: data.price_sheet,
                            hem: data.price_hem,
                            stahl6: data.price_6,
                            stahl8: data.price_8,
                            stahl10: data.price_10,
                            stahl12_32: data.price_12_32,
                            mattenQ: data.price_mat,
                            mattenR: data.price_mat,
                            hea: data.price_hea,
                            heb: data.price_heb,
                            stabstahl: data.price_steel_stick,
                            ipe_u: data.price_ipe,
                            bv_1: data.project,
                        })
                    } else {
                        _resetCost()
                    }
                },
                null)
        }
        if (event.key === "ArrowUp") {
            get(`cost_center/${parseInt(clientId)}/${costId === '' ? "0" : costId.toString().replace("/", "e")}/next`,
                (data) => {
                    if (data.id) {
                        setCostId(data.id)
                        setCostData({
                            ...costData,
                            address2Name1: data.name1,
                            address2Name2: data.name2,
                            address2Street: data.street,
                            address2Post: data.postal_code,
                            address2Place: data.location,
                            bleche: data.price_sheet,
                            hem: data.price_hem,
                            stahl6: data.price_6,
                            stahl8: data.price_8,
                            stahl10: data.price_10,
                            stahl12_32: data.price_12_32,
                            mattenQ: data.price_mat,
                            mattenR: data.price_mat,
                            hea: data.price_hea,
                            heb: data.price_heb,
                            stabstahl: data.price_steel_stick,
                            ipe_u: data.price_ipe,
                            bv_1: data.project,
                        })
                    } else {
                        _resetCost()
                    }
                },
                null)
        }
    }

    const loadCostFromClient = (event) => {
        if (documentType === 'order' && event.key === "Enter" && event.target.value !== "") {
            get(`client/${clientId === '' ? 0 : parseInt(clientId)}/cost`,
                (data) => {
                    if (data.client) {
                        setClientData({
                            alias: data.client.alias,
                            address1Name1: data.client.name1,
                            address1Name2: data.client.name2,
                            address1Street: data.client.street,
                            address1Post: data.client.postal_code,
                            address1Place: data.client.location,
                        })
                    }
                    if (data.cost) {
                        setCostId(data.cost.id)
                        setCostData({
                            ...costData,
                            address2Name1: data.cost.name1,
                            address2Name2: data.cost.name2,
                            address2Street: data.cost.street,
                            address2Post: data.cost.postal_code,
                            address2Place: data.cost.location,
                            bleche: data.cost.price_sheet,
                            hem: data.cost.price_hem,
                            stahl6: data.cost.price_6,
                            stahl8: data.cost.price_8,
                            stahl10: data.cost.price_10,
                            stahl12_32: data.cost.price_12_32,
                            mattenQ: data.cost.price_mat,
                            mattenR: data.cost.price_mat,
                            hea: data.cost.price_hea,
                            heb: data.cost.price_heb,
                            stabstahl: data.cost.price_steel_stick,
                            ipe_u: data.cost.price_ipe,
                            bv_1: data.cost.project
                        })
                    }
                    if (!data.client) {
                        resetForm()
                    }
                },
                null)
        }
    }

    const handleClose = (e) => {
        if (e.key === "Enter" || e.key === "Escape") {
            history.goBack();
        }
    }


    const putDocument = (e) => {
        if (e.key === "Enter") {
            post({
                    clientId: clientId === '' ? 0 : parseInt(clientId),
                    costId: costId === '' ? "0" : costId,
                    orderCreatedAt: new Date().toJSON().slice(0, 10),
                    ...clientData,
                    ...costData,
                    ...documentData
                },
                `${documentType}/${documentId === '' ? 0 : parseInt(documentId)}`, (data) => {
                    setDocumentId(data.id)
                    setOpen(true)
                })
        }
    }

    const copyDocument = (e) => {
        if (e.key === 'F8') {
            post({
                    clientId: clientId === '' ? 0 : parseInt(clientId),
                    costId: costId === '' ? "0" : costId,
                    ...clientData,
                    ...costData,
                    ...documentData
                },
                `${documentType}/${documentId === '' ? 0 : parseInt(documentId)}?copy=true`, (data) => {
                    setDocumentId(data.id)
                    enqueueSnackbar(documentType === 'order' ? `Auftrag kopiert!` : 'Auftrag gestellt!', {variant: 'success'});
                    setCopiedOffer(true)
                    setOpen(true)
                })
        }
    }

    useEffect(() => {
        get(`system`,
            (data) => {
                setShippingMethod(data.shipping_method)
                setOrderMethod(data.order_method)
                setDocumentData({
                    ...documentData,
                    mehrwertssteuer: data.vat,
                })
            },
            null)
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', copyDocument);
        return () => {
            document.removeEventListener('keydown', copyDocument);
        };
    }, [documentId, clientData, clientId, costId, costData, documentData])

    return (
        <>
            <Grid item xs={12}>
                <Box display='flex' flexDirection='row' justifyContent='space-between'>
                    <Identifiers
                        documentId={documentId}
                        clientId={clientId}
                        costId={costId}
                        setCostId={setCostId}
                        setClientId={setClientId}
                        setDocumentId={setDocumentId}
                        handleDocumentIdChange={handleDocumentIdChange}
                        handleClientIdChange={handleClientIdChange}
                        handleCostIdChange={handleCostIdChange}
                        loadDocument={loadDocument}
                        loadCostFromClient={loadCostFromClient}
                        loadClient={loadClient}
                        resetCost={resetCost}
                        loadCost={loadCost}
                        type={documentType}
                    />
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Divider variant="middle"/>
            </Grid>

            <Grid item xs={4}>
                <Box display='flex' flexDirection='column' justifyContent='space-between' width='100%'>
                    <Box display='flex' flexDirection='row' width='100%' justifyContent='space-between'>
                        <Box display='flex' width='30%'>
                            <TextField
                                id="input-4"
                                label="SuName"
                                type="text"
                                name="alias"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                className={classes.input}
                                value={clientData.alias}
                                onChange={handleInputChange}
                            />
                        </Box>
                        <Box display='flex' width='70%'>
                            <TextField
                                id="input-5"
                                label="Name 1"
                                type="text"
                                name="address1Name1"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                className={classes.input}
                                value={clientData.address1Name1}

                                onChange={handleInputChange}
                                style={{width: '100%', marginLeft: '1rem'}}
                            />
                        </Box>
                    </Box>
                    <TextField
                        id="input-6"
                        label="Name 2"
                        type="text"
                        name="address1Name2"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input}
                        value={clientData.address1Name2}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-7"
                        label="Strasse"
                        type="text"
                        name="address1Street"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input}
                        value={clientData.address1Street}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-8"
                        label="PLZ"
                        type="text"
                        name="address1Post"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input}
                        value={clientData.address1Post}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-9"
                        label="Ort"
                        type="text"
                        name="address1Place"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input}
                        value={clientData.address1Place}

                        onChange={handleInputChange}
                    />
                </Box>
            </Grid>

            <Grid item xs={1}>
                <Box display="flex" justifyContent="center" width="100%" style={{height: "100%"}}>
                    <Divider variant="middle" orientation="vertical"/>
                </Box>
            </Grid>

            <Grid item xs={4}>
                <Box display='flex' flexDirection='column' justifyContent='space-between'>
                    <TextField
                        id="input-10"
                        label="Name 1"
                        type="text"
                        name="address2Name1"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input}
                        value={costData.address2Name1}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-11"
                        label="Name 2"
                        type="text"
                        name="address2Name2"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input}
                        value={costData.address2Name2}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-12"
                        label="Strasse"
                        type="text"
                        name="address2Street"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input}
                        value={costData.address2Street}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-13"
                        label="PLZ"
                        type="text"
                        name="address2Post"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input}
                        value={costData.address2Post}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-14"
                        label="Ort"
                        type="text"
                        name="address2Place"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input}
                        value={costData.address2Place}

                        onChange={handleInputChange}
                    />
                </Box>
            </Grid>
            <Grid item xs={1}>
                <Box display="flex" justifyContent="center" width="100%" style={{height: "100%"}}>
                    <Divider variant="middle" orientation="vertical"/>
                </Box>
            </Grid>
            <Grid item xs={2}>
                <Box display='flex' flexDirection='column' justifyContent='space-between'>
                    <TextField
                        id="input-15"
                        label="Bestelldatum"
                        type="date"
                        name="bestelldatum"
                        defaultValue="2021-08-08"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        className={classes.input}
                        value={documentData.bestelldatum}

                        onChange={handleInputChange}

                    />
                    <TextField
                        id="input-16"
                        label="Lieferdatum"
                        type="date"
                        name="lieferdatum"
                        defaultValue="2021-08-08"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        className={classes.input}
                        value={documentData.lieferdatum}

                        onChange={handleInputChange}

                    />
                    <TextField
                        select
                        label="Bestellart"
                        id="input-17"
                        value={documentData.bestellart}
                        SelectProps={{
                            name: 'bestellart',
                            "id": "input-17",
                            "aria-colindex": "input-17",
                        }}
                        onChange={(e) => handleSelectChange(e, "input-17")}
                        variant="outlined"
                        style={{margin: '0.25rem'}}
                    >
                        {orderMethod.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Versandart"
                        id="input-18"
                        value={documentData.versandart}
                        SelectProps={{
                            name: 'versandart',
                            "id": "input-18",
                            "aria-colindex": "input-18",
                        }}
                        onChange={(e) => handleSelectChange(e, "input-18")}
                        variant="outlined"
                        style={{margin: '0.25rem'}}
                    >
                        {shippingMethod.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box display='flex' flexDirection='row' justifyContent='space-between'>
                    <TextField
                        id="input-19"
                        label="Bearbeiter"
                        type="text"
                        name="bearbeiter"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={documentData.bearbeiter}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-20"
                        label="Plan"
                        type="text"
                        name="plan"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={documentData.plan}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-21"
                        label="Bauteil"
                        type="text"
                        name="bauteilt"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={documentData.bauteilt}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-22"
                        label="Bem."
                        type="text"
                        name="bem"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={documentData.bem}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-23"
                        label="Mehrwertssteuer"
                        type="number"
                        name="mehrwertssteuer"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        className={classes.input2}
                        variant="outlined"
                        value={documentData.mehrwertssteuer}

                        onChange={handleInputChange}
                    />
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Divider variant="middle"/>
            </Grid>
            <Grid item xs={12}>
                <Box display='flex' flexDirection='row' justifyContent='space-between'>
                    <TextField
                        id="input-24"
                        label="Stahl 6"
                        type="number"
                        name="stahl6"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={costData.stahl6}

                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        id="input-25"
                        label="Stahl 8"
                        type="number"
                        name="stahl8"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={costData.stahl8}

                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        id="input-26"
                        label="Stahl10"
                        type="number"
                        name="stahl10"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={costData.stahl10}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-27"
                        label="Stahl 12-32"
                        type="number"
                        name="stahl12_32"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={costData.stahl12_32}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-28"
                        label="Stabstahl"
                        type="number"
                        name="stabstahl"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={costData.stabstahl}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-29"
                        label="Matten Q"
                        type="number"
                        name="mattenQ"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={costData.mattenQ}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-30"
                        label="Matten R"
                        type="number"
                        name="mattenR"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={costData.mattenR}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-31"
                        label="HEA"
                        type="number"
                        name="hea"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={costData.hea}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-32"
                        label="HEB"
                        type="number"
                        name="heb"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={costData.heb}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-33"
                        label="HEM"
                        type="number"
                        name="hem"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={costData.hem}

                        onChange={handleInputChange}
                    />
                    <TextField
                        id="input-34"
                        label="IPE/U"
                        type="number"
                        name="ipe_u"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input2}
                        value={costData.ipe_u}

                        onChange={handleInputChange}
                    />
                </Box>
            </Grid>
            <Grid item xs={10}>
                <Box display="flex" flexDirection='column'>
                    <TextField
                        id="input-35"
                        label="BV"
                        type="text"
                        name="bv_1"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input}
                        value={costData.bv_1}
                        style={{width: "100%"}}

                        onChange={handleInputChange}

                    />
                    <TextField
                        id="input-36"
                        label=""
                        type="text"
                        name="bv_2"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input}
                        value={costData.bv_2}
                        style={{width: "100%"}}

                        onChange={handleInputChange}

                    />
                    <TextField
                        id="input-37"
                        label=""
                        type="text"
                        name="bv_3"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        className={classes.input}
                        value={costData.bv_3}
                        style={{width: "100%"}}

                        onChange={handleInputChange}

                    />
                </Box>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="input-38"
                    label="Bleche"
                    type="number"
                    name="bleche"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    className={classes.input}
                    value={costData.bleche}
                    onKeyDown={(e) => {
                        putDocument(e);
                    }}

                    onChange={handleInputChange}
                />
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle
                        id="alert-dialog-title">{`Neu ${documentType === 'order' || copiedOffer ? 'Auftrag' : 'Angebot'}nummer`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography variant="h4">{documentId}</Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onKeyDown={handleClose} color="primary" autoFocus>
                            Zum Hauptmenu
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </>
    )
}