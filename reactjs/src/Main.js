import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useOktaAuth } from '@okta/okta-react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import logo from './Common/logo.png';
//REDUX
//import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import Profile from './User/Profile';
import Dashboard from './Dashboard';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
//import ListSubheader from '@material-ui/core/ListSubheader';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
//import TripOriginIcon from '@material-ui/icons/TripOrigin';
import LayersIcon from '@material-ui/icons/Layers';
//import BookmarkIcon from '@material-ui/icons/Bookmark';
import LocationOnIcon from '@material-ui/icons/LocationOn';

//import moment from 'moment';
import usersHelpers from './User/helpers';

var config = {
  //server : "http://localhost:8529", // local
  server : "https://athena.slapps.fr",
  //dbUrl : "/_db/_system/hephaistos" // local
  dbUrl : "/_db/production/hestia",
  usersUrl : "/_db/production/athena"
}

function getOffers(cbOffers, cbCities){
  var q = config.server+config.dbUrl+"/offers"
  //console.log(q)
  fetch(q)
      .then(result=>result.json())
      .then(offers=>{
          var cities = []
          //console.log(offers);
          var filteredOffers = [];
          offers.forEach((o, i) => {
            if(cities.indexOf(o.city)===-1)
              cities.push(o.city);
            //o.lastDisplayed = moment(o.lastDisplayed).format("DD/MM/YYYY");
            if((!o.price||isNaN(o.price))&&(!o.surface||isNaN(o.surface)))
              return
            if(!o.price||isNaN(o.price))
              //o.price = 0;
              return;
            if(!o.surface||isNaN(o.surface))
              //o.rate = NaN;
              return;
            else {
              o.rate = o.price/o.surface;
            }
            //console.log(o)
            //if(o.price !== "TBD" && o.surface !== "TBD")
            filteredOffers.push(o)
          });
          //console.log(filteredOffers);
          cbOffers(filteredOffers);
          cbCities(cities);
      });
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://steven-luong.com/">
        Steven Luong
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fixedHeight: {
    height: 150,
  },
}));

export default function Main({page}) {
  const { authState, authService } = useOktaAuth();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  //const [userRequested, setUserRequested] = React.useState(false);
  //const [user, setUser] = React.useState({_key:0});
  //const [offers, setOffers] = React.useState([])
  //const [cities, setCities] = React.useState([])
  //const [filtered, setFiltered] = React.useState(true)
  //const [filteredOffers, setFilteredOffers] = React.useState([])
  //const [filters, setFilters] = React.useState({
  //  //price: 1000000,
  //  //surface: 1000,
  //  cities:[]
  //})
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  //REDUX
  const dispatch = useDispatch()
  //const selectUser = state => state.user;
  //const reduxUser = useSelector(selectUser);
  //const selectOffers = state => state.offers;
  //const reduxOffers = useSelector(selectOffers);
  //const selectFilters = state => state.filters;
  //const reduxFilters = useSelector(selectFilters);


  //console.log(reduxOffers);
  //const handleSet = (f) => {
  //  console.log("TEST")
  //  setFilters(f);
  //  console.log(f);
  //};
  //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  //console.log(authState.isAuthenticated);
  if (authState.isPending) {
    return (
    <div className="App">
      <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <p>Loading ...</p>
    </header>
  </div>)
  }
  if(!authState.isAuthenticated)
    return(
      <Redirect to={{ pathname: '/login' }}/>
    )
    //if(!userRequested){
    //  setUserRequested(true);
      authService.getUser().then((info) => {
        //setUserInfo(info);
        //console.log(info);
        usersHelpers.getUser(info, (u)=>{
          //console.log(u)
          //setUser(u)
          dispatch({type:'user/retrieved',payload:u})
          getOffers((o)=>{
            //setOffers(o);
            //setFilteredOffers(o);
            dispatch({ type: 'offers/offersRetrieved', payload: o })
          }, (c)=>{
            //console.log(c);
            //setCities(c);
            var cities = []
            c.forEach((city, i) => {
              cities.push({name:city, selected:true})
            });
            //console.log(cities);
            //setFilters(Object.assign(filters,{cities:cities}))
            dispatch({type:'filters/citiesAdded',payload:cities})
          });
        });
        //setUser(info)
      });
    //}


  //console.log(filteredNews);
  //if(!filtered){
  //  setFiltered(true);
  //  console.log(filters);
  //  var t = [];
  //  reduxOffers.forEach(o=>{
  //    filters.cities.forEach(c=>{
  //      if(c.selected && o.city === c.name)
  //        t.push(o);
  //    })
  //  })
    //setFilteredOffers(t);
    //console.log(cities);
  //}

  //console.log(url)
  var content = null;
  if(page==="profile")
    content = <Profile/>
  if(page==="dashboard")
    content = <Dashboard/>

  //console.log(fetch);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Hestia - Real Estate Market Analysis
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
        <div>
            <ListItem button component={RouterLink} to="/">
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={RouterLink} to="/aroundme">
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText primary="Around Me" />
          </ListItem>
        </div>
        </List>
        <Divider />
        <List>
        <div>
          <ListItem button component={RouterLink} to="/profile">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </div>
        </List>
        <Divider />
        <List>
        <div>
          <ListItem button onClick={() => {authService.logout()}}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Log out" />
          </ListItem>
        </div>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {content}
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
