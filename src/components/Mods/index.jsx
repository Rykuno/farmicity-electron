import React from 'react';
import withSideNav from '../../HOC/SideNav';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import { getMods } from '../../Utility/mods';
const fs = window.require('fs');
const parseDDS = require('parse-dds');
const toArrayBuffer = require('buffer-to-arraybuffer');
var renderCompressed = require('./render-compressed');

const styles = theme => ({
  img: {
    height: '200px',
    width: '200px'
  }
});

class Mods extends React.Component {
  state = {
    mods: []
  };
  componentDidMount = () => {
    getMods().then(results => {
      const resultsWithDDSPath = this.changeImagePathsToDDS(results);
      console.log(resultsWithDDSPath);
    });
  };


  changeImagePathsToDDS = (results) => {
    return results.map(result => {
      const { imagePath } = result;
      const pngRegex = /(.png)$/
      const imagePathDDS = imagePath.replace(pngRegex, ".dds");
      return {
        ...result,
        imagePathDDS
      }
    })
  }

  renderMods = () => {
    const { mods } = this.state;
    if (mods.length < 1) {
      return;
    }

    return mods.map(mod => {

    })
  };

  parseDDSImage = (file) => {
    const buf = fs.readFileSync(file);
    var data = toArrayBuffer(buf);
    try {
      const dds = parseDDS(data);
      console.log(dds);
      const canvas = renderCompressed(parseDDS(data), data, {});
      console.log('CANVAS: ', canvas);
      return canvas;
    } catch (e) {}
  };

  // test = () => {
  //   const file =
  //     '/Users/rykuno/Library/Application Support/FarmingSimulator2019/mods/FS19_kroneBiGX580/store_kroneBiGX580.dds';
  //   const buf = fs.readFileSync(file);
  //   var data = toArrayBuffer(buf);
  //   try {
  //     const dds = parseDDS(data);
  //     console.log(dds);
  //     const canvas = renderCompressed(parseDDS(data), data, {});
  //     console.log('CANVAS: ', canvas);
  //     return canvas;
  //   } catch (e) {}
  //   // });
  // };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <h1>test</h1>
        {/* <img className={classes.img} src={this.test()} alt="" /> */}
      </div>
    );
  }
}

export default compose(
  withSideNav,
  withStyles(styles),
  withRouter
)(Mods);
