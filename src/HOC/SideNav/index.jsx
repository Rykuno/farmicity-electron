import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import Drawer from '@material-ui/core/Drawer';
import { withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import GamesIcon from '@material-ui/icons/Games';
import ModsIcon from '@material-ui/icons/ViewModule';
import SettingsIcon from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import { graphql } from 'react-apollo';
import * as Queries from '../../queries';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  toolbar: theme.mixins.toolbar,
  text: {
    fontWeight: 'bolder'
  }
});

const withDrawer = WrappedComponent => {
  class SideDrawer extends React.Component {
    state = {
      page: ''
    };

    logout = () => {
      const { logout } = this.props;
      logout().then(() => {
        this.props.history.push('/');
      });
    };

    navigateTo = url => () => {
      this.props.history.push(url);
      this.setState({
        page: url
      });
    };

    render() {
      const { classes } = this.props;

      return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography
                className={classes.text}
                variant="h6"
                color="inherit"
                noWrap
              >
                Farmicity
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div className={classes.toolbar} />
            <List>
              <ListItem button onClick={this.navigateTo('/')}>
                <ListItemIcon>
                  <GamesIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Games"
                  classes={{ primary: classes.text }}
                />
              </ListItem>
              <ListItem
                button
                onClick={this.navigateTo('/mods')}
                // style={{ backgroundColor: 'lightgrey' }}
              >
                <ListItemIcon>
                  <ModsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Mods"
                  classes={{ primary: classes.text }}
                />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button onClick={this.navigateTo('/settings')}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Settings"
                  classes={{ primary: classes.text }}
                />
              </ListItem>
              <ListItem button onClick={this.logout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  classes={{ primary: classes.text }}
                />
              </ListItem>
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <WrappedComponent />
          </main>
        </div>
      );
    }
  }

  SideDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  };

  const logoutOptions = {
    name: 'logout',
    options: {
      refetchQueries: [{ query: Queries.currentUser }]
    }
  };

  return compose(
    withStyles(styles, { withTheme: true }),
    graphql(Queries.logout, logoutOptions),
    withRouter
  )(SideDrawer);
};

export default withDrawer;
