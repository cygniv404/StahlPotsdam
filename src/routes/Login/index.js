import React, { useState, useContext } from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import { authUser } from './utils';
import { MenuContext } from '../../state/menuContext';
import { withRouter } from '../../utils/withRouter';

const useStyles = makeStyles((theme) => createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 400,
    margin: `${theme.spacing(0)} auto`,
  },
  loginBtn: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
  },
  header: {
    textAlign: 'center',
    background: '#212121',
    color: '#fff',
  },
  card: {
    marginTop: theme.spacing(10),
  },
}));

function Login({ navigate }) {
  const classes = useStyles();
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const { dispatch } = useContext(MenuContext);

  const redirectToHomePage = () => {
    navigate('/');
  };
  const handleLogin = () => {
    setIsLogging(true);
    authUser({ name: userName, password: userPassword })
      .then((userAccount) => {
        setIsLogging(false);
        if (userAccount) {
          dispatch({
            type: 'UPDATE_USER_LOGIN',
            value: userAccount,
          });
          navigate('/');
        }
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (userName.length > 0 && userPassword.length > 0) {
        handleLogin();
      }
    }
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setUserPassword(event.target.value);
  };
  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="Stahlhandel Potsdam" />
        <CardContent>
          <div>
            <TextField
              fullWidth
              id="email"
              type="email"
              label="Name"
              placeholder="Name"
              margin="normal"
              onChange={handleUserNameChange}
              onKeyPress={handleKeyPress}
            />
            <TextField
              fullWidth
              id="password"
              type="password"
              label="Kennenwort"
              placeholder="Kennenwort"
              margin="normal"
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
            />
          </div>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            size="large"
            color="primary"
            className={classes.loginBtn}
            onClick={handleLogin}
            disabled={isLogging}
          >
            {isLogging ? <CircularProgress /> : 'Einloggen'}
          </Button>
          <Button
            variant="text"
            size="small"
            color="secondary"
            className={classes.loginBtn}
            onClick={redirectToHomePage}
          >
            Zurück Zum Menu
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}

export default withRouter(Login);
