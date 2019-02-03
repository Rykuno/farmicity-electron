import React from 'react';
import withSideNav from '../../../HOC/SideNav';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import { getMods } from '../../../Utility/parsers/mods/modParser';
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

const GameplayItem = ({ mod, classes }) => (
  <li className={classes.listItem} key={mod.name}>
    <Card className={classes.card}>
      <CardActionArea>
        <img className={classes.img} src={mod.imgData} alt="" />
        <CardContent>
          <Typography
            noWrap={true}
            gutterBottom
            align="center"
            variant="subheading"
            className={classes.cardTitle}
            component="h2"
          >
            {mod.title}
          </Typography>
          <div className={classes.chipContainer}>
            <Chip
              label={mod.type}
              className={classes.chip}
              avatar={
                <Avatar>
                  <CategoryIcon />
                </Avatar>
              }
            />
            <Chip
              avatar={<Avatar> $ </Avatar>}
              label={0}
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

export default withStyles(styles)(GameplayItem);
