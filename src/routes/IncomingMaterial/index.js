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

export default function () {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [articleId, setArticleId] = useState('');
  const [articleData, setArticleData] = useState({});
  const [supplierId, setSupplierId] = useState('');
  const [supplierDescription, setSupplierDescription] = useState('');

  const [deliveryAmount, setDeliveryAmount] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [incomingDate, setIncomingDate] = useState(new Date().toJSON().slice(0, 10));

  const resetAll = () => {
    setArticleId('');
    setIncomingDate(new Date().toJSON().slice(0, 10));
    setSupplierDescription('');
    setArticleData({});
    setDeliveryPrice(0);
    setDeliveryAmount(0);
    setSupplierId('');
  };
  const handleArticleChange = (e) => {
    setArticleId(e.target.value);
    if (e.target.value.length > 0) {
      get(
        `article/${e.target.value.replace('_', '/')}`,
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
        `article/${articleId === '' ? 0 : articleId.replace('/', '_')}/prev`,
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
        `article/${articleId === '' ? 0 : articleId.replace('/', '_')}/next`,
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
  const handleIncomingDateChange = (e) => {
    setIncomingDate(e.target.value);
  };
  const handleSupplierChange = (e) => {
    setSupplierId(e.target.value);
    if (e.target.value.length > 0) {
      get(
        `supplier/${e.target.value}`,
        (data) => {
          if (data.id) {
            setSupplierDescription(data.name1);
          } else {
            setSupplierDescription('');
          }
        },
        null,
      );
    }
  };
  const saveIncomingMaterial = (e) => {
    if (e.key === 'Enter' && e.target.value > 0) {
      post({
        articleId,
        incomingDate,
        deliveryPrice,
        deliveryAmount,
        supplierId,
      }, 'incoming_material', (data) => {
        if (data) {
          enqueueSnackbar('Material gespeichert!', { variant: 'success' });
          resetAll();
          const documentRefElement = document.querySelector(
            '[id=input-1]',
          );
          setTimeout(() => documentRefElement.focus(), 100);
        }
      }, null);
    }
  };
  const loadSupplier = (e) => {
    if (e.key === 'ArrowDown') {
      get(
        `supplier/${supplierId === '' ? 0 : supplierId}/prev`,
        (data) => {
          if (data.id) {
            setSupplierId(data.id);
            setSupplierDescription(data.name1);
          } else {
            setSupplierDescription('');
          }
        },
        null,
      );
    }
    if (e.key === 'ArrowUp') {
      get(
        `supplier/${supplierId === '' ? 0 : supplierId}/next`,
        (data) => {
          if (data.id) {
            setSupplierId(data.id);
            setSupplierDescription(data.name1);
          } else {
            setSupplierDescription('');
          }
        },
        null,
      );
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" className={classes.root}>
          <Identifiers
            articleId={articleId}
            supplierId={supplierId}
            incomingDate={incomingDate}
            handleIncomingDateChange={handleIncomingDateChange}
            handleArticleChange={handleArticleChange}
            handleSupplierChange={handleSupplierChange}
            loadArticle={loadArticle}
            loadSupplier={loadSupplier}
            helperText={supplierDescription}
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Divider variant="middle" />
      </Grid>

      <Grid item xs={4}>
        {articleData.name0 && (
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box display="flex" flexDirection="column" justifyContent="center">
            <TextField
              id="label-1"
              type="text"
              label="Bezeichnung"
              name="name0"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={articleData.name0}
            />
            <TextField
              id="label-2"
              label="Bestand"
              type="text"
              name="stock"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">{articleData.unit1}</InputAdornment>,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={articleData.stock}
            />
            <TextField
              id="label-3"
              label="DEK preis"
              type="text"
              name="purchase_price"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment:
  <InputAdornment
    position="start"
  >
    €/
    {articleData.unit1 ?? 'to'}
  </InputAdornment>,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={articleData.purchase_price}
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
            <TextField
              id="input-4"
              label="gelieferte Menge"
              type="number"
              name="delivery_amount"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment:
  <InputAdornment
    position="end"
  >
    {articleData.unit1 ?? 'to'}
  </InputAdornment>,
              }}
              variant="outlined"
              className={classes.input}
              value={deliveryAmount}
              onChange={(e) => setDeliveryAmount(e.target.value)}
            />
            <TextField
              id="input-5"
              label="Einkaufspreis"
              type="number"
              name="delivery_price"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment:
  <InputAdornment
    position="start"
  >
    €/
    {articleData.unit1 ?? 'to'}
  </InputAdornment>,
              }}
              variant="outlined"
              className={classes.input}
              value={deliveryPrice}
              onChange={(e) => setDeliveryPrice(e.target.value)}
              onKeyDown={saveIncomingMaterial}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
