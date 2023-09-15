import React, { useEffect } from 'react';
import { Box, Container, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import { SnackbarProvider } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { getRoutes } from '../utils/menuTree';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#cfe8fc',
    height: '100vh',
  },
  content: {
    backgroundColor: 'whitesmoke',
    minHeight: '750px',
    height: '100%',
    padding: '1rem',
    '-webkit-box-shadow': '0px 6px 12px -8px #000000',
    'box-shadow': '0px 6px 12px -8px #000000',
  },
  footer: {
    height: '50px',
  },
});

function WithInputNavigator({ children }) {
  const navigate = useNavigate();
  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      const { id } = document.activeElement;
      const [, fieldIndex] = id.split('-');
      const nextSibling = document.querySelector(
        `[id=input-${parseInt(fieldIndex, 10) + 1}]`,
      );
      if (nextSibling !== null) {
        nextSibling.focus();
        if (nextSibling.select) {
          nextSibling.select();
        }
      }
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (document.activeElement.className.indexOf('MuiDialog-container') === -1) {
        navigate(-1);
      }
    }
  };

  useEffect(() => {
    console.log('init activeElement:', document.activeElement.tagName);
    if (document.activeElement.tagName === 'BODY') {
      setTimeout(() => {
        let documentRefElement = document.getElementById('input-1');
        if (!documentRefElement) {
          documentRefElement = document.getElementById('image-0');
        }
        if (documentRefElement) documentRefElement.parentElement.focus();
      }, 500);
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return children;
}

export default function Page() {
  const classes = useStyles();
  const { page } = useParams();
  const route = getRoutes(page);
  const { component, navigationItems } = route;
  return (
    <SnackbarProvider maxSnack={3}>
      <div className={classes.root}>
        <Container maxWidth="xl">
          <Typography component="div" className={classes.content}>
            <Grid container spacing={4} tabIndex="0">
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <WithInputNavigator>{component}</WithInputNavigator>
            </Grid>
          </Typography>
          <Box width="100%" justifyContent="center" display="flex" className={classes.footer}>
            <BottomNavigation navigationItems={navigationItems} />
          </Box>
        </Container>
      </div>
    </SnackbarProvider>
  );
}
