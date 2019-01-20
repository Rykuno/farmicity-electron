import React from 'react';
import withSideNav from '../../HOC/SideNav';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import { getMods } from '../../Utility/parsers/modParser';
import { Typography } from '@material-ui/core';
import { Chip, Avatar, Paper, Toolbar, AppBar } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CategoryIcon from '@material-ui/icons/Category';
const settings = window.require('electron-settings');

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
  }
});

class Mods extends React.Component {
  state = {
    mods: []
  };
  componentDidMount = () => {
    this.validateDirectories();
    getMods()
      .then(mods => {
        this.setState({
          mods
        });
      })
      .catch(e => {
        console.log(e);
      });
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

  renderStoreItemMods = () => {
    const { classes } = this.props;
    const { mods } = this.state;
    if (mods.length < 1) {
      return;
    }
    console.log('Mods: ', mods);
    return mods.map(mod => {
      console.log('MAPPED MOD: ', mod);
      const { imgData, brand, category, name, price, type } = mod;
      console.log(type);
      if (type === 'storeItem') {
        return (
          <li className={classes.listItem}>
            <Card className={classes.card}>
              <CardActionArea>
                <img className={classes.img} src={imgData} alt="" />
                <CardContent>
                  <Typography
                    noWrap={true}
                    gutterBottom
                    align="center"
                    variant="p"
                    className={classes.cardTitle}
                    component="h2"
                  >
                    {brand} {name}
                  </Typography>
                  <div className={classes.chipContainer}>
                    <Chip
                      label={category}
                      className={classes.chip}
                      avatar={
                        <Avatar>
                          <CategoryIcon />
                        </Avatar>
                      }
                    />
                    <Chip
                      avatar={<Avatar>$</Avatar>}
                      label={price}
                      color="primary"
                      className={classes.chip}
                    />
                  </div>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  Details
                </Button>
                <Button size="small" color="primary">
                  Open
                </Button>
              </CardActions>
            </Card>
          </li>
        );
      }
    });
  };

  renderMods = () => {
    const { classes } = this.props;
    const { mods } = this.state;
    if (mods.length < 1) {
      return;
    }
    console.log('Mods: ', mods);
    return mods.map(mod => {
      console.log('MAPPED MOD: ', mod);
      const { imgData, brand, category, name, price, type } = mod;
      console.log(type);
      return (
        <li className={classes.listItem}>
          <Card className={classes.card}>
            <CardActionArea>
              <img className={classes.img} src={imgData} alt="" />
              <CardContent>
                <Typography
                  noWrap={true}
                  gutterBottom
                  align="center"
                  variant="p"
                  className={classes.cardTitle}
                  component="h2"
                >
                  {brand} {name}
                </Typography>
                <div className={classes.chipContainer}>
                  <Chip
                    label={category}
                    className={classes.chip}
                    avatar={
                      <Avatar>
                        <CategoryIcon />
                      </Avatar>
                    }
                  />
                  <Chip
                    avatar={<Avatar>$</Avatar>}
                    label={price}
                    color="primary"
                    className={classes.chip}
                  />
                </div>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                Details
              </Button>
              <Button size="small" color="primary">
                Open
              </Button>
            </CardActions>
          </Card>
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

  renderContent = () => {
    const { classes } = this.props;
    const { hasRequiredDirs } = this.state;
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
    return this.renderContent();
  }
}

export default compose(
  withSideNav,
  withStyles(styles),
  withRouter
)(Mods);
