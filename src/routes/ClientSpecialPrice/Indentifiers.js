import { TextField } from '@mui/material';
import React from 'react';

export default function ({
  sourceCollection,
  articleId,
  helperText,
  handleArticleChange,
  loadArticle,
  clientId,
  handleClientChange,
  loadClient,
}) {
  return (
    <>
      <TextField
        autoFocus
        id="input-1"
        label={sourceCollection === 'article' ? 'Artikel' : 'Warrengruppe'}
        type="text"
        name="article"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        value={articleId}
        helperText={helperText?.length > 0 ? helperText : null}
        onChange={handleArticleChange}
        onKeyDown={(e) => {
          loadArticle(e);
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
        value={clientId}
        variant="outlined"
        onChange={handleClientChange}
        onKeyDown={loadClient}
      />
    </>
  );
}
