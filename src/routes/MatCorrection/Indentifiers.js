import {TextField} from "@material-ui/core";
import React from "react";

export default function (props) {
    return (
        <>
            <TextField
                autoFocus
                id="input-1"
                label="Auftrag"
                type="text"
                name="auftrag"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                value={props.documentId}
                onChange={props.onChange}
                onKeyDown={(e) => {
                    props.loadDocument(e);
                }}
            />
        </>


    )
}