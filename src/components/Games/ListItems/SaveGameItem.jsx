import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { compose } from 'react-apollo';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CategoryIcon from '@material-ui/icons/Category';
import { connect } from 'react-redux';
import MapDE from '../../../assets/images/mapDE_preview.png';
import MapUS from '../../../assets/images/mapUS_preview.png';
import MissingMap from '../../../assets/images/missingMap.png';

const styles = theme => ({
  img: {
    height: '200px',
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
    maxWidth: 400
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

class SaveGameItem extends React.Component {
  getMapImage = map => {
    if (map === 'MapDE') {
      return MapDE;
    }

    if (map === 'MapUS') {
      return MapUS;
    }

    const mods = this.props.mods;
    for (const mod of mods) {
      if (mod.directoryName === map) {
        return mod.imgData;
      }
    }

    return MissingMap;
  };

  render() {
    const { classes, saveGame } = this.props;
    const { map } = saveGame;

    return (
      <li className={classes.listItem} key={1}>
        <Card className={classes.card}>
          <CardActionArea>
            <img className={classes.img} src={this.getMapImage(map)} alt="" />
            <CardContent>
              <Typography
                noWrap={true}
                gutterBottom
                align="center"
                variant="subheading"
                className={classes.cardTitle}
                component="h2"
              >
                {/* {mod.title} */}
              </Typography>
              <div className={classes.chipContainer}>
                <Typography variant="title">
                  Savegame {saveGame.saveGameIndex}
                </Typography>
                <Typography variant="title">
                  Name: {saveGame.savegameName}
                </Typography>
                <Typography variant="title">
                  Map: {saveGame.mapTitle}
                </Typography>
                <Typography variant="title">Money: {saveGame.money}</Typography>
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
}

const mapStateToProps = state => ({
  saveGames: state.store.saveGames,
  mods: state.store.mods
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(SaveGameItem);
