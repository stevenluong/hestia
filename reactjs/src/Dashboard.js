import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Filters from './Filters';
import Day from './Day';
import Offers from './Offers';


const useStyles = makeStyles(theme => ({

  title: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 150,
  },
}));

export default function Dashboard({offers, filteredOffers, filters, setFilters, setFiltered}) {
  const classes = useStyles();
  const paper = clsx(classes.paper);

  return (
    <React.Fragment>
    <Grid container direction="row" spacing={3}>
    <Grid item xs={12} md={9} lg={9}>
      <Paper className={paper}>
        <Filters filters={filters} setFilters={setFilters} setFiltered={setFiltered}/>
      </Paper>
    </Grid>
    <Grid item xs={12} md={3} lg={3}>
      <Paper className={paper}>
        <Day />
      </Paper>
    </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Paper className={classes.paper}>
          <Offers offers={offers} filteredOffers={filteredOffers}/>
        </Paper>
      </Grid>

    </Grid>
    </React.Fragment>
  );
}
