import React from 'react';
import { compose } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { Typography, TextField, Button } from '@material-ui/core';
import { graphql } from 'react-apollo';
import * as Queries from '../../queries';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  loginContainer: {
    width: '30%',
    padding: '30px',
    margin: 'auto',
    marginTop: '30px',
    [theme.breakpoints.down('sm')]: {
      width: '90%'
    }
  },
  inputContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  textField: {
    width: '90%',
    fontSize: '2em',
    margin: theme.spacing.unit,
    backgroundColor: 'white',
    [theme.breakpoints.down('sm')]: {
      width: '80%'
    }
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: '90%',
    height: '50px',
    background: theme.palette.secondary.main,
    margin: '8px',
    fontWeight: 'bold',
    color: 'white',
    [theme.breakpoints.down('sm')]: {
      width: '80%'
    }
  }
});

class LoginPage extends React.Component {
  state = {
    email: '',
    password: '',
    errors: []
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleLogin = () => {
    const { login, history } = this.props;
    const { email, password } = this.state;

    this.setState({ errors: [] });

    login({
      variables: {
        email,
        password
      }
    })
      .then(() => {
        history.push('/');
      })
      .catch(e => {
        console.log('Error: ', e);
        if (e.graphQLErrors) {
          const errors = e.graphQLErrors.map(error => error.message);
          this.setState({ errors });
        } else {
          alert('Error: ', e);
        }
      });
  };

  renderErrors = () => {
    const { errors } = this.state;
    const { classes } = this.props;

    const errorList = errors.map(error => {
      return <li key={error}>{error}</li>;
    });

    return <ul className={classes.error}>{errorList}</ul>;
  };

  render() {
    const { classes } = this.props;
    const { email, password } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.loginContainer} elevation={20}>
          <div className={classes.inputContainer}>
            <Typography variant="display3">Login</Typography>
            <TextField
              id="outlined-name"
              label="Email"
              className={classes.textField}
              value={email}
              variant="outlined"
              onChange={this.handleChange('email')}
              margin="normal"
              InputLabelProps={{
                shrink: true,
                classes: {
                  root: classes.resize
                }
              }}
              inputStyle={{ fontSize: '50px' }}
            />
            <TextField
              id="outlined-name"
              label="Password"
              className={classes.textField}
              value={password}
              onChange={this.handleChange('password')}
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
            />
            <div className={classes.buttonContainer}>
              <Button className={classes.button} onClick={this.handleLogin}>
                Login
              </Button>
              <Button className={classes.button}>Forgot Password</Button>
            </div>
            {this.renderErrors()}
          </div>
        </div>
      </div>
    );
  }
}

const loginOptions = {
  name: 'login',
  options: props => ({
    refetchQueries: [{ query: Queries.currentUser }]
  })
};

export default compose(
  // withNavBar({ transparent: false, absolute: false }),
  graphql(Queries.login, loginOptions),
  withStyles(styles),
  withRouter
)(LoginPage);
