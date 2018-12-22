import React from 'react';
import withSideNav from '../../HOC/SideNav';
import { compose } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import Dashboard from './dashboard';
const settings = window.require('electron-settings');

const styles = theme => ({
  root: {
    width: '100%',
    height: '100vh',
    margin: 0
  },
  listItem: {
    listStyle: 'none',
    float: 'left',
    width: '20%'
  }
});

class Games extends React.Component {
  state = {
    saveGames: [],
    hasRequiredDirs: false
  };

  componentDidMount = () => {
    this.validateDirectories();
  };

  validateDirectories = () => {
    const hasGameDir = settings.has('gameDir.path');
    const hasDataDir = settings.has('gameDir.path');
    if (!hasGameDir || !hasDataDir) {
      this.setState({ hasRequiredDirs: false });
    } else {
      this.setState({ hasRequiredDirs: true });
    }
  };

  renderContent = () => {
    const { hasRequiredDirs } = this.state;
    if (hasRequiredDirs) {
      return <Dashboard />;
    } else {
      return (
        <div>
          <h1>Game and Data Directories not found</h1>
        </div>
      );
    }
  };

  render() {
    const { classes } = this.props;
    return <div className={classes.root}>{this.renderContent()}</div>;
  }
}

export default compose(
  withSideNav,
  withStyles(styles)
)(Games);
