import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Filters from '../Filters';
import Stats from '../Stats';
import Day from '../Day';
import Offers from '../Offers';
import Offer from '../Offer';

const useStyles = makeStyles(theme => ({

  title: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    //display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  }
}));

export default function Dashboard() {
  const classes = useStyles();
  const paper = clsx(classes.paper);

  return (
    <React.Fragment>
    <Grid container direction="row" spacing={2}>
    <Grid item xs={12} md={6} lg={4}>
      <Paper className={paper}>
        <Day />
      </Paper>
      <br/>
      <Paper className={paper}>
        <Filters/>
      </Paper>
      <br/>
      <Paper className={paper}>
        <Stats/>
      </Paper>
    </Grid>
    <Grid item xs={12} md={6} lg={4}>
      <Paper className={classes.paper}>
        <Offers/>
      </Paper>
    </Grid>
    <Grid item xs={12} md={6} lg={4}>
      <Paper className={classes.paper}>
        <Offer/>
      </Paper>
    </Grid>
    </Grid>
    </React.Fragment>
  );
}
