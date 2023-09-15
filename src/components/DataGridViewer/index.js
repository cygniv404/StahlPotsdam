import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid, deDE, GridToolbarContainer } from '@mui/x-data-grid';
import {
  Divider, Grid, CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import { get, post } from '../../utils/requests';
import {
  ExportToExcel, ShowCreateEntry, ShowDeleteEntry, ShowHideColumn, ShowUpdateAmount, ShowAmounts,
} from './utils';
import FileUploader from '../FileUploader';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    '& .datagrid-row': {
      '& .datagrid-cell': {
        color: 'black',
        fontSize: '14px',
      },
      '&:hover': {
        '& .datagrid-cell': {
          // backgroundColor: 'gray',
        },
      },
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,
  },
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
}));

function CustomToolbar({
  viewer,
  columns,
  showCreate,
  showUpdateAmount,
  editableId,
  getSelectedRowData,
  getAllRows,
  selectionModel,
  handleTableDelete,
  handleTableAdd,
  handleTableUpdate,
  updateColumnVisibility,
  bruttoAmount,
  openAmount,
  deadline1Amount,
  deadline2Amount,
  deadline3Amount,
}) {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <GridToolbarContainer>
      <ShowHideColumn
        column={columns}
        updateColumnVisibility={updateColumnVisibility}
        viewer={viewer}
        enqueueSnackbar={enqueueSnackbar}
      />
      <ExportToExcel fileName={viewer} columns={columns} getAllRows={getAllRows} />
      <Divider orientation="vertical" variant="middle" flexItem />
      {showCreate && (
        <ShowCreateEntry
          column={columns}
          viewer={viewer}
          editableId={editableId}
          handleTableAdd={handleTableAdd}
          enqueueSnackbar={enqueueSnackbar}
        />
      )}
      {
                showUpdateAmount && (
                <ShowUpdateAmount
                  getSelectedRowData={getSelectedRowData}
                  handleTableUpdate={handleTableUpdate}
                  enqueueSnackbar={enqueueSnackbar}
                  showButton={selectionModel.length === 1}
                />
                )
            }
      <ShowDeleteEntry
        viewer={viewer}
        selectionModel={selectionModel}
        handleTableDelete={handleTableDelete}
        enqueueSnackbar={enqueueSnackbar}
        disabled={selectionModel.length < 1}
      />
      {viewer === 'incoming_invoices' && (
        <>
          <Divider orientation="vertical" variant="middle" flexItem />
          <ShowAmounts
            bruttoAmount={bruttoAmount}
            openAmount={openAmount}
            deadline1Amount={deadline1Amount}
            deadline2Amount={deadline2Amount}
            deadline3Amount={deadline3Amount}
          />
        </>
      )}
    </GridToolbarContainer>
  );
}

export default function BasicEditingGrid({
  viewer,
  column,
  editableId,
  showCreate = true,
  showUpdateAmount = false,
  uploadDocument = false,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [columns, setColumns] = useState(column);
  const [pageSize, setPageSize] = React.useState(10);
  const [rowCount, setRowCount] = React.useState(0);
  const [rows, setRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState();
  const [filterOperator, setFilterOperator] = React.useState();
  const [filterColumn, setFilterColumn] = React.useState();
  const [sortModel, setSortModel] = React.useState([{ field: 'id', sort: 'desc' }]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [fileId, setFileId] = React.useState(null);
  const [bruttoAmount, setBruttoAmount] = React.useState(0);
  const [openAmount, setOpenAmount] = React.useState(0);
  const [deadline1Amount, setDeadline1Amount] = React.useState(0);
  const [deadline2Amount, setDeadline2Amount] = React.useState(0);
  const [deadline3Amount, setDeadline3Amount] = React.useState(0);

  const getAllRows = () => rows.map(({ file_id, ...rest }) => rest);
  const handleCellEditCommit = React.useCallback(
    ({ id, field, value }) => {
      rows.map((item) => {
        if (item.id === id && item[field] !== value) {
          if (field.indexOf('date') !== -1) value = new Date(new Date(value).setTime(new Date(value).getTime() + 86400000)).toJSON().slice(0, 10);
          if (typeof id === 'string' && id.indexOf('/') !== -1) {
            id = id.replace('/', '_');
          }
          post({ field, value }, `${viewer}/${id}`, (data) => {
            if (data.id) {
              enqueueSnackbar('Feld aktualisiert!', { variant: 'success' });
              item[field] = value;
              return item;
            }
            return item;
          }, () => enqueueSnackbar('Fehler: Feld kann nicht aktualisiert werden!', { variant: 'error' }));
        }
      });
    },
    [rows],
  );

  const handleSortModelChange = (newModel) => {
    setSortModel(newModel);
  };

  const onFilterChange = React.useCallback((filterModel) => {
    setFilterValue(filterModel.items?.[0]?.value ?? undefined);
    setFilterColumn(filterModel.items?.[0]?.columnField);
    setFilterOperator(filterModel.items?.[0]?.operatorValue);
  }, []);

  const getSelectedRowData = () => {
    const newRows = rows.filter((item) => item.id === selectionModel[0]);
    return newRows[0];
  };
  const handleTableDelete = (ids) => {
    const newRows = rows.filter((item) => !ids.includes(item.id));
    setRows(newRows);
  };

  const handleTableAdd = (rowData, rowId) => {
    const newRows = [...rows];
    if (newRows.length >= pageSize) {
      newRows.pop();
    }
    newRows.unshift({ id: rowId, ...rowData });
    setRows(newRows);
  };

  const handleTableUpdate = (rowId, rowData) => {
    const newRows = rows.map((item) => {
      if (item.id === rowId) {
        return { ...item, ...rowData };
      }
      return item;
    });
    setRows(newRows);
  };

  const updateColumnVisibility = (columnsVisibility) => {
    const newColumns = [...columns];
    newColumns.map((c) => {
      columnsVisibility.map((v) => {
        if (c.field === v.field) {
          c.hide = !v.checked;
        }
      });
    });
    setColumns(newColumns);
  };
  useEffect(() => {
    let newColumns = columns.map((c) => {
      c.cellClassName = 'datagrid-cell';
      if (c.type === 'number') {
        c.valueFormatter = (params) => {
          if (params.value) {
            if (c.field === 'id' || c.field.indexOf('_id') > -1 || c.field.indexOf('postal_code') > -1 || c.field.indexOf('_post') > -1 || c.field.indexOf('_per') > -1 || c.field.indexOf('payment_target') > -1) {
              return parseFloat(params.value);
            }
            return parseFloat(params.value).toFixed(2);
          }
          return params.value;
        };
      }
      return c;
    });
    if (uploadDocument) {
      newColumns = [...newColumns,
        {
          field: 'file_id',
          headerName: 'Dokument',
          width: 150,
          renderCell: (params) => (
            <FileUploader
              viewer={viewer}
              setFileId={setFileId}
              fileId={params.value}
              documentId={params.row.id}
              inDataGrid
            />
          ),
        },
      ];
    }
    setColumns(newColumns);
  });
  async function getMethodsLists() {
    const orderMethods = await get('order_method/list', (data) => data.map((m) => m.method), null);

    const shippingMethods = await get('shipping_method/list', (data) => data.map((m) => m.method), null);
    return { orderMethods, shippingMethods };
  }

  useEffect(() => {
    if (viewer === 'orders_grid') {
      setLoading(true);
      getMethodsLists().then(({ orderMethods, shippingMethods }) => {
        let newColumns = [...columns];
        newColumns = [...newColumns,
          {
            field: 'bestellart',
            headerName: 'Bestellart',
            type: 'singleSelect',
            valueOptions: orderMethods,
            valueFormatter: (params) => orderMethods[params.value - 1],
            valueParser: (value) => Number(orderMethods.indexOf(value) + 1),
            editable: true,
            width: 250,
          },
          {
            field: 'versandart',
            headerName: 'Versandart',
            type: 'singleSelect',
            valueOptions: shippingMethods,
            valueFormatter: (params) => shippingMethods[params.value - 1],
            valueParser: (value) => Number(shippingMethods.indexOf(value) + 1),
            editable: true,
            width: 250,
          },
        ];
        setColumns(newColumns);
        setLoading(false);
      });
    }
  });
  useEffect(() => {
    let active = true;
    get(`${viewer}?pageSize=${pageSize}&page=${page}&filter=${filterValue ?? ''}&filterColumn=${filterColumn ?? ''}&filterOperator=${filterOperator ?? ''}&sortColumn=${sortModel.map((el) => el.field).join(',')}&sortOrder=${sortModel.map((el) => el.sort).join(',')}`, (data) => {
      setRowCount((prevState) => {
        if (prevState !== data.count) {
          return data.count;
        }
        return prevState;
      });
      setRows((prevRows) => {
        if (JSON.stringify(prevRows) !== JSON.stringify(data.rows)) {
          return data.rows;
        }
        return prevRows;
      });
      if (viewer === 'incoming_invoices') {
        const {
          brutto_amount,
          open_amount,
          deadline_1_amount,
          deadline_2_amount,
          deadline_3_amount,
        } = data.amounts;
        setBruttoAmount(brutto_amount);
        setOpenAmount(open_amount);
        setDeadline1Amount(deadline_1_amount);
        setDeadline2Amount(deadline_2_amount);
        setDeadline3Amount(deadline_3_amount);
      }
    }, null);
    if (!active) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return () => {
      active = false;
    };
  }, [page, pageSize, filterValue, filterColumn, filterOperator, sortModel, fileId]);
  return (
    <Grid xs={12}>
      <Box display="flex" width="100%" height="90vh" className={classes.root}>
        {loading
          ? (
            <Box display="flex" width="100%" alignItems="center" justifyContent="center">
              <CircularProgress color="secondary" />
            </Box>
          )
          : (
            <DataGrid
              rows={rows}
              columns={columns}
              className={classes.paper}
              getRowClassName="datagrid-row"
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[10, 20, 100]}
              pagination
              rowCount={rowCount}
              paginationMode="server"
              onPageChange={(newPage) => setPage(newPage)}
              filterMode="server"
              onFilterModelChange={onFilterChange}
              sortingMode="server"
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              onCellEditCommit={handleCellEditCommit}
              checkboxSelection
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              selectionModel={selectionModel}
              slots={{
                toolbar: CustomToolbar,
              }}
              slotProps={{
                toolbar: {
                  viewer,
                  columns,
                  showCreate,
                  editableId,
                  selectionModel,
                  showUpdateAmount,
                  bruttoAmount,
                  openAmount,
                  deadline1Amount,
                  deadline2Amount,
                  deadline3Amount,
                  getAllRows,
                  getSelectedRowData,
                  handleTableDelete,
                  handleTableAdd,
                  handleTableUpdate,
                  updateColumnVisibility,
                },
              }}
              disableSelectionOnClick
              loading={loading}
              localeText={deDE.props.MuiDataGrid.localeText}
            />
          )}
        <input
          id="input-0"
          autoFocus
          style={{
            width: '0', height: '0', opacity: '0', position: 'absolute',
          }}
        />
      </Box>
    </Grid>
  );
}
