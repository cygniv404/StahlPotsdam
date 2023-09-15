import LoginIcon from '@mui/icons-material/Login';
import Fab from '@mui/material/Fab';
import React from 'react';
import { withRouter } from '../../utils/withRouter';

function FabLogin({ navigate }) {
  const redirectToLogin = () => {
    navigate('/login');
  };
  return (
    <Fab
      color="secondary"
      variant="extended"
      sx={{
        position: 'absolute',
        bottom: (theme) => theme.spacing(2),
        right: (theme) => theme.spacing(2),
      }}
      onClick={redirectToLogin}
    >
      <LoginIcon sx={{ mr: 1 }} />
      Einloggen
    </Fab>
  );
}

export default withRouter(FabLogin);
