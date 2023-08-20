import {TextField} from "@material-ui/core";
import React from "react";

export default function (props) {
    return (
        <>
            <TextField
                autoFocus
                id="input-1"
                label={props.type === 'order' ? "Auftrag" : "Angebot"}
                type="text"
                name={props.type === 'order' ? "auftrag" : "angebot"}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    placeholder: `${props.type === 'order' ? "Neuer Auftrag" : "Neues Angebot"}`
                }}
                variant="outlined"
                value={props.documentId}
                onChange={props.handleDocumentIdChange}
                onKeyDown={(e) => {
                    props.loadDocument(e);
                }}
            />
            <TextField
                id="input-2"
                label="Kunde"
                type="text"
                name="kunde"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    placeholder: 'Neue Kunde'
                }}
                value={props.clientId}
                variant="outlined"
                onChange={props.handleClientIdChange}
                onKeyDown={(e) => {
                    props.loadCostFromClient(e);
                    props.loadClient(e);
                }}


            />
            <TextField
                id="input-3"
                label="Kostenstelle"
                type="text"
                name="kostenstelle"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    placeholder: 'Neue Kostenstelle'
                }}
                value={props.costId}
                variant="outlined"
                onKeyDown={(e) => {
                    props.resetCost(e);
                    props.loadCost(e);
                }}
                onChange={props.handleCostIdChange}
            />
        </>
    )
}