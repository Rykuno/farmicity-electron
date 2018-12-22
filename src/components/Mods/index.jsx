import React from 'react';
import withSideNav from '../../HOC/SideNav';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import { getMods } from '../../Utility/mods';

const styles = theme => ({});

class Mods extends React.Component {

  componentDidMount = () => {
    getMods();
  }
  
  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withRouter,
  withSideNav
)(Mods);
