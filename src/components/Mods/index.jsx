import React from 'react';
import withSideNav from '../../HOC/SideNav';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import { getMods } from '../../Utility/parsers/mods/modParser';
import StoreItem from './listItems/StoreItem';
import GameplayItem from './listItems/GameplayItem';
import MapItem from './listItems/MapItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { addMods } from '../../actions/modActions';
import { connect } from 'react-redux';
const settings = window.require('electron-settings');
const fs = window.require('fs');

const styles = theme => ({
  img: {
    height: '100%',
    width: '100%',
    objectFit: 'cover'
  },
  modList: {
    width: '100%',
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  card: {
    maxWidth: 245
  },
  media: {
    height: 50,
    objectFit: 'cover'
  },
  listItem: {
    margin: '8px'
  },
  chip: {
    margin: theme.spacing.unit,
    alignSelf: 'center'
  },
  chipContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left'
  },
  cardTitle: {
    width: '100%'
  },
  progress: {},
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 50
  }
});

class Mods extends React.Component {
  state = {
    isLoading: false,
    hasRequiredDirs: false
  };

  componentDidMount = () => {
    this.validateDirectories();
    this.watchForChangesInModDir();
    if (!this.reduxStoreContainsMods()) {
      console.log("NO REDUX STORE MODS");
      this.fetchMods();
    }
  };

  watchForChangesInModDir = () => {
    try {
      const dir = settings.get('gameDir.path') + '/mods';
      fs.watch(dir, (eventType, filename) => {
        this.fetchMods();
      });
    } catch (e) {
      console.log(e);
    }
  };

  reduxStoreContainsMods = () => {
    const { mods } = this.props;
    return mods.length > 0;
  };

  fetchMods = () => {
    this.setState({ isLoading: true });
    getMods()
      .then(mods => {
        this.setState({
          mods,
          isLoading: false
        });
        this.props.saveMods(mods);
      })
      .catch(e => {
        this.setState({ isLoading: false });
        console.log(e);
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

  renderModList = () => {
    const { mods } = this.props;
    if (mods.length < 1) {
      return;
    }
    return mods.map(mod => {
      const { type } = mod;
      if (type === 'storeItem') {
        return <StoreItem mod={mod} />;
      }
      if (type === 'gameplay') {
        return <GameplayItem mod={mod} />;
      }
      if (type === 'map') {
        return <MapItem mod={mod} />;
      }
    });
  };

  renderMods = () => {
    const { mods } = this.props;
    if (mods.length < 1) {
      return;
    }
    return this.renderModList();
  };

  renderContent = () => {
    const { classes } = this.props;
    const { hasRequiredDirs, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className={classes.progressContainer}>
          <CircularProgress className={classes.progress} size={100} />
        </div>
      );
    }

    if (hasRequiredDirs) {
      return (
        <div>
          <ol className={classes.modList}> {this.renderMods()}</ol>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Game and Data Directories not found</h1>
        </div>
      );
    }
  };

  render() {
    console.log(this.props.mods);
    return this.renderContent();
  }
}

const mapStateToProps = state => ({
  mods: state.mods.mods
});

const mapDispatchToProps = dispatch => ({
  saveMods: mods => dispatch(addMods(mods))
});

export default compose(
  withSideNav,
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Mods);
