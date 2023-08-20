import {TextField} from "@material-ui/core";
import React from "react";

export default function (props) {
    function getTypeInGerman() {
        switch (props.positionType) {
            case 'rebar':
                return 'Betonstahl'
            case 'mat':
                return 'Matten'
            case 'sheet':
                return 'Bleche'
            case 'services':
                return 'Dienstleistungen'
            case 'beam_steelbar':
                return 'Träger/Stabstahl'
            case 'equipment':
                return 'Zubehör'
            case 'tuebe':
                return 'Rohre'
            default:
                return ''
        }
    }

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
                onChange={props.handleDocumentChange}
                onKeyDown={(e) => {
                    props.loadDocument(e);
                }}
            />
            <TextField
                id="input-2"
                label="Position"
                type="text"
                name="position"
                InputLabelProps={{
                    shrink: true,
                }}
                value={props.positionId}
                helperText={props.disableArticleId ? getTypeInGerman() : ''}
                variant="outlined"
                onChange={props.handlePositionChange}
                onKeyDown={(e) => {
                    props.loadPosition(e);
                }}


            />
            <TextField
                id="input-3"
                label="Artikel"
                type="text"
                name="article"
                InputLabelProps={{
                    shrink: true,
                }}
                value={props.articleId}
                variant="outlined"
                onChange={props.handleArticleChange}
                helperText={props.helperText.length > 0 ? props.helperText : null}
                onKeyDown={props.loadArticle}
                disabled={props.disableArticleId}
            />
        </>
    )
}