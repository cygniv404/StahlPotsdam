import { TextField } from '@mui/material';
import React from 'react';

export default function ({ documentId, onChange, loadDocument }) {
  return (
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
      onChange={onChange}
      onKeyDown={(e) => {
        loadDocument(e);
      }}
    />

  );
}
