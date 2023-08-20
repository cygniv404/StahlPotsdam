import {TextField} from "@material-ui/core";
import React from "react";

export default function (props) {
    return (
        <>
            <TextField
                autoFocus
                id="input-1"
                label={props.sourceCollection === 'article' ? "Artikel" : "Warrengruppe"}
                type="text"
                name="article"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                value={props.articleId}
                helperText={props.helperText?.length > 0 ? props.helperText : null}
                onChange={props.handleArticleChange}
                onKeyDown={(e) => {
                    props.loadArticle(e);
                }}
            />
            <TextField
                id="input-2"
                label="Kunde"
                type="text"
                name="client"
                InputLabelProps={{
                    shrink: true,
                }}
                value={props.clientId}
                variant="outlined"
                onChange={props.handleClientChange}
                onKeyDown={props.loadClient}
            />
        </>
    )
}