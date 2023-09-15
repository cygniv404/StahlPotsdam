import LogoutIcon from '@mui/icons-material/Logout';
import Fab from '@mui/material/Fab';
import React from 'react';
import { withRouter } from '../../utils/withRouter';

function FabLogin({ dispatch, navigate, menus }) {
  const logoutUser = () => {
    dispatch({ type: 'LOGOUT_USER' });
    navigate('/');
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
      onClick={logoutUser}
    >
      {menus.user.name}
      <LogoutIcon sx={{ ml: 1 }} />
    </Fab>
  );
}

export default withRouter(FabLogin);
