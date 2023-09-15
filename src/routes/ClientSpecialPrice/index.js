import React, { useState } from 'react';
import {
  Divider, Grid, TextField, InputAdornment,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import Identifiers from './Indentifiers';
import { get, post } from '../../utils/requests';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '80px',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  input: {
    marginTop: '0.25rem',
    marginBottom: '0.25rem',
    '&>div': {
      height: '35px',
    },
  },
  input2: {
    marginTop: '0.25rem',
    marginBottom: '0.25rem',
    '&>div': {
      height: '35px',
      width: '350px',
    },
  },
}));

export default function ({ sourceCollection, targetCollection }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [articleId, setArticleId] = useState(null);
  const [articleData, setArticleData] = useState({});
  const [clientId, setClientId] = useState(null);
  const [clientData, setClientData] = useState({});
  const [specialPrice, setSpecialPrice] = useState(0);

  const resetAll = () => {
    setArticleId('');
    setArticleData({});
    setClientData({});
    setClientId('');
    setSpecialPrice(0);
  };
  const handleArticleChange = (e) => {
    setArticleId(e.target.value);
    if (e.target.value.length > 0) {
      get(
        `${sourceCollection}/${e.target.value.replace('_', '/')}`,
        (data) => {
          if (data.id) {
            setArticleId(data.id);
            setArticleData(data);
          } else {
            setArticleData({});
          }
        },
        null,
      );
    }
  };
  const loadArticle = (e) => {
    if (e.key === 'ArrowDown') {
      get(
        `${sourceCollection}/${!articleId ? 0 : articleId.replace('/', '_')}/prev`,
        (data) => {
          if (data.id) {
            setArticleId(data.id);
            setArticleData(data);
          } else {
            setArticleData({});
          }
        },
        null,
      );
    }
    if (e.key === 'ArrowUp') {
      get(
        `${sourceCollection}/${!articleId ? 0 : articleId.replace('/', '_')}/next`,
        (data) => {
          if (data.id) {
            setArticleId(data.id);
            setArticleData(data);
          } else {
            setArticleData({});
          }
        },
        null,
      );
    }
  };

  const handleClientChange = (e) => {
    setClientId(e.target.value);
    get(
      `client/${!e.target.value ? 0 : parseInt(e.target.value, 10)}`,
      (data) => {
        if (data.id) {
          setClientData({
            alias: data.alias,
            address1Name1: data.name1,
            address1Name2: data.name2,
            address1Street: data.street,
            address1Post: data.postal_code,
            address1Place: data.location,
          });
        } else {
          setClientData({});
        }
      },
      null,
    );
  };
  const loadClient = (e) => {
    if (e.key === 'ArrowDown') {
      get(
        `client/${!clientId ? 0 : parseInt(clientId, 10)}/prev`,
        (data) => {
          if (data.id) {
            setClientId(data.id);
            setClientData({
              alias: data.alias,
              address1Name1: data.name1,
              address1Name2: data.name2,
              address1Street: data.street,
              address1Post: data.postal_code,
              address1Place: data.location,
            });
          } else {
            setClientData({});
          }
        },
        null,
      );
    }
    if (e.key === 'ArrowUp') {
      get(
        `client/${!clientId ? 0 : parseInt(clientId, 10)}/next`,
        (data) => {
          if (data.id) {
            setClientId(data.id);
            setClientData({
              alias: data.alias,
              address1Name1: data.name1,
              address1Name2: data.name2,
              address1Street: data.street,
              address1Post: data.postal_code,
              address1Place: data.location,
            });
          } else {
            setClientData({});
          }
        },
        null,
      );
    }
  };

  const saveSpecialPrice = (e) => {
    if (e.key === 'Enter' && e.target.value > 0) {
      post({
        client_id: clientId,
        article_id: articleId,
        [sourceCollection === 'article' ? 'amount' : 'amount_per']: parseFloat(specialPrice),
        unit: articleData.unit1 ?? articleData.unit,
      }, `client_special_price/${targetCollection}`, (data) => {
        if (data.id) {
          enqueueSnackbar('Kundensonderpreis gespeichert!', { variant: 'success' });
          resetAll();
          const documentRefElement = document.querySelector(
            '[id=input-1]',
          );
          setTimeout(() => documentRefElement.focus(), 100);
        }
      }, null);
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" className={classes.root}>
          <Identifiers
            articleId={articleId}
            clientId={clientId}
            handleArticleChange={handleArticleChange}
            handleClientChange={handleClientChange}
            loadArticle={loadArticle}
            loadClient={loadClient}
            helperText={articleData.name0 || articleData.description}
            sourceCollection={sourceCollection}
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Divider variant="middle" />
      </Grid>

      <Grid item xs={4}>
        {clientData.alias && (
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box display="flex" flexDirection="column" justifyContent="center">
            <TextField
              id="label-1"
              type="text"
              labelWidth={0}
              name="alias"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={clientData.alias}
            />
            <TextField
              id="label-2"
              labelWidth={0}
              type="text"
              name="address1Name1"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={clientData.address1Name1}
            />
            <TextField
              id="label-3"
              labelWidth={0}
              type="text"
              name="address1Name2"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={clientData.address1Name2}
            />
            <TextField
              id="label-4"
              labelWidth={0}
              type="text"
              name="address1Street"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={clientData.address1Street}
            />
            <TextField
              id="label-5"
              labelWidth={0}
              type="text"
              name="address1Post"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={clientData.address1Post}
            />
            <TextField
              id="label-6"
              labelWidth={0}
              type="text"
              name="address1Place"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={clientData.address1Place}
            />
          </Box>
        </Box>
        )}
      </Grid>

      <Grid item xs={1}>
        <Box display="flex" justifyContent="center" width="100%" style={{ height: '100%' }}>
          <Divider variant="middle" orientation="vertical" />
        </Box>
      </Grid>

      <Grid item xs={7}>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            {sourceCollection === 'article' && (
            <TextField
              id="label-7"
              label="Artikelpreis"
              type="number"
              name="articleprice"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment:
  <InputAdornment position="end">
    €/
    {articleData.unit1 ?? 'to'}
  </InputAdornment>,
              }}
              disabled
              variant="outlined"
              className={classes.input}
              value={articleData.articleprice ?? 0}
            />
            )}
            <TextField
              id="input-3"
              label="Kundensonderpreis"
              type="number"
              name="special_price"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment:
  <InputAdornment position="start">
    {sourceCollection === 'article' ? `€/${articleData.unit1 ?? 'to'}` : '%'}
  </InputAdornment>,
              }}
              variant="outlined"
              className={classes.input}
              value={specialPrice}
              onChange={(e) => setSpecialPrice(e.target.value)}
              onKeyDown={saveSpecialPrice}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
