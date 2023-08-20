import {TextField} from "@material-ui/core";
import React from "react";

export default function (props) {
    return (
        <>
            <TextField
                autoFocus
                id="input-1"
                label="Rechungsnr."
                type="number"
                name="invoice"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                value={props.invoiceId}
                onChange={props.handleInvoiceChange}
            />
            <TextField
                id="input-2"
                label="Datum"
                type="date"
                name="datum"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                value={props.incomingDate}
                onChange={props.handleIncomingDateChange}
            />
            <TextField
                id="input-3"
                label="Lieferanten-Nummer"
                type="text"
                name="supplier"
                InputLabelProps={{
                    shrink: true,
                }}
                value={props.supplierId}
                variant="outlined"
                onChange={props.handleSupplierChange}
                helperText={props.helperText.length > 0 ? props.helperText : null}
                onKeyDown={props.loadSupplier}
            />
        </>
    )
}