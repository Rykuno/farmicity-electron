import React from 'react';
import withSideNav from '../../HOC/SideNav';
import { compose } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { getSaveGames } from '../../Utility/parsers/savegames';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveGameItem from './ListItems/SaveGameItem';
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
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 50
  },
  saveGameList: {
    width: '100%',
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  }
});

class Games extends React.Component {
  state = {
    hasRequiredDirs: false
  };

  componentDidMount = () => {
    this.validateDirectories();
    getSaveGames().catch(err => {
      console.log(err);
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

  LoadingIndicator = () => {
    const { saveGames, classes } = this.props;
    const hasSavedGames = saveGames.length > 0;
    if (!hasSavedGames) {
      return (
        <div className={classes.progressContainer}>
          <CircularProgress className={classes.progress} size={100} />
        </div>
      );
    }

    return <React.Fragment />;
  };

  SavedGames = () => {
    const { saveGames, classes } = this.props;
    const hasSavedGames = saveGames.length > 0;
    if (!hasSavedGames) {
      return <React.Fragment />;
    }
    const saveGameItems = saveGames.map(saveGame => {
      return <SaveGameItem saveGame={saveGame} />;
    });

    return <ul className={classes.saveGameList}>{saveGameItems}</ul>;
  };

  RequiredDirectories = () => (
    <div>
      <h1>Game or Data Directory not found</h1>
    </div>
  );

  render() {
    const { classes } = this.props;
    const { hasRequiredDirs } = this.state;
    if (!hasRequiredDirs) {
      return <this.RequiredDirectories />;
    }

    return (
      <div className={classes.root}>
        <this.LoadingIndicator />
        <this.SavedGames />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  saveGames: state.store.saveGames
});

export default compose(
  withSideNav,
  withStyles(styles),
  connect(mapStateToProps)
)(Games);
