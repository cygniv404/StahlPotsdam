import {TextField} from "@material-ui/core";
import React from "react";

export default function(props){
    return (
            <>
                <TextField
                    autoFocus
                    id="input-1"
                    label="Quelle Auftrag"
                    type="text"
                    name="auftrag_quelle"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    value={props.orderSourceId}
                    onKeyDown={(e) => {
                        props.loadSourceOrder(e);
                    }}
                    ref={props.orderSourceRef}
                />

                <TextField
                    id="input-2"
                    label="Ziel Auftrag"
                    type="text"
                    name="auftrag_ziel"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    value={props.orderTargetId}
                    onKeyDown={(e) => {
                        props.loadTargetOrder(e);
                    }}
                />
            </>


    )
}