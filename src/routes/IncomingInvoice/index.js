/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  Divider, Grid, TextField, InputAdornment,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import Identifiers from './Indentifiers';
import { get, post } from '../../utils/requests';
import FileUploader from '../../components/FileUploader';

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

  const [invoiceId, setInvoiceId] = useState('');
  const [incomingDate, setIncomingDate] = useState(new Date().toJSON().slice(0, 10));
  const [supplierId, setSupplierId] = useState('');
  const [supplierData, setSupplierData] = useState({});
  const [supplierDescription, setSupplierDescription] = useState('');
  const [paymentTargetDate, setPaymentTarget] = useState('dd/mm/yyy');
  const [bruttoAmount, setBruttoAmount] = useState(0);
  const [deadline1Per, setDeadline1Per] = useState(0);
  const [taxPer, setTaxPer] = useState(0);
  const [deadline1Date, setDeadline1Date] = useState('dd/mm/yyy');
  const [deadline1Amount, setDeadline1Amount] = useState(0);
  const [deadline2Date, setDeadline2Date] = useState('dd/mm/yyy');
  const [deadline2Amount, setDeadline2Amount] = useState(0);
  const [deadline3Date, setDeadline3Date] = useState('dd/mm/yyy');
  const [deadline3Amount, setDeadline3Amount] = useState(0);
  const [fileId, setFileId] = useState(null);

  const resetAll = () => {
    setInvoiceId('');
    setIncomingDate(new Date().toJSON().slice(0, 10));
    setSupplierDescription('');
    setSupplierData({});
    setBruttoAmount(0);
    setPaymentTarget('dd/mm/yyy');
    setSupplierId('');
    setDeadline1Date('dd/mm/yyy');
    setDeadline2Date('dd/mm/yyy');
    setDeadline3Date('dd/mm/yyy');
    setDeadline1Amount(0);
    setDeadline2Amount(0);
    setDeadline3Amount(0);
    setDeadline1Per(0);
    setTaxPer(0);
    setFileId(null);
  };
  const handleInvoiceChange = (e) => setInvoiceId(e.target.value);
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
            setSupplierData(data);
            setSupplierDescription(data.alias);
            setDeadline1Per(data.deadline_1_per);
            setDeadline1Date(new Date(new Date(incomingDate).setTime(new Date(incomingDate).getTime() + data.deadline_1 * 86400000)).toJSON().slice(0, 10));
            setDeadline2Date(new Date(new Date(incomingDate).setTime(new Date(incomingDate).getTime() + data.deadline_2 * 86400000)).toJSON().slice(0, 10));
            setDeadline3Date(new Date(new Date(incomingDate).setTime(new Date(incomingDate).getTime() + data.deadline_3 * 86400000)).toJSON().slice(0, 10));
          } else {
            setSupplierData({});
            setSupplierDescription('');
            setDeadline1Per(0);
            setTaxPer(0);
            setDeadline1Date('dd/mm/yyy');
            setDeadline2Date('dd/mm/yyy');
            setDeadline3Date('dd/mm/yyy');
            setDeadline1Amount(0);
            setDeadline2Amount(0);
            setDeadline3Amount(0);
            setBruttoAmount(0);
            setPaymentTarget('dd/mm/yyy');
          }
        },
        null,
      );
    }
  };
  const loadSupplier = (e) => {
    if (e.key === 'ArrowDown') {
      get(
        `supplier/${supplierId === '' ? 0 : supplierId}/prev`,
        (data) => {
          if (data.id) {
            setSupplierId(data.id);
            setSupplierData(data);
            setSupplierDescription(data.alias);
            setDeadline1Per(data.deadline_1_per);
            setDeadline1Date(new Date(new Date(incomingDate).setTime(new Date(incomingDate).getTime() + data.deadline_1 * 86400000)).toJSON().slice(0, 10));
            setDeadline2Date(new Date(new Date(incomingDate).setTime(new Date(incomingDate).getTime() + data.deadline_2 * 86400000)).toJSON().slice(0, 10));
            setDeadline3Date(new Date(new Date(incomingDate).setTime(new Date(incomingDate).getTime() + data.deadline_3 * 86400000)).toJSON().slice(0, 10));
          } else {
            setSupplierData({});
            setSupplierDescription('');
            setDeadline1Date(0);
            setDeadline1Date('dd/mm/yyy');
            setDeadline2Date('dd/mm/yyy');
            setDeadline3Date('dd/mm/yyy');
            setDeadline1Amount(0);
            setDeadline2Amount(0);
            setDeadline3Amount(0);
            setBruttoAmount(0);
            setPaymentTarget('dd/mm/yyy');
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
            setSupplierData(data);
            setSupplierDescription(data.alias);
            setDeadline1Per(data.deadline_1_per);
            setDeadline1Date(new Date(new Date(incomingDate).setTime(new Date(incomingDate).getTime() + data.deadline_1 * 86400000)).toJSON().slice(0, 10));
            setDeadline2Date(new Date(new Date(incomingDate).setTime(new Date(incomingDate).getTime() + data.deadline_2 * 86400000)).toJSON().slice(0, 10));
            setDeadline3Date(new Date(new Date(incomingDate).setTime(new Date(incomingDate).getTime() + data.deadline_3 * 86400000)).toJSON().slice(0, 10));
          } else {
            setSupplierData({});
            setSupplierDescription('');
            setDeadline1Per(0);
            setTaxPer(0);
            setDeadline1Date('dd/mm/yyy');
            setDeadline2Date('dd/mm/yyy');
            setDeadline3Date('dd/mm/yyy');
            setDeadline1Amount(0);
            setDeadline2Amount(0);
            setDeadline3Amount(0);
            setBruttoAmount(0);
            setPaymentTarget('dd/mm/yyy');
          }
        },
        null,
      );
    }
  };
  const handleBruttoAmount = (e) => {
    setBruttoAmount(e.target.value);
    if (e.target.value.length > 0) {
      if (deadline1Per) {
        setDeadline1Amount(Number((e.target.value - ((e.target.value / 100) * deadline1Per)).toFixed(2)));
      }
      if (supplierData.deadline_2_per) {
        setDeadline2Amount(Number((e.target.value - ((e.target.value / 100) * supplierData.deadline_2_per)).toFixed(2)));
      }
      if (supplierData.deadline_3_per) {
        setDeadline3Amount(Number((e.target.value - ((e.target.value / 100) * supplierData.deadline_3_per)).toFixed(2)));
      }
    }
  };

  const saveIncomingInvoice = (e) => {
    if (e.key === 'Enter' && e.target.value !== 0) {
      post({
        invoiceId,
        incomingDate,
        supplierId,
        bruttoAmount,
        nettoAmount: Number(parseFloat(bruttoAmount) + (parseFloat(bruttoAmount) / 100) * taxPer),
        paymentTargetDate,
        supplierAlias: supplierData.alias,
        supplierName1: supplierData.name1,
        supplierName2: supplierData.name2,
        deadline1Per,
        deadline2Per: supplierData.deadline_2_per,
        deadline3Per: supplierData.deadline_3_per,
        deadline1Amount,
        deadline1Date,
        deadline2Date,
        deadline2Amount,
        deadline3Amount,
        deadline3Date,
        paymentMethod: '-',
        paymentDate: null,
        fileId,
      }, 'incoming_invoices', (data) => {
        if (data.id) {
          enqueueSnackbar(`Rechnung #${data.id} gespeichert!`, { variant: 'success' });
          resetAll();
          const documentRefElement = document.querySelector(
            '[id=input-1]',
          );
          setTimeout(() => documentRefElement.focus(), 100);
        }
      }, null);
    }
  };
  useEffect(() => {
    if (supplierData.payment_target) {
      setPaymentTarget(new Date(new Date(incomingDate).setTime(new Date(incomingDate).getTime()
          + parseInt(supplierData.payment_target, 10) * 86400000)).toJSON().slice(0, 10));
    }
  }, [supplierData]);
  return (
    <>
      <Grid item xs={12}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" className={classes.root}>
          <Identifiers
            invoiceId={invoiceId}
            supplierId={supplierId}
            incomingDate={incomingDate}
            handleIncomingDateChange={handleIncomingDateChange}
            handleInvoiceChange={handleInvoiceChange}
            handleSupplierChange={handleSupplierChange}
            loadSupplier={loadSupplier}
            helperText={supplierDescription}
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Divider variant="middle" />
      </Grid>

      <Grid item xs={4}>
        {supplierData.name1 && (
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box display="flex" flexDirection="column" justifyContent="center">
            <TextField
              id="label-1"
              type="text"
              label="Ext-Kunden-Nr"
              name="customer_ext_number"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={supplierData.customer_ext_number}
            />
            <TextField
              id="label-2"
              type="text"
              label="Name 1"
              name="name1"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={supplierData.name1}
            />
            <TextField
              id="label-3"
              type="text"
              label="Name 2"
              name="name2"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={supplierData.name2}
            />
            <TextField
              id="label-4"
              type="text"
              label="Strasse"
              name="street"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={supplierData.street}
            />
            <TextField
              id="label-5"
              type="text"
              label="PLZ"
              name="postal_code"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={supplierData.postal_code}
            />
            <TextField
              id="label-6"
              type="text"
              label="ORT"
              name="location"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={supplierData.location}
            />
            <TextField
              id="label-7"
              type="text"
              label="Vorwahl"
              name="pre_number"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={supplierData.pre_number}
            />
            <TextField
              id="label-7"
              type="text"
              label="Telefon"
              name="phone"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={supplierData.phone}
            />
            <TextField
              id="label-8"
              type="text"
              label="FAX"
              name="telefax"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={supplierData.telefax}
            />
            <TextField
              id="label-9"
              type="text"
              label="BLZ"
              name="bank_code"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={supplierData.bank_code}
            />
            <TextField
              id="label-10"
              type="text"
              label="Bank"
              name="name2"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={supplierData.bank}
            />
            <TextField
              id="label-11"
              type="text"
              label="Bank Konto"
              name="bank_account"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input2}
              value={supplierData.bank_account}
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
          <Box display="flex" width="100%" flexDirection="row" justifyContent="space-between">
            <TextField
              id="label-13"
              label="Fällig Am"
              type="date"
              name="paymentTargetDate"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input}
              value={paymentTargetDate}
            />
            <TextField
              id="input-6"
              label="Steuer"
              type="number"
              name="taxPer"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">%</InputAdornment>,
              }}
              variant="outlined"
              className={classes.input}
              value={taxPer}
              onChange={(e) => setTaxPer(parseInt(e.target.value, 10))}
            />
            <TextField
              id="input-7"
              label="Brutto Betrag"
              type="number"
              name="brutto_amount"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
              variant="outlined"
              className={classes.input}
              value={bruttoAmount}
              onChange={handleBruttoAmount}
              onKeyDown={saveIncomingInvoice}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider variant="middle" style={{ margin: '1rem 0 1rem 0' }} />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" width="100%" flexDirection="row" justifyContent="space-between">
            <TextField
              id="input-4"
              label="Skonto 1"
              type="text"
              name="deadline_1_per"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">%</InputAdornment>,
              }}
              variant="outlined"
              className={classes.input}
              value={deadline1Per}
              onChange={(e) => setDeadline1Per(e.target.value)}
            />
            <TextField
              id="input-5"
              label="Bis"
              type="date"
              name="brutto_amount"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              className={classes.input}
              value={deadline1Date}
              onChange={(e) => setDeadline1Date(e.target.value)}
            />
            <TextField
              id="label-14"
              label="Betrag"
              type="text"
              name="deadline_1_amount"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
              disabled
              variant="outlined"
              className={classes.input}
              value={deadline1Amount}
            />
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <TextField
              id="label-15"
              label="Skonto 2"
              type="text"
              name="deadline_2_per"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">%</InputAdornment>,
              }}
              disabled
              variant="outlined"
              className={classes.input}
              value={supplierData.deadline_2_per}
            />
            <TextField
              id="label-16"
              label="Bis"
              type="date"
              name="deadline_2_date"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input}
              value={deadline2Date}
            />
            <TextField
              id="label-17"
              label="Betrag"
              type="text"
              name="deadline_2_amount"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
              disabled
              variant="outlined"
              className={classes.input}
              value={deadline2Amount}
            />
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <TextField
              id="label-18"
              label="Skonto 3"
              type="text"
              name="deadline_3_per"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">%</InputAdornment>,
              }}
              disabled
              variant="outlined"
              className={classes.input}
              value={supplierData.deadline_3_per}
            />
            <TextField
              id="label-19"
              label="Bis"
              type="date"
              name="deadline_3_date"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              variant="outlined"
              className={classes.input}
              value={deadline3Date}
            />
            <TextField
              id="label-20"
              label="Betrag"
              type="text"
              name="deadline_3_amount"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
              disabled
              variant="outlined"
              className={classes.input}
              value={deadline3Amount}
            />
          </Box>
          <Divider variant="middle" style={{ margin: '1rem 0 1rem 0' }} />
          <Box display="flex" flexDirection="row" justifyContent="center">
            <FileUploader setFileId={setFileId} focusElId="input-7" fileId={fileId} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
