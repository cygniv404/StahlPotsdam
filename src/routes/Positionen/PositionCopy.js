import React, { useEffect, useRef, useState } from 'react';
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Switch,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import Identifiers from './IndentifiersCopy';
import { get, post } from '../../utils/requests';

const groupTranslation = {
  rebar: 'Betonstahl',
  beam_steelbar: 'Träger/Stabstahl',
  mat: 'Matten',
  sheet: 'Bleche',
  equipment: 'Zubehör',
  tube: 'Rohre',
  services: 'Dienstleistungen',
};
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
    },
  },
}));

export default function () {
  const classes = useStyles();
  const orderSourceRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const [orderSourceId, setOrderSourceId] = useState('');
  const [orderTargetId, setOrderTargetId] = useState('');
  const [positionsData, setPositionsData] = useState([]);
  const [positionDescription, setPositionDescription] = useState([]);
  const [positionCheckAll, setPositionCheckAll] = useState(false);
  const [positionCheck, setPositionCheck] = useState({});

  const loadOrder = (key, id, setId) => {
    if (key === 'ArrowDown') {
      get(
        `order/${id === '' ? 0 : id}/prev`,
        (data) => {
          if (data.id) {
            setId(data.id);
          }
        },
        null,
      );
    }
    if (key === 'ArrowUp') {
      get(
        `order/${id === '' ? 0 : id}/next`,
        (data) => {
          if (data.id) {
            setId(data.id);
          }
        },
        null,
      );
    }
  };
  const loadSourceOrder = (event) => {
    loadOrder(event.key, orderSourceId, setOrderSourceId);
  };
  const loadTargetOrder = (event) => {
    loadOrder(event.key, orderTargetId, setOrderTargetId);
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPositionCheck({ ...positionCheck, [name]: checked });
  };
  const handleChangeCheckAll = (e) => {
    setPositionCheckAll(e.target.checked);
    const newPositionsCheck = { ...positionCheck };
    Object.keys(newPositionsCheck).map((item) => {
      newPositionsCheck[item] = e.target.checked;
    });
    setPositionCheck(newPositionsCheck);
  };

  const switchPosition = (e) => {
    const { name } = e.target;
    if (e.key === 'ArrowLeft') {
      setPositionCheck({ ...positionCheck, [name]: false });
    }
    if (e.key === 'ArrowRight') {
      setPositionCheck({ ...positionCheck, [name]: true });
    }
  };

  const switchAllPosition = (e) => {
    if (e.key === 'ArrowLeft') {
      setPositionCheckAll(false);
      const newPositionsCheck = { ...positionCheck };
      Object.keys(newPositionsCheck).map((item) => {
        newPositionsCheck[item] = false;
      });
      setPositionCheck(newPositionsCheck);
    }
    if (e.key === 'ArrowRight') {
      setPositionCheckAll(true);
      const newPositionsCheck = { ...positionCheck };
      Object.keys(newPositionsCheck).map((item) => {
        newPositionsCheck[item] = true;
      });
      setPositionCheck(newPositionsCheck);
    }
  };
  const copyPosition = (e) => {
    if (e.key === 'Enter') {
      if (orderTargetId === '' || orderTargetId === orderSourceId || positionDescription.length === 0) {
        if (positionDescription.length === 0) {
          enqueueSnackbar('Keine Position gewählt!', { variant: 'info' });
        } else {
          enqueueSnackbar('Ziel Auftrag stimmt nicht!', { variant: 'info' });
        }
      } else {
        post({ positions: positionCheck }, `order/${orderSourceId}/position/copy/${orderTargetId}`, (data) => {
          if (data.id) {
            const orderRefElement = document.querySelector(
              '[id=input-1]',
            );
            setTimeout(() => orderRefElement.focus(), 100);

            enqueueSnackbar('Position(en) Kopiert!', { variant: 'success' });
          }
        }, () => enqueueSnackbar('Fehler: Position(en) kann nicht kopiert werden!', { variant: 'error' }));
      }
    }
  };

  const translate = (group) => groupTranslation[group];

  useEffect(() => {
    if (orderSourceId !== '') {
      get(`order/${orderSourceId}/position`, (data) => {
        if (data.length) {
          setPositionsData(data);
          const initialCheckedPositions = {};
          data.map((item) => {
            initialCheckedPositions[item.id] = false;
          });
          setPositionCheck(initialCheckedPositions);
        } else {
          setPositionsData([]);
          setPositionCheck({});
          setPositionDescription([]);
        }
      }, null);
    }
  }, [orderSourceId]);

  useEffect(() => {
    const descriptions = [];
    Object.keys(positionCheck).map((item, index) => {
      if (positionCheck[item] === true) {
        const description = {
          Position: positionsData[index].id,
          Warrengruppe: translate(positionsData[index].group),
          Artikel: `${positionsData[index].article_id} (${positionsData[index].article_description})`,
          Menge: positionsData[index].part_count,
          Biegeform: positionsData[index].bend_type_id,
          'Gesamte Länge': positionsData[index].overall_length,
        };
        descriptions.push(description);
      }
      setPositionDescription(descriptions);
    });
  }, [positionCheck]);
  return (
    <>
      <Grid item xs={12}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" className={classes.root}>
          <Identifiers
            orderSourceRef={orderSourceRef}
            orderSourceId={orderSourceId}
            orderTargetId={orderTargetId}
            loadSourceOrder={loadSourceOrder}
            loadTargetOrder={loadTargetOrder}
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Divider variant="middle" />
      </Grid>

      <Grid item xs={2}>
        {
                    Object.keys(positionCheck).length > 0 && (
                    <FormControl component="fieldset">
                      <FormLabel
                        component="legend"
                      >
                        {positionsData.length === 0 ? null : positionsData.length}
                        {' '}
                        Positionen
                      </FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={(
                            <Switch
                              id="input-3"
                              checked={positionCheckAll}
                              onChange={handleChangeCheckAll}
                              name="check All"
                              onKeyDown={switchAllPosition}
                            />
)}
                          label="Alle Positionen"
                        />
                        {Object.keys(positionCheck).map((item, index) => (
                          <FormControlLabel
                            control={(
                              <Switch
                                id={`input-${3 + index + 1}`}
                                checked={positionCheck[item]}
                                onChange={handleChange}
                                name={item}
                                onKeyDown={switchPosition}
                              />
)}
                            label={item}
                          />
                        ))}

                      </FormGroup>
                    </FormControl>
                    )
                }
      </Grid>

      <Grid item xs={1}>
        <Box display="flex" justifyContent="center" width="100%" style={{ height: '100%' }}>
          <Divider variant="middle" orientation="vertical" />
        </Box>
      </Grid>

      <Grid item xs={9}>
        <Box display="flex" flexDirection="column">
          {positionDescription.map((position) => (
            <Box display="flex" flexDirection="row" justifyContent="center">
              {Object.keys(position).map((item, index) => (
                <TextField
                  id={`label-${index}`}
                  type="text"
                  label={item}
                  name={item}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                  variant="outlined"
                  className={classes.input2}
                  value={position[item]}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Grid>
      {positionsData.length > 0 && (
        <Grid xs={12}>
          <Box display="flex" justifyContent="start">
            <Button
              id={`input-${3 + positionsData.length + 1}`}
              variant="contained"
              color="primary"
              onKeyDown={copyPosition}
            >
              Positionen Kopieren
            </Button>
          </Box>
        </Grid>
      )}
    </>
  );
}
