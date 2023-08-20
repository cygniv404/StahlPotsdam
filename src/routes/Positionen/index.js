import React, {useEffect, useState} from "react";
import {Divider, Grid, makeStyles, TextField} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Identifiers from "./Indentifiers";
import {dlt, get, post} from "../../utils/requests";
import {useSnackbar} from 'notistack';
import ImageViewer from './ImageViewer';
import SinglePosition from './SinglePosition';

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
            width: '350px',
        }
    }
}));

export default function (props) {
    const classes = useStyles();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [open, setOpen] = useState(false);
    const [documentId, setDocumentId] = useState('');
    const [clientData, setClientData] = useState({
        alias: '',
        address1Name1: '',
        address1Name2: '',
        address1Street: '',
        address1Post: '',
        address1Place: '',
    });
    const [positionId, setPositionId] = useState('')
    const [positionType, setPositionType] = useState(props.type)
    const [articleId, setArticleId] = useState('')
    const [partCount, setPartCount] = useState(0)
    const [partWidth, setPartWidth] = useState(0)
    const [bendTypeId, setBendTypeId] = useState('')
    const [bendTypeData, setBendTypeData] = useState({})
    const [articleDescription, setArticleDescription] = useState('')
    const [chosenEdge, setChosenEdge] = useState(-1)
    const [measures, setMeasures] = useState({
        m0: "0",
        m1: "0",
        m2: "0",
        m3: "0",
        m4: "0",
        m5: "0",
        m6: "0",
        m7: "0",
        m8: "0",
        m9: "0",
    })
    const [measuresValues, setMeasuresValues] = useState({
        m0: "0",
        m1: "0",
        m2: "0",
        m3: "0",
        m4: "0",
        m5: "0",
        m6: "0",
        m7: "0",
        m8: "0",
        m9: "0",
    })
    const [overallLength, setOverallLength] = useState(0)
    const _resetAll = (resetClient = true) => {
        setPartCount(0);
        setBendTypeId('');
        setBendTypeData({});
        if (resetClient) {
            setClientData({
                alias: '',
                address1Name1: '',
                address1Name2: '',
                address1Street: '',
                address1Post: '',
                address1Place: '',
            })
        }
        setArticleDescription('')
        setChosenEdge(-1)
        setOverallLength(0)
        setMeasures({
            m0: "0",
            m1: "0",
            m2: "0",
            m3: "0",
            m4: "0",
            m5: "0",
            m6: "0",
            m7: "0",
            m8: "0",
            m9: "0",
        })
        setMeasuresValues({
            m0: "0",
            m1: "0",
            m2: "0",
            m3: "0",
            m4: "0",
            m5: "0",
            m6: "0",
            m7: "0",
            m8: "0",
            m9: "0",
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
                    setPositionId('');
                    setArticleId('');
                    _resetAll()
                }
            },
            null)
    }

    const loadDocument = (event) => {
        if (event.key === "ArrowDown") {
            get(
                `${props.documentType}/${documentId === '' ? 0 : documentId}/prev`,
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
                        setPositionId('');
                        setArticleId('');
                        _resetAll(false)
                    }
                },
                null)
        }
        if (event.key === "ArrowUp") {
            get(`${props.documentType}/${documentId === '' ? 0 : documentId}/next`,
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
                        setPositionId('');
                        setArticleId('');
                        _resetAll(false)
                    }
                },
                null)
        }
    }
    const handlePositionChange = e => {
        setPositionId(e.target.value);
        if (e.target.value.length > 0) {
            get(`${props.documentType}/${documentId}/position/${e.target.value}`,
                (data) => {
                    if (data.id) {
                        setPositionId(data.id);
                        setPositionType(data.group);
                        setArticleId(data.article_id);
                        setArticleDescription(data.article_description);
                        setPartCount(data.part_count);
                        setBendTypeId(data.bend_type_id);
                        setOverallLength(data.overall_length);
                        setMeasures(data.measures);
                        setMeasuresValues(data.measures);

                        if (data.bend_type_group && data.bend_type_id) {
                            get(`bend_type/${data.bend_type_group}/${data.bend_type_id}`,
                                (data) => {
                                    if (data.id) {
                                        setBendTypeData(data)
                                    }
                                },
                                null)
                        } else {
                            setBendTypeData({})
                        }
                    } else {
                        setArticleId('');
                        setPositionType(props.type)
                        _resetAll(false)
                    }
                })
        }
    }
    const loadPosition = (event) => {
        if (event.key === "ArrowDown") {
            get(`${props.documentType}/${documentId}/position/${positionId === '' ? 0 : positionId}/prev`,
                (data) => {
                    if (data.id) {
                        setPositionId(data.id);
                        setPositionType(data.group);
                        setArticleId(data.article_id);
                        setArticleDescription(data.article_description);
                        setPartCount(data.part_count);
                        setBendTypeId(data.bend_type_id);
                        setOverallLength(data.overall_length);
                        setMeasures(data.measures);
                        setMeasuresValues(data.measures);

                        if (data.bend_type_group && data.bend_type_id) {
                            get(`bend_type/${data.bend_type_group}/${data.bend_type_id}`,
                                (data) => {
                                    if (data.id) {
                                        setBendTypeData(data)
                                    }
                                },
                                null)
                        } else {
                            setBendTypeData({})
                        }
                    }
                },
                null)
        }
        if (event.key === "ArrowUp") {
            get(`${props.documentType}/${documentId}/position/${positionId === '' ? 0 : positionId}/next`,
                (data) => {
                    if (data.id) {
                        setPositionId(data.id);
                        setPositionType(data.group);
                        setArticleId(data.article_id);
                        setArticleDescription(data.article_description);
                        setPartCount(data.part_count);
                        setBendTypeId(data.bend_type_id);
                        setOverallLength(data.overall_length);
                        setMeasures(data.measures);
                        setMeasuresValues(data.measures);

                        if (data.bend_type_group && data.bend_type_id) {
                            get(`bend_type/${data.bend_type_group}/${data.bend_type_id}`,
                                (data) => {
                                    if (data.id) {
                                        setBendTypeData(data)
                                    }
                                },
                                null)
                        } else {
                            setBendTypeData({})
                        }
                    }
                },
                null)
        }
    }
    const submitPosition = e => {
        if (e.key === 'Enter' && documentId !== '' && positionId !== ''
            && articleId !== '' && overallLength !== 0 && bendTypeId !== '') {
            post({
                [`${props.documentType}Id`]: documentId,
                positionId,
                positionGroup: props.type,
                articleId,
                articleDescription,
                partCount,
                bendTypeId,
                bendTypeGroup: props.bendGroup,
                measures: measuresValues,
                overallLength,
            }, `${props.documentType}/position`, (data) => {
                if (data.id || data.modifiedCount) {
                    setPositionId('');
                    setArticleId('');
                    setPositionType(props.type);
                    _resetAll(false);
                    const documentRefElement = document.querySelector(
                        `[id=input-2]`
                    );
                    setTimeout(() => documentRefElement.focus(), 100);
                    enqueueSnackbar(`Position ${data.id ? 'Hinzugefügt' : 'Aktualisiert'}!`, {variant: 'success'});
                } else {
                    enqueueSnackbar('Fehler: Position kann nicht Hinzugefügt werden', {variant: 'error'});
                }
            }, null)
        }
    }
    const submitEquipmentAndServicesPosition = e => {
        if (e.key === 'Enter' && documentId !== '' && positionId !== ''
            && articleId !== '' && partCount > 0) {
            post({
                [`${props.documentType}Id`]: documentId,
                positionId,
                positionGroup: props.type,
                articleId,
                articleDescription,
                partCount,
            }, `${props.documentType}/position`, (data) => {
                if (data.id || data.modifiedCount) {
                    setPositionId('');
                    setArticleId('');
                    setPositionType(props.type)
                    _resetAll(false);
                    const documentRefElement = document.querySelector(
                        `[id=input-2]`
                    );
                    setTimeout(() => documentRefElement.focus(), 100);
                    enqueueSnackbar(`Position ${data.id ? 'Hinzugefügt' : 'Aktualisiert'}!`, {variant: 'success'});
                } else {
                    enqueueSnackbar('Fehler: Position kann nicht Hinzugefügt werden', {variant: 'error'});
                }
            }, null)
        }
    }
    const submitSheetPosition = e => {
        if (e.key === 'Enter' && documentId !== '' && positionId !== ''
            && articleId !== '' && overallLength !== 0 && partCount > 0 && partWidth > 0) {
            post({
                [`${props.documentType}Id`]: documentId,
                positionId,
                positionGroup: props.type,
                articleId,
                articleDescription,
                partCount,
                partWidth,
                overallLength,
            }, `${props.documentType}/position`, (data) => {
                if (data.id || data.modifiedCount) {
                    setPositionId('');
                    setArticleId('');
                    setPositionType(props.type)
                    _resetAll(false);
                    const documentRefElement = document.querySelector(
                        `[id=input-2]`
                    );
                    setTimeout(() => documentRefElement.focus(), 100);
                    enqueueSnackbar(`Position ${data.id ? 'Hinzugefügt' : 'Aktualisiert'}!`, {variant: 'success'});
                } else {
                    enqueueSnackbar('Fehler: Position kann nicht Hinzugefügt werden', {variant: 'error'});
                }
            }, null)
        }

    }
    const submitSteelbarPosition = e => {
        if (e.key === 'Enter' && documentId !== '' && positionId !== ''
            && articleId !== '' && overallLength !== 0 && partCount > 0) {
            post({
                [`${props.documentType}Id`]: documentId,
                positionId,
                positionGroup: props.type,
                articleId,
                articleDescription,
                partCount,
                overallLength,
            }, `${props.documentType}/position`, (data) => {
                if (data.id || data.modifiedCount) {
                    setPositionId('');
                    setArticleId('');
                    setPositionType(props.type)
                    _resetAll(false);
                    const documentRefElement = document.querySelector(
                        `[id=input-2]`
                    );
                    setTimeout(() => documentRefElement.focus(), 100);
                    enqueueSnackbar(`Position ${data.id ? 'Hinzugefügt' : 'Aktualisiert'}!`, {variant: 'success'});
                } else {
                    enqueueSnackbar('Fehler: Position kann nicht Hinzugefügt werden', {variant: 'error'});
                }
            }, null)
        }

    }

    const deletePosition = e => {
        if (e.key === 'F7' && positionId.length > 0) {
            dlt({},
                `${props.documentType}/${documentId}/position/${positionId}`,
                (data) => {
                    if (data.deleteCount) {
                        setPositionId('');
                        setArticleId('');
                        _resetAll(false);
                        const documentRefElement = document.querySelector(
                            `[id=input-1]`
                        );
                        setTimeout(() => documentRefElement.focus(), 100);
                        setPositionType(props.type)
                        enqueueSnackbar('Position gelöscht!', {variant: 'success'});
                    }

                }, null)
        }
    }
    const handleArticleChange = (e) => {
        setArticleId(e.target.value)
        if (e.target.value.length > 0) {
            get(`article/${e.target.value}`,
                (data) => {
                    if (data.id) {
                        setArticleId(data.id);
                        setArticleDescription(data.name0)
                    } else {
                        setArticleDescription('')
                    }
                },
                null)
        }
    }
    const loadArticle = (e) => {
        if (e.key === "ArrowDown") {
            get(`position/${props.type}/${articleId === '' ? 0 : articleId.replace('/', '_')}/prev`,
                (data) => {
                    if (data.id) {
                        setArticleId(data.id);
                        setArticleDescription(data.name0)
                    } else {
                        setArticleDescription('')
                    }
                },
                null)
        }
        if (e.key === "ArrowUp") {
            get(`position/${props.type}/${articleId === '' ? 0 : articleId.replace('/', '_')}/next`,
                (data) => {
                    if (data.id) {
                        setArticleId(data.id);
                        setArticleDescription(data.name0)
                    } else {
                        setArticleDescription('')
                    }
                },
                null)
        }
    }
    const handleBendTypeChange = (e) => {
        setBendTypeId(e.target.value)
        if (e.target.value.length > 0) {
            get(`bend_type/${props.bendGroup}/${e.target.value}`,
                (data) => {
                    if (data.id) {
                        setBendTypeData(data)
                        setMeasures({
                            m0: data.o1,
                            m1: data.o2,
                            m2: data.o3,
                            m3: data.o4,
                            m4: data.o5,
                            m5: data.o6,
                            m6: data.o7,
                            m7: data.o8,
                            m8: data.o9,
                            m9: data.o10,
                        })
                        setMeasuresValues({
                            m0: "0",
                            m1: "0",
                            m2: "0",
                            m3: "0",
                            m4: "0",
                            m5: "0",
                            m6: "0",
                            m7: "0",
                            m8: "0",
                            m9: "0",
                        })
                        setChosenEdge(-1)
                    } else {
                        setBendTypeData({})
                        setMeasures({
                            m0: "0",
                            m1: "0",
                            m2: "0",
                            m3: "0",
                            m4: "0",
                            m5: "0",
                            m6: "0",
                            m7: "0",
                            m8: "0",
                            m9: "0",
                        })
                    }
                },
                null)
        }
    }
    const loadBendType = (e) => {
        if (e.key === "ArrowDown") {
            get(`bend_type/${props.bendGroup}/${bendTypeId === '' ? -1 : bendTypeId}/prev`,
                (data) => {
                    if (data.id) {
                        setBendTypeId(data.id)
                        setBendTypeData(data)
                        setMeasures({
                            m0: data.o1,
                            m1: data.o2,
                            m2: data.o3,
                            m3: data.o4,
                            m4: data.o5,
                            m5: data.o6,
                            m6: data.o7,
                            m7: data.o8,
                            m8: data.o9,
                            m9: data.o10,
                        })
                        setMeasuresValues({
                            m0: "0",
                            m1: "0",
                            m2: "0",
                            m3: "0",
                            m4: "0",
                            m5: "0",
                            m6: "0",
                            m7: "0",
                            m8: "0",
                            m9: "0",
                        })
                        setChosenEdge(-1)
                    } else {
                        setBendTypeData({})
                    }
                },
                null)
        }
        if (e.key === "ArrowUp") {
            get(`bend_type/${props.bendGroup}/${bendTypeId === '' ? -1 : bendTypeId}/next`,
                (data) => {
                    if (data.id) {
                        setBendTypeId(data.id)
                        setBendTypeData(data)
                        setMeasures({
                            m0: data.o1,
                            m1: data.o2,
                            m2: data.o3,
                            m3: data.o4,
                            m4: data.o5,
                            m5: data.o6,
                            m6: data.o7,
                            m7: data.o8,
                            m8: data.o9,
                            m9: data.o10,
                        })
                        setMeasuresValues({
                            m0: "0",
                            m1: "0",
                            m2: "0",
                            m3: "0",
                            m4: "0",
                            m5: "0",
                            m6: "0",
                            m7: "0",
                            m8: "0",
                            m9: "0",
                        })
                        setChosenEdge(-1)
                    } else {
                        setBendTypeData({})
                    }
                },
                null)
        }

    }


    const handleMeasures = (e) => {
        const newMeasuresValues = {...measuresValues}
        newMeasuresValues[e.target.name] = e.target.value
        setMeasuresValues(newMeasuresValues);

        if ((props.type === 'rebar' || props.type === 'mat' || props.type === 'tube') && newMeasuresValues) {
            let measuresVal = 0
            Object.keys(newMeasuresValues).map((el) => {
                if (newMeasuresValues[el] !== '') {
                    measuresVal = measuresVal + parseFloat(newMeasuresValues[el])
                }
            })
            setOverallLength(measuresVal)
        }

    }

    const getLastInputId = () => {
        let currentMeasures = 0
        if (measures) {
            Object.keys(measures).map((el) => measures[el] === 0 || measures[el] === "0" ? el : currentMeasures++)
        }
        return currentMeasures
    }

    const showImageViewer = (e) => {
        if (e.key === 'F2') {
            setOpen(!open)
            const documentRefElement = document.querySelector(
                `[id=input-2]`
            );
            setTimeout(() => documentRefElement.focus(), 100);

        }
        if (e.key === 'Escape') {
            setOpen(false)
            const documentRefElement = document.querySelector(
                `[id=input-2]`
            );
            setTimeout(() => documentRefElement.focus(), 100);

        }
    }
    const closeImageViewer = () => {
        setOpen(false)
    }
    useEffect(() => {
        document.addEventListener('keydown', deletePosition);
        document.addEventListener('keydown', showImageViewer)
        return () => {
            document.removeEventListener('keydown', deletePosition);
            document.removeEventListener('keydown', showImageViewer);

        };
    }, [documentId, positionId, open])
    return (
        <>
            <Grid item xs={12}>
                <Box display='flex' flexDirection='row' justifyContent='space-between' className={classes.root}>
                    <Identifiers
                        documentId={documentId}
                        positionId={positionId}
                        articleId={articleId}
                        setPositionId={setPositionId}
                        handleArticleChange={handleArticleChange}
                        handleDocumentChange={handleDocumentChange}
                        handlePositionChange={handlePositionChange}
                        loadArticle={loadArticle}
                        loadDocument={loadDocument}
                        loadPosition={loadPosition}
                        helperText={articleDescription}
                        disableArticleId={positionType !== props.type}
                        positionType={positionType}
                    />
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Divider variant="middle"/>
            </Grid>

            <Grid item xs={4}>
                {clientData.alias && (
                    <Box display='flex' flexDirection='row' justifyContent='space-between'>
                        <Box display='flex' flexDirection='column' justifyContent='center'>
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

            <SinglePosition
                type={props.type}
                classes={classes}
                partCount={partCount}
                partWidth={partWidth}
                setPartWidth={setPartWidth}
                setPartCount={setPartCount}
                positionType={positionType}
                bendTypeId={bendTypeId}
                handleBendTypeChange={handleBendTypeChange}
                loadBendType={loadBendType}
                chosenEdge={chosenEdge}
                bendTypeData={bendTypeData}
                measures={measures}
                measuresValues={measuresValues}
                handleMeasures={handleMeasures}
                setChosenEdge={setChosenEdge}
                getLastInputId={getLastInputId}
                overallLength={overallLength}
                setOverallLength={setOverallLength}
                submitPosition={submitPosition}
                submitEquipmentAndServicesPosition={submitEquipmentAndServicesPosition}
                submitSteelbarPosition={submitSteelbarPosition}
                submitSheetPosition={submitSheetPosition}
            />
            <ImageViewer
                bendGroup={props.bendGroup}
                open={open}
                chosenEdge={-1}
                dimX={70}
                dimY={70}
                scale={0.07}
                showLabel={false}
                width="70"
                height="70"
            />
        </>
    )
}