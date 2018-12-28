import React from 'react';
import { compose } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
const settings = window.require('electron-settings');

const styles = theme => ({

});

class Dashboard extends React.Component {

  componentDidMount = () => {
    this.fetchGameData();
  }

  fetchGameData = () => {
    
  }

  render() {
    return (
      <div>
        Dashboard
      </div>
    );
  }
}

export default compose (
  withStyles(styles),
)(Dashboard);