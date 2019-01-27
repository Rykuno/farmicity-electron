import React from 'react';
import { compose } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { getMods } from '../../Utility/parsers/mods/modParser';
const settings = window.require('electron-settings');
const { getSaveGames } = require('../../Utility/saveGames');
const styles = theme => ({});

class Dashboard extends React.Component {
  componentDidMount = () => {
    // this.fetchGameData();

  };

  fetchGameData = () => {
    console.log('*************');
    getSaveGames().then(saveGameData => {
      console.log('SaveGameData: ', saveGameData);
    });
  };

  render() {
    return <div>Dashboard</div>;
  }
}

export default compose(withStyles(styles))(Dashboard);
