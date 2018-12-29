import React from 'react';
import withSideNav from '../../HOC/SideNav';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import { getMods } from '../../Utility/mods';
import { Typography } from '@material-ui/core';
import { Chip, Avatar } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import CategoryIcon from '@material-ui/icons/Category';

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
    maxWidth: 345
  },
  media: {
    height: 50,
    objectFit: 'cover'
  },
  listItem: {
    margin: '8px'
  },
  chip: {
    margin: theme.spacing.unit
  },
  chipContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'left'
  },
  cardTitle: {
    width: '100%',
  }
});

class Mods extends React.Component {
  state = {
    mods: []
  };
  componentDidMount = () => {
    getMods().then(mods => {
      this.setState({
        mods
      });
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
      const { imgData, brand, category, name, price } = mod;
      const modFullName = `${brand} ${name}`;
      console.log('Type: ', category);

      return (
        <li className={classes.listItem}>
          <Card className={classes.card}>
            <CardActionArea>
              <img className={classes.img} src={imgData} alt="" />
              <CardContent>
                <Typography
                  noWrap={true}
                  gutterBottom
                  variant="h5"
                  className={classes.cardTitle}
                  component="h2"
                >
                  {brand} {name}
                </Typography>
                <div className={classes.chipContainer}>
                  <Chip label={category} className={classes.chip} avatar={<Avatar><CategoryIcon/></Avatar>}/>
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

  render() {
    const { classes } = this.props;
    return (
      <div>
        <ol className={classes.modList}> {this.renderMods()}</ol>
      </div>
    );
  }
}

export default compose(
  withSideNav,
  withStyles(styles),
  withRouter
)(Mods);
