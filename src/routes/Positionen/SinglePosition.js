import {Grid, InputAdornment, TextField} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import SingleImageViewer from "./SingleImageViewer";
import React from "react";


export default function ({
                             type,
                             classes,
                             partCount,
                             setPartCount,
                             partWidth,
                             setPartWidth,
                             positionType,
                             bendTypeId,
                             handleBendTypeChange,
                             loadBendType,
                             chosenEdge,
                             bendTypeData,
                             measures,
                             measuresValues,
                             handleMeasures,
                             setChosenEdge,
                             getLastInputId,
                             overallLength,
                             setOverallLength,
                             submitPosition,
                             submitEquipmentAndServicesPosition,
                             submitSteelbarPosition,
                             submitSheetPosition,
                         }) {
    if (type === 'rebar' || type === 'mat' || type === 'tube') {
        return (
            <Grid item xs={7}>
                <Grid item xs={12}>
                    <Box display='flex' flexDirection='row' justifyContent='space-between'>
                        <TextField
                            id="input-4"
                            label="Menge"
                            type="text"
                            name="partCount"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            className={classes.input}
                            value={partCount}
                            onChange={(e) => setPartCount(e.target.value)}
                            disabled={positionType !== type}
                        />
                        <TextField
                            id="input-5"
                            label="Biegeform"
                            type="text"
                            name="biegeform"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            className={classes.input}
                            value={bendTypeId}
                            onChange={handleBendTypeChange}
                            onKeyDown={loadBendType}
                            disabled={positionType !== type}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box display='flex' justifyContent='center' flexWrap='wrap'
                         style={{width: '550px', height: '100%'}}>
                        <SingleImageViewer
                            chosenEdge={chosenEdge}
                            bendTypeData={bendTypeData}
                            dimX={1000}
                            dimY={350}
                            scale={0.7}
                            showLabel={false}
                            width="1000"
                            height="350"
                            style={{position: 'relative', left: '200px'}}
                            lineWidth={3}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box display='flex' flexDirection='row' justifyContent='start'>
                        {
                            measuresValues && measures && Object.keys(measures).map((el, index) => {
                                if (measures[el] > 0) {
                                    return (
                                        <TextField
                                            key={index}
                                            id={`input-${5 + 1 + index}`}
                                            name={el}
                                            label={`${index + 1}`}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                endAdornment: <InputAdornment
                                                    position="start">{positionType === 'rebar' || positionType === 'mat' ? 'cm' : 'mm'}</InputAdornment>,
                                            }}
                                            variant="outlined"
                                            className={classes.input}
                                            value={measuresValues[el]}
                                            onChange={handleMeasures}
                                            onFocus={() => setChosenEdge(index + 1)}
                                            disabled={positionType !== type}
                                        />
                                    )
                                }
                            })
                        }
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box display='flex' flexDirection='row' justifyContent='start'>
                        <TextField
                            id={`input-${5 + getLastInputId() + 1}`}
                            label="Gesamte Länge"
                            type="text"
                            name="overallLength"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment
                                    position="start">{positionType === 'rebar' || positionType === 'mat' ? 'cm' : 'mm'}</InputAdornment>,
                            }}
                            variant="outlined"
                            className={classes.input}
                            value={overallLength}
                            onFocus={() => setChosenEdge(-1)}
                            onChange={(e) => setOverallLength(e.target.value)}
                            onKeyDown={submitPosition}
                            disabled={positionType !== type}
                        />
                    </Box>
                </Grid>
            </Grid>
        )
    }
    if (type === 'equipment' || type === 'services') {
        return (
            <Grid item xs={7}>
                <Grid item xs={12}>
                    <Box display='flex' flexDirection='row' justifyContent='space-between'>
                        <TextField
                            id="input-4"
                            label="Menge"
                            type="text"
                            name="partCount"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            className={classes.input}
                            value={partCount}
                            onChange={(e) => setPartCount(e.target.value)}
                            disabled={positionType !== type}
                            onKeyDown={submitEquipmentAndServicesPosition}
                        />
                    </Box>
                </Grid>
            </Grid>
        )
    }
    if (type === 'sheet') {
        return (
            <Grid item xs={7}>
                <Grid item xs={12}>
                    <Box display='flex' flexDirection='row' justifyContent='space-between'>
                        <TextField
                            id="input-4"
                            label="Menge"
                            type="text"
                            name="partCount"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            className={classes.input}
                            value={partCount}
                            onChange={(e) => setPartCount(e.target.value)}
                            disabled={positionType !== type}
                        />
                        <TextField
                            id="input-5"
                            label="Breite"
                            type="text"
                            name="breite"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment
                                    position="start">{positionType === 'rebar' || positionType === 'mat' ? 'cm' : 'mm'}</InputAdornment>,
                            }}
                            variant="outlined"
                            className={classes.input}
                            value={partWidth}
                            onChange={(e) => setPartWidth(e.target.value)}
                            disabled={positionType !== type}
                        />
                        <TextField
                            id='input-6'
                            label="Gesamte Länge"
                            type="text"
                            name="overallLength"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment
                                    position="start">{positionType === 'rebar' || positionType === 'mat' ? 'cm' : 'mm'}</InputAdornment>,
                            }}
                            variant="outlined"
                            className={classes.input}
                            value={overallLength}
                            onChange={(e) => setOverallLength(e.target.value)}
                            onKeyDown={submitSheetPosition}
                            disabled={positionType !== type}
                        />
                    </Box>
                </Grid>
            </Grid>
        )
    }
    if (type === 'beam_steelbar') {
        return (
            <Grid item xs={7}>
                <Grid item xs={12}>
                    <Box display='flex' flexDirection='row' justifyContent='space-between'>
                        <TextField
                            id="input-4"
                            label="Menge"
                            type="text"
                            name="partCount"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            className={classes.input}
                            value={partCount}
                            onChange={(e) => setPartCount(e.target.value)}
                            disabled={positionType !== type}
                        />
                        <TextField
                            id='input-5'
                            label="Gesamte Länge"
                            type="text"
                            name="overallLength"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment
                                    position="start">{positionType === 'rebar' || positionType === 'mat' ? 'cm' : 'mm'}</InputAdornment>,
                            }}
                            variant="outlined"
                            className={classes.input}
                            value={overallLength}
                            onChange={(e) => setOverallLength(e.target.value)}
                            onKeyDown={submitSteelbarPosition}
                            disabled={positionType !== type}
                        />
                    </Box>
                </Grid>
            </Grid>
        )
    }
}