import React from 'react';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
//import Button from '@material-ui/core/Button';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton'
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Done from '@material-ui/icons/Done';
import moment from 'moment';
import Button from '@material-ui/core/Button';
//REDUX
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

export default function Offer() {
  const dispatch = useDispatch()

  /*
  const selectFilters = state => state.filters;
  const reduxFilters = useSelector(selectFilters);
  const selectUser = state => state.user;
  const reduxUser = useSelector(selectUser);
  */
  //console.log(reduxFilters.cities);
  const selectedOffer = state => state.offer;
  const reduxOffer = useSelector(selectedOffer);

  const handleVisitClick = (link) => {
    window.open(link  , "_blank", "noopener,noreferrer")
  }
  //var cleanedNews = props.news;
  //if(filteredOffers[0])
  //  console.log(moment(filteredOffers[0].lastDisplayed))
  //var sortedOffers = filteredOffers.sort((a,b)=>(moment(b.lastDisplayed)-moment(a.lastDisplayed)))
  //console.log(reduxFilters)
  //console.log(reduxFilters.sortField)
  //console.log(reduxFilteredOffers[0][reduxFilters.sortField])

  //console.log(sortedOffers)
  //console.log(sortedNews)
  //console.log(reduxUser.seenOffers)
  //console.log(reduxUser)
  if(reduxOffer._id){
    return (
      <React.Fragment>
        <Title id="offer">Offer</Title>
        Source : {reduxOffer.source}<br/>
        Exists since : {moment(reduxOffer.createdOn).format("DD/MM/YYYY")}<br/>
        <br/>
        City : {reduxOffer.city}<br/>
        Location : {reduxOffer.location}<br/>
        <br/>
        Price : {reduxOffer.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")} {reduxOffer.currency}<br/>
        Surface : {reduxOffer.surface.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")} m²<br/>
        Rate : {Math.round(reduxOffer.rate).toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")} {reduxOffer.currency}/m²<br/>
        <br/>
        <Button color="primary" variant="outlined" href="#" onClick={()=>handleVisitClick(reduxOffer.link)}>
          Visit
        </Button>
      </React.Fragment>
  );
  }else{
    return (
      <React.Fragment>
        <Title id="offer">Offer</Title>
        No Offer Selected
      </React.Fragment>
  );
  }
}
