import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { compose } from 'react-apollo';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
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
    maxWidth: 400,
    backgroundColor: 'rgb(50,50,50, 0.6)'
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
    color: 'white',
    fontWeight: 'bold'
  },
  cardKey: {
    width: '100%',
    color: 'white',
    fontWeight: 'bold'
  },
  cardValue: {
    width: '100%',
    color: 'white',
    textAlign: 'right',
    whiteSpace: 'noWrap'
  },
  saveGameInfoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  divider: {
    backgroundColor: 'white',
    marginTop: 5,
    marginBottom: 5
  },
  button: {
    color: 'white'
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
        return mod.mapPreviewData;
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
                align="left"
                variant="headline"
                className={classes.cardTitle}
                component="h1"
              >
                Savegame {saveGame.saveGameIndex}
              </Typography>
              <div className={classes.chipContainer}>
                <Divider className={classes.divider} />
                <div className={classes.saveGameInfoContainer}>
                  <Typography variant="title" className={classes.cardKey}>
                    Name:
                  </Typography>
                  <Typography variant="title" className={classes.cardValue}>
                    {saveGame.savegameName}
                  </Typography>
                </div>
                <Divider className={classes.divider} />
                <div className={classes.saveGameInfoContainer}>
                  <Typography variant="title" className={classes.cardKey}>
                    Map:
                  </Typography>
                  <Typography variant="title" className={classes.cardValue}>
                    {saveGame.mapTitle}
                  </Typography>
                </div>
                <Divider className={classes.divider} />
                <div className={classes.saveGameInfoContainer}>
                  <Typography variant="title" className={classes.cardKey}>
                    Money:
                  </Typography>
                  <Typography variant="title" className={classes.cardValue}>
                    {saveGame.money} $
                  </Typography>
                </div>
                <Divider className={classes.divider} />
              </div>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="medium" className={classes.button}>
              Details
            </Button>
            <Button size="medium" className={classes.button}>
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
