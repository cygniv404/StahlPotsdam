import { TextField } from '@mui/material';
import React from 'react';

export default function ({
  articleId,
  disableArticleId,
  documentId,
  handleArticleChange,
  handleDocumentChange,
  handlePositionChange,
  helperText,
  loadArticle,
  loadDocument,
  loadPosition,
  positionId,
  positionType,
}) {
  function getTypeInGerman() {
    switch (positionType) {
      case 'rebar':
        return 'Betonstahl';
      case 'mat':
        return 'Matten';
      case 'sheet':
        return 'Bleche';
      case 'services':
        return 'Dienstleistungen';
      case 'beam_steelbar':
        return 'Träger/Stabstahl';
      case 'equipment':
        return 'Zubehör';
      case 'tuebe':
        return 'Rohre';
      default:
        return '';
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
        value={documentId}
        onChange={handleDocumentChange}
        onKeyDown={(e) => {
          loadDocument(e);
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
        value={positionId}
        helperText={disableArticleId ? getTypeInGerman() : ''}
        variant="outlined"
        onChange={handlePositionChange}
        onKeyDown={(e) => {
          loadPosition(e);
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
        value={articleId}
        variant="outlined"
        onChange={handleArticleChange}
        helperText={helperText.length > 0 ? helperText : null}
        onKeyDown={loadArticle}
        disabled={disableArticleId}
      />
    </>
  );
}
