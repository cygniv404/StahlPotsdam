import { TextField } from '@mui/material';
import React from 'react';

export default function ({
  type,
  documentId,
  costId,
  handleDocumentIdChange,
  loadDocument,
  clientId,
  handleClientIdChange,
  loadCostFromClient,
  loadClient,
  resetCost,
  loadCost,
  handleCostIdChange,
}) {
  return (
    <>
      <TextField
        autoFocus
        id="input-1"
        label={type === 'order' ? 'Auftrag' : 'Angebot'}
        type="text"
        name={type === 'order' ? 'auftrag' : 'angebot'}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          placeholder: `${type === 'order' ? 'Neuer Auftrag' : 'Neues Angebot'}`,
        }}
        variant="outlined"
        value={documentId}
        onChange={handleDocumentIdChange}
        onKeyDown={(e) => {
          loadDocument(e);
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
          placeholder: 'Neue Kunde',
        }}
        value={clientId}
        variant="outlined"
        onChange={handleClientIdChange}
        onKeyDown={(e) => {
          loadCostFromClient(e);
          loadClient(e);
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
          placeholder: 'Neue Kostenstelle',
        }}
        value={costId}
        variant="outlined"
        onKeyDown={(e) => {
          resetCost(e);
          loadCost(e);
        }}
        onChange={handleCostIdChange}
      />
    </>
  );
}
