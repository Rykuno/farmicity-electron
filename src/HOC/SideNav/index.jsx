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
import FSBackground from '../../assets/images/fsBackground.png';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundImage: `url(${FSBackground})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    // backgroundColor: '#4caf50'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: 'rgb(50,50,50, 0.8)'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: {
    ...theme.mixins.toolbar,
  },
  text: {
    fontWeight: 'bolder',
    color: 'white'
  },
  sidebarIcon: {
    color: 'white'
  },
  selectedItem: {
    backgroundColor: 'grey',
    '&:hover': {
      //you want this to be the same as the backgroundColor above
      backgroundColor: 'grey'
    }
  },
  nonSelectedItem: {}
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

    listItemClass = uri => {
      const { history, classes } = this.props;
      const { pathname } = history.location;
      if (uri === pathname) {
        return classes.selectedItem;
      }

      return classes.nonSelectedItem;
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
              <ListItem
                button
                onClick={this.navigateTo('/')}
                className={this.listItemClass('/')}
              >
                <ListItemIcon>
                  <GamesIcon className={classes.sidebarIcon} />
                </ListItemIcon>
                <ListItemText
                  primary="Games"
                  classes={{ primary: classes.text }}
                />
              </ListItem>
              <ListItem
                button
                onClick={this.navigateTo('/mods')}
                className={this.listItemClass('/mods')}
              >
                <ListItemIcon>
                  <ModsIcon className={classes.sidebarIcon} />
                </ListItemIcon>
                <ListItemText
                  primary="Mods"
                  classes={{ primary: classes.text }}
                />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem
                button
                onClick={this.navigateTo('/settings')}
                className={this.listItemClass('/settings')}
              >
                <ListItemIcon>
                  <SettingsIcon className={classes.sidebarIcon} />
                </ListItemIcon>
                <ListItemText
                  primary="Settings"
                  classes={{ primary: classes.text }}
                />
              </ListItem>
              <ListItem button onClick={this.logout}>
                <ListItemIcon>
                  <LogoutIcon className={classes.sidebarIcon} />
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
