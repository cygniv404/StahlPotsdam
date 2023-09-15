import * as React from 'react';
import Button from '@mui/material/Button';
import {
  Checkbox, ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControlLabel, FormGroup,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {
  dlt, get, post, put,
} from '../../utils/requests';

const useStyles = makeStyles((theme) => ({
  dropdownRoot: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    width: '600px',
    top: 50,
    right: 0,
    left: 0,
    zIndex: 1,
    border: '1px solid',
    borderRadius: '5px',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  formGroup: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  checkbox: {
    width: '32%',
    '&>span': {
      fontSize: '0.75rem',
    },
  },
  input: {
    marginTop: '0.25rem',
    marginBottom: '0.25rem',
    '&>div': {
      height: '35px',
    },
  },
  input2: {
    margin: '0.25rem',
    '&>div': {
      height: '35px',
    },
  },
}));

function formalizeColumns(columns, editableId) {
  const form = {};
  columns.filter((item) => (editableId ? item : item.field !== 'id'))
    .map((item) => {
      const { field, headerName, type } = item;
      let defaultValue = '';
      if (type === 'number') {
        defaultValue = 0;
      }
      if (type === 'boolean') {
        defaultValue = false;
      }
      if (type === 'date') {
        defaultValue = new Date().toJSON().slice(0, 10);
      }
      form[field] = {
        headerName,
        type,
        value: defaultValue,
      };
    });
  return form;
}

export function ShowUpdateAmount({
  getSelectedRowData, handleTableUpdate, enqueueSnackbar, showButton,
}) {
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const [payingAmount, setPayingAmount] = React.useState(0);
  const [payingAmountHelperText, setPayingAmountHelperText] = React.useState(' ');
  const [discount, setDiscount] = React.useState(0);
  const [invoiceData, setInvoiceData] = React.useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState({ index: 1, text: 'Volksbank Überweisung' });
  const [paymentDate, setPaymentDate] = React.useState(new Date().toJSON().slice(0, 10));

  const handlePaymentMethod = (e) => {
    const index = e.target.value;
    const methods = [{ value: 1, label: 'Volksbank Überweisung' },
      { value: 2, label: 'Commerzbank Überweisung' },
      { value: 3, label: 'Lastschrift' },
      { value: 4, label: 'Bar' },
      { value: 5, label: 'Guthaben' }];
    const text = methods.filter((el) => el.value === index)[0].label;
    setPaymentMethod({ index, text });
  };
  const handleUpdateClickOpen = () => {
    setInvoiceData(getSelectedRowData());
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
  };

  const handleUpdate = () => {
    if (payingAmount === 0) {
      enqueueSnackbar('Betrag kann nicht 0 sein', { variant: 'warning' });
      return;
    }
    let openAmount = Math.abs(invoiceData.open_amount);
    if (discount !== 0) {
      openAmount = invoiceData[`deadline_${discount}_amount`];
      if (parseFloat(openAmount) === 0) {
        enqueueSnackbar(`Rechnung hat kein SKonto ${discount}`, { variant: 'info' });
        return;
      }
      // add default 21 hours for check on same day.
      const discountDate = new Date(new Date(invoiceData[`deadline_${discount}_date`]).setTime(new Date(invoiceData[`deadline_${discount}_date`]).getTime() + 21 * 60 * 60 * 1000));
      if (new Date(paymentDate).getTime() > discountDate) {
        enqueueSnackbar(`SKonto ${discount} ist abgelaufen`, { variant: 'info' });
        return;
      }
    }
    if (parseFloat(payingAmount) <= parseFloat(openAmount)) {
      post({
        paymentDate,
        paymentMethod: paymentMethod.text,
        openAmount,
        payedAmount: payingAmount,
        discount,
      }, `incoming_invoices/pay/${invoiceData.id}`, (data) => {
        if (data.id) {
          enqueueSnackbar(`Rechnung #${data.id} bezahlt!`, { variant: 'success' });
          const newRow = {
            open_amount: parseFloat(invoiceData.open_amount) - parseFloat(payingAmount),
            payment_date: paymentDate,
            payment_method: paymentMethod.text,
          };
          if (discount !== 0) {
            newRow[`deadline_${discount}_amount`] = parseFloat(openAmount) - parseFloat(payingAmount);
          }
          if (parseFloat(openAmount) - parseFloat(payingAmount) === 0) {
            newRow.payed = true;
            newRow.open_amount = 0;
            newRow.deadline_1_amount = 0;
            newRow.deadline_2_amount = 0;
            newRow.deadline_3_amount = 0;
          }
          handleTableUpdate(data.id, newRow);
          handleUpdateClose();
        }
      }, null);
    } else {
      enqueueSnackbar(`Betrag ${discount > 0 ? `mit SKonto ${discount} ` : ''}muss weniger oder gleich als ${openAmount} sein`, { variant: 'info' });
    }
  };
  useEffect(() => {
    setPayingAmountHelperText(`${invoiceData?.open_amount < 0 ? 'Achtung : Offener Minusbetrag: ' : 'Offener Betrag: '}${invoiceData?.open_amount}`);
  }, [invoiceData]);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateClickOpen}
        style={{ backgroundColor: !showButton ?? '#e8e8e8' }}
        disabled={!showButton}
      >
        Bezahlen
      </Button>
      {updateOpen && (
        <Dialog open={updateOpen} onClose={handleUpdateClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            Rechnung #
            {invoiceData.id}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="input-1"
              label="Betrag zu bezahlen"
              name="paying_amount"
              type="number"
              value={payingAmount}
              helperText={payingAmountHelperText}
              InputProps={{
                endAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
              onChange={(e) => setPayingAmount(e.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Abzug"
              id="input-2"
              value={discount}
              SelectProps={{
                name: 'discount',
                id: 'input-2',
                'aria-colindex': 'input-2',
              }}
              onChange={(e) => setDiscount(e.target.value)}
              fullWidth
              style={{ margin: '0.25rem' }}
            >
              {[{ value: 0, label: 'Ohne Abzug' },
                { value: 1, label: 'Skonto 1' },
                { value: 2, label: 'Skonto 2' },
                { value: 3, label: 'Skonto 3' }].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Zahlungsart"
              id="input-3"
              value={paymentMethod.index}
              SelectProps={{
                name: 'paymentMethod',
                id: 'input-3',
                'aria-colindex': 'input-2',
              }}
              onChange={handlePaymentMethod}
              fullWidth
              style={{ margin: '0.25rem' }}
            >
              {[{ value: 1, label: 'Volksbank Überweisung' },
                { value: 2, label: 'Commerzbank Überweisung' },
                { value: 3, label: 'Lastschrift' },
                { value: 4, label: 'Bar' },
                { value: 5, label: 'Guthaben' }].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
              ))}
            </TextField>
            <TextField
              id="input-4"
              label="Zahlungsdatum"
              type="date"
              name="bezahlungsdatum"
              InputLabelProps={{
                shrink: true,
              }}
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateClose} color="primary">
              Abrechnen
            </Button>
            <Button id="input-5" onClick={handleUpdate} color="primary">
              Bezahlen
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export function ShowCreateEntry({
  column, editableId, viewer, handleTableAdd, enqueueSnackbar,
}) {
  const [form, setForm] = React.useState(formalizeColumns(column, editableId));
  const [createOpen, setCreateOpen] = React.useState(false);
  const handleCreateClickOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setForm({ ...form, [name]: { ...form[name], value: form[name].type === 'boolean' ? checked : value } });
  };
  const handleCreate = () => {
    const newDocument = {};
    Object.keys(form).map((item) => {
      newDocument[item] = form[item].value;
    });
    put(newDocument, viewer, (data) => {
      if (data.id) {
        handleTableAdd(newDocument, data.id);
        handleCreateClose();
        enqueueSnackbar(`Eintrag #${data.id} erstellt!`, { variant: 'success' });
      }
    }, () => enqueueSnackbar('Fehler: Eintrag kann nicht erstellt werden!', { variant: 'error' }));
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateClickOpen}
      >
        Erstellen
      </Button>
      <Dialog open={createOpen} onClose={handleCreateClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Neue Eintrag Erstellen</DialogTitle>
        <DialogContent>
          {Object.keys(form).map((item, index) => {
            if (form[item].type !== 'boolean') {
              return (
                <TextField
                  margin="dense"
                  id={`input-${index}`}
                  label={form[item].headerName}
                  name={item}
                  type={form[item].type === 'date' ? 'date' : 'text'}
                  value={form[item].value}
                  onChange={handleChange}
                  fullWidth
                />
              );
            }
            return (
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={form[item].value}
                    onChange={handleChange}
                    name={item}
                    inputProps={{
                      'aria-label': 'primary checkbox',
                      id: `input-${index}`,
                    }}
                    color="primary"
                  />
                                      )}
                label={form[item].headerName}
              />
            );
          })}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose} color="primary">
            Abrechnen
          </Button>
          <Button onClick={handleCreate} color="primary">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function ShowDeleteEntry({
  selectionModel, viewer, handleTableDelete, enqueueSnackbar, disabled,
}) {
  const handleDelete = () => {
    if (selectionModel.length > 0) {
      dlt({ ids: selectionModel }, viewer, (data) => {
        if (data.id) {
          handleTableDelete(data.id);
          enqueueSnackbar(`Eintrag #${data.id} gelöscht!`, { variant: 'success' });
        }
      }, () => enqueueSnackbar('Fehler: Einträge können nicht gelöscht werden!', { variant: 'error' }));
    }
  };
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleDelete}
      style={{ marginLeft: '2rem', backgroundColor: disabled ? '#e8e8e8' : '#bf0909b0' }}
      disabled={disabled}
    >
      Löschen
    </Button>
  );
}

function getColumnVisibility(column) {
  const visibilityMap = [];
  Object.keys(column).map((c) => {
    const { hide, headerName, field } = column[c];
    visibilityMap.push({
      field,
      checked: !hide ?? false,
      headerName,
    });
  });
  return visibilityMap;
}

export function ShowHideColumn({
  column, updateColumnVisibility, viewer, enqueueSnackbar,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(getColumnVisibility(column));
  const handleChange = (event) => {
    const newState = [...state];
    newState.map((c) => {
      if (c.field === event.target.name) {
        c.checked = event.target.checked;
      }
    });
    setState(newState);
    updateColumnVisibility([{ field: event.target.name, checked: event.target.checked }]);
    post(newState, `dataGrid_column_visibility/${viewer}`, (data) => {
      if (data.id) {
        enqueueSnackbar('Spalten Sichtbarkeit gespeichert!', { variant: 'success' });
      }
    }, null);
  };

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  useEffect(() => {
    get(`dataGrid_column_visibility/${viewer}`, (data) => {
      if (data.columns_visibility) {
        setState(data.columns_visibility);
        updateColumnVisibility(data.columns_visibility);
      }
    }, null);
  });
  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={handleClickAway}
    >
      <div className={classes.dropdownRoot}>
        <IconButton aria-label="show-hide" color="primary" onClick={handleClick}>
          <ViewColumnIcon />
        </IconButton>
        {open ? (

          <div className={classes.dropdown}>
            <FormGroup className={classes.formGroup}>
              {
                                state.map((c) => (
                                  <FormControlLabel
                                    control={(
                                      <Checkbox
                                        checked={c.checked}
                                        onChange={handleChange}
                                        name={c.field}
                                      />
)}
                                    label={c.headerName}
                                    className={classes.checkbox}
                                  />
                                ))
                            }
            </FormGroup>
          </div>
        ) : null}
      </div>
    </ClickAwayListener>
  );
}

function getExcelData(columns, rows) {
  const newRows = [];
  rows.map(({ _id, ...r }) => r).map((r) => {
    const newRow = {};
    Object.keys(r).map((k) => {
      columns.map((c) => {
        if (c.field === k) {
          const { headerName } = c;
          let value = r[k];
          if (value === false) {
            value = 'nein';
          }
          if (value === true) {
            value = 'ja';
          }
          newRow[headerName] = value;
        }
      });
    });
    newRows.push(newRow);
  });
  return newRows;
}

export function ExportToExcel({ fileName, columns, getAllRows }) {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const handleClick = () => {
    const rows = getAllRows();
    const excelTableData = getExcelData(columns, rows);
    const ws = XLSX.utils.json_to_sheet(excelTableData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  return (
    <IconButton aria-label="export-xcl" color="primary" onClick={handleClick}>
      <SimCardDownloadIcon />
    </IconButton>
  );
}

export function ShowAmounts({
  bruttoAmount, openAmount, deadline1Amount, deadline2Amount, deadline3Amount,
}) {
  const classes = useStyles();
  return (
    <>
      <TextField
        id="label-1"
        label="Brutto Beträge"
        type="text"
        name="bruttoAmount"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        className={classes.input2}
        value={bruttoAmount}
        disabled
      />
      <TextField
        id="label-2"
        label="Offene Beträge"
        type="text"
        name="openAmount"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        className={classes.input2}
        value={openAmount}
        disabled
      />
      <TextField
        id="label-3"
        label="Skonto 1 Beträge"
        type="text"
        name="deadline1Amount"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        className={classes.input2}
        value={deadline1Amount}
        disabled
      />
      <TextField
        id="label-4"
        label="Skonto 2 Beträge"
        type="text"
        name="deadline2Amount"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        className={classes.input2}
        value={deadline2Amount}
        disabled
      />
      <TextField
        id="label-5"
        label="Skonto 3 Beträge"
        type="text"
        name="deadline3Amount"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        className={classes.input2}
        value={deadline3Amount}
        disabled
      />
    </>
  );
}
