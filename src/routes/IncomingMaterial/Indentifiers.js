import { TextField } from '@mui/material';
import React from 'react';

export default function ({
  articleId,
  handleArticleChange,
  handleIncomingDateChange,
  handleSupplierChange,
  helperText,
  incomingDate,
  loadArticle,
  loadSupplier,
  supplierId,
}) {
  return (
    <>
      <TextField
        autoFocus
        id="input-1"
        label="Artikel"
        type="text"
        name="article"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        value={articleId}
        onChange={handleArticleChange}
        onKeyDown={(e) => {
          loadArticle(e);
        }}
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
        value={incomingDate}
        onChange={handleIncomingDateChange}
      />
      <TextField
        id="input-3"
        label="Lieferanten-Nummer"
        type="text"
        name="supplier"
        InputLabelProps={{
          shrink: true,
        }}
        value={supplierId}
        variant="outlined"
        onChange={handleSupplierChange}
        helperText={helperText.length > 0 ? helperText : null}
        onKeyDown={loadSupplier}
      />
    </>
  );
}
