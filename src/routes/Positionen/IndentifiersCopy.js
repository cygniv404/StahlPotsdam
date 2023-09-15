import { TextField } from '@mui/material';
import React from 'react';

export default function ({
  loadSourceOrder, loadTargetOrder, orderSourceId, orderSourceRef, orderTargetId,
}) {
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
        value={orderSourceId}
        onKeyDown={(e) => {
          loadSourceOrder(e);
        }}
        ref={orderSourceRef}
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
        value={orderTargetId}
        onKeyDown={(e) => {
          loadTargetOrder(e);
        }}
      />
    </>

  );
}
