import React from 'react';
import { TextField, Typography } from '@material-ui/core';
import { compose } from 'react-apollo';
import withSideNav from '../../HOC/SideNav';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import FolderIcon from '@material-ui/icons/Folder';
import IconButton from '@material-ui/core/IconButton';
const settings = window.require('electron-settings');
const electron = window.require('electron').remote;
const dialog = electron.dialog;
const fs = window.require('fs');

const styles = theme => ({});

class Settings extends React.Component {
  state = {
    gameDir: '',
    dataDir: ''
  };

  componentDidMount = () => {
    const gameDir = settings.get('gameDir.path');
    const dataDir = settings.get('dataDir.path');
    console.log('SETTINGS: ', gameDir);
    console.log('SETTINGS: ', dataDir);
    this.setState(
      {
        gameDir,
        dataDir
      },
      () => {
        this.validateGameDir();
        this.validateDataDir();
      }
    );
  };

  selectDirectory = directory => () => {
    dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      path => {
        if (!path) {
          return;
        }
        this.setState(
          {
            [directory]: path[0]
          },
          () => {
            directory === 'gameDir'
              ? this.validateGameDir()
              : this.validateDataDir();
          }
        );
        settings.set(directory, { path: path[0] });
      }
    );
  };

  validateGameDir = () => {
    const { gameDir } = this.state;
    console.log('GAME DIRECTORY: ', gameDir);
    if (!gameDir) {
      this.setState({ gameDirError: 'Unable to valdiate game directory' });
      return;
    }

    fs.readdir(gameDir, 'utf8', (err, files) => {
      if (!files.includes('game.xml') || err) {
        this.setState({
          gameDirError: 'Unable to validate game directory'
        });
      } else {
        this.setState({ gameDirError: '' });
      }
    });
  };

  validateDataDir = () => {
    const { dataDir } = this.state;

    if (!dataDir) {
      this.setState({ dataDirError: 'Unable to valdiate data directory' });
      return;
    }

    fs.readdir(dataDir, 'utf8', (err, files) => {
      console.log('DATA DIR: ', files);
      if (err || !files.includes('vehicles')) {
        this.setState({
          dataDirError: 'Unable to validate data directory'
        });
      } else {
        this.setState({ dataDirError: '' });
      }
    });
  };

  handleChange = name => event => {
    this.setState(
      {
        [name]: event.target.value
      },
      () => {
        name === 'gameDir' ? this.validateGameDir() : this.validateDataDir();
      }
    );
    settings.set(name, { path: event.target.value });
  };

  render() {
    const { gameDir, dataDir, gameDirError, dataDirError } = this.state;
    return (
      <div>
        <Typography variant="h5">Game Directories</Typography>
        <TextField
          id="outlined-full-width"
          label="Game Folder"
          style={{ margin: 8 }}
          onChange={this.handleChange('gameDir')}
          placeholder="Placeholder"
          fullWidth
          error={gameDirError ? true : false}
          helperText={gameDirError}
          margin="normal"
          value={gameDir}
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Select Directory"
                  onClick={this.selectDirectory('gameDir')}
                >
                  <FolderIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          id="outlined-full-width"
          label="Data Folder"
          style={{ margin: 8 }}
          placeholder="Placeholder"
          onChange={this.handleChange('dataDir')}
          value={dataDir}
          onKeyDown={() => false}
          error={dataDirError ? true : false}
          helperText={dataDirError}
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Select Directory"
                  onClick={this.selectDirectory('dataDir')}
                >
                  <FolderIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withSideNav
)(Settings);
