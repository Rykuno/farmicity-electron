import React from 'react';
import withSideNav from '../../HOC/SideNav';
import { compose } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { getSaveGames } from '../../Utility/parsers/savegames';
const settings = window.require('electron-settings');

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
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
    getSaveGames().then(saveGames => {
      console.log(saveGames);
      this.setState({ saveGames });
    });
  };

  validateDirectories = () => {
    const hasGameDir = settings.has('gameDir.path');
    const hasDataDir = settings.has('dataDir.path');
    if (!hasGameDir || !hasDataDir) {
      this.setState({ hasRequiredDirs: false });
    } else {
      this.setState({ hasRequiredDirs: true });
    }
  };

  renderSaveGames = () => {
    const { saveGames } = this.state;
    const saveGameItems = saveGames.map(saveGame => {
      return (
        <li>
          <div>
            <p>{saveGame.mapTitle}</p>
          </div>
        </li>
      );
    });

    return <ul>{saveGameItems}</ul>;
  };

  renderContent = () => {
    const { hasRequiredDirs } = this.state;
    if (hasRequiredDirs) {
      return this.renderSaveGames();
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
