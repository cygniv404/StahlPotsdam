import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import ImageList from './ImageList';
import { get } from '../../utils/requests';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function FullScreenDialog({
  bendGroup,
  open,
  handleClose,
  chosenEdge,
  dimX,
  dimY,
  scale,
  showLabel,
  width,
  height,
}) {
  const classes = useStyles();
  const [bendTypeData, setBendTypeData] = useState(null);
  useEffect(() => {
    get(`bend_type/${bendGroup}`, (data) => setBendTypeData(data), null);
  }, []);
  return (
    <Dialog
      fullScreen
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
      disableRestoreFocus
    >
      <>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Bilder
            </Typography>
          </Toolbar>
        </AppBar>
        {bendTypeData && (
        <ImageList
          chosenEdge={chosenEdge}
          bendTypeData={bendTypeData}
          dimX={dimX}
          dimY={dimY}
          scale={scale}
          showLabel={showLabel}
          width={width}
          height={height}
        />
        )}
      </>
    </Dialog>
  );
}
