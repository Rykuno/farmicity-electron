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
const etl = window.require('etl');
const unzipper = window.require('unzipper');
const StreamZip = window.require('node-stream-zip');
const path = window.require('path');

const styles = theme => ({
  img: {
    height: '150px',
    width: '150px'
  }
});

class Mods extends React.Component {
  state = {
    mods: [],
    zippedMods: []
  };
  componentDidMount = () => {
    getMods().then(({ unzippedMods, zippedMods }) => {
      const resultsWithDDSPath = this.changeImagePathsToDDS(unzippedMods);
      const zippedResultsWithDDSPath = this.changeImagePathsToDDS(zippedMods);
      Promise.all([
        this.parseZippedMods(zippedResultsWithDDSPath),
        this.parseMods(resultsWithDDSPath)
      ]).then(results => {
        const mods = results.flat(1);
        this.setState({
          mods
        });
      });
    });
  };

  parseZippedMods = zippedMods => {
    return new Promise((resolve, reject) => {
      if (zippedMods.length < 1) {
        resolve();
      }
      let promiseList = [];
      for (const mod of zippedMods) {
        promiseList.push(this.parseZippedDDSImage(mod));
      }

      Promise.all(promiseList).then(results => {
        resolve(results);
      });
    });
  };

  parseMods = mods => {
    return new Promise((resolve, reject) => {
      if (mods.length < 1) {
        resolve();
      }
      let promiseList = [];
      for (const mod of mods) {
        promiseList.push(this.parseDDSImage(mod));
      }

      Promise.all(promiseList).then(results => {
        resolve(results);
      });
    });
  };

  parseDDSImage = mod => {
    const { imagePathDDS } = mod;
    const buf = fs.readFileSync(imagePathDDS);
    var data = toArrayBuffer(buf);
    try {
      const imgData = renderCompressed(parseDDS(data), data, {});
      return {
        ...mod,
        imgData
      };
    } catch (e) {}
  };

  parseZippedDDSImage = mod => {
    return new Promise((resolve, reject) => {
      const { imagePathDDS } = mod;
      const zipPath = mod.path;
      const imageFile = path.basename(imagePathDDS);
      fs.createReadStream(zipPath)
        .pipe(unzipper.Parse())
        .pipe(
          etl.map(entry => {
            if (entry.path === imageFile)
              entry.buffer().then(content => {
                const data = toArrayBuffer(content);
                const imgData = renderCompressed(parseDDS(data), data, {});
                resolve({
                  ...mod,
                  imgData
                });
              });
            else entry.autodrain();
          })
        );
    });
  };

  changeImagePathsToDDS = results => {
    return results.map(result => {
      const { imagePath } = result;
      const pngRegex = /(.png)$/;
      const imagePathDDS = imagePath.replace(pngRegex, '.dds');
      return {
        ...result,
        imagePathDDS
      };
    });
  };

  renderMods = () => {
    const { classes } = this.props;
    const { mods } = this.state;
    if (mods.length < 1) {
      return;
    }
    console.log('MODS: ', mods);
    return mods.map(mod => {
      const { imgData } = mod;
      return (
        <li>
          <img className={classes.img} src={imgData} alt="" />
        </li>
      );
    });
  };

  renderZippedMods = () => {
    const { classes } = this.props;
    const { zippedMods } = this.state;
    if (zippedMods.length < 1) {
      return;
    }

    return zippedMods.map(mod => {
      const { imgData } = mod;
      return (
        <li>
          <img className={classes.img} src={imgData} alt="" />
        </li>
      );
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <h1>test</h1>
        {/* <ol>{this.renderZippedMods()}</ol> */}
        <ol>{this.renderMods()}</ol>
      </div>
    );
  }
}

export default compose(
  withSideNav,
  withStyles(styles),
  withRouter
)(Mods);
