import React from 'react';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
//import Button from '@material-ui/core/Button';
import TableRow from '@material-ui/core/TableRow';
import Title from './Common/Title';
import Title2 from './Common/Title2';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton'
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Done from '@material-ui/icons/Done';
import moment from 'moment';
import {useEffect} from 'react';
//REDUX
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

export default function Offers() {
  const dispatch = useDispatch()

  const selectFilters = state => state.filters;
  const reduxFilters = useSelector(selectFilters);
  const selectUser = state => state.user;
  const reduxUser = useSelector(selectUser);
  //console.log(reduxFilters.cities);
  const selectFilteredOffers = state => state.offers.filter(o => {
    //if(reduxFilters.cities.length==0)
    //  return true;
    //else {
      return reduxFilters.cities.filter(c=>c.selected).map(c=>c.name).indexOf(o.city)!==-1
      && reduxFilters.sources.filter(s=>s.selected).map(s=>s.name).indexOf(o.source)!==-1
      && (reduxFilters.maxPrice?reduxFilters.maxPrice > o.price : true)
      //for(var i in reduxFilters.cities){
      //  if(reduxFilters.cities[i].selected && o.city === reduxFilters.cities[i].name)
      //    return o;
      //}
      //reduxFilters.cities.forEach(c=>{
        //console.log(c);
        //console.log(o.city);
      //  if(c.selected && o.city === c.name)
      //    return true;
      //})
    //}
  });
  const handleSortFieldChange = (field) => {
    dispatch({type:'filters/sortFieldChanged', payload:field})
  }
  const handleOfferClick = (o) => {
    //window.open(o.link  , "_blank", "noopener,noreferrer")
    dispatch({type:'user/offerClicked',payload:o})
    dispatch({type:'offer/offerSelected',payload:o})
    //location.hash = "#offer"
    //const element = document.getElementById("offers");

    //console.log(element)
    //element.scrollIntoView();
  }
  const reduxFilteredOffers = useSelector(selectFilteredOffers);

  //var cleanedNews = props.news;
  //if(filteredOffers[0])
  //  console.log(moment(filteredOffers[0].lastDisplayed))
  //var sortedOffers = filteredOffers.sort((a,b)=>(moment(b.lastDisplayed)-moment(a.lastDisplayed)))
  //console.log(reduxFilters)
  //console.log(reduxFilters.sortField)
  //console.log(reduxFilteredOffers[0][reduxFilters.sortField])
  var sortedOffers = []
  //console.log(reduxFilters.sortField)
  if(reduxFilters.sortField=="createdOn"){
    sortedOffers = reduxFilteredOffers.sort((a,b)=>(moment(a.createdOn)-moment(b.createdOn)));
  }else if(reduxFilters.sortField=="createdOn-") {
    sortedOffers = reduxFilteredOffers.sort((a,b)=>(moment(b.createdOn)-moment(a.createdOn)));
  }else {
    sortedOffers = reduxFilteredOffers.sort((a,b)=>(a[reduxFilters.sortField]-b[reduxFilters.sortField]))
  }

  const colorField = (f,v) => {
    //o.rate>=10000?
    if(f=="rate"){
      if(v>=8000)
        return {color:'red'}
    }
    if(f=="price"){
      if(v<=280000)
        return {color:'green'}
    }

  }
  //console.log(sortedOffers)
  //console.log(sortedNews)
  //console.log(reduxUser.seenOffers)
  //console.log(reduxUser)
  return (
    <React.Fragment>
      <Title id="offers">Offers</Title>

      {reduxFilters.cities.filter(c=>c.selected).map(c => (
        <React.Fragment key={c.name}>
          <Title2 id="offers">{c.name}</Title2>

        <Table size="small">
          <TableHead>
            <TableRow>

                <TableCell>Price
                <IconButton
                size="small"
                onClick={()=>handleSortFieldChange("price")}
                //style={reduxFilters.noKeywords.indexOf(k.word)!=-1?{}:{ display: 'none' }}
                >
                  <ExpandLessIcon fontSize="inherit"/>
                </IconButton>
                </TableCell>
                <TableCell>Surface
                <IconButton
                size="small"
                onClick={()=>handleSortFieldChange("surface")}
                //style={reduxFilters.noKeywords.indexOf(k.word)!=-1?{}:{ display: 'none' }}
                >
                  <ExpandLessIcon fontSize="inherit"/>
                </IconButton>
                </TableCell>
                <TableCell>Rate
                <IconButton
                size="small"
                onClick={()=>handleSortFieldChange("rate")}
                //style={reduxFilters.noKeywords.indexOf(k.word)!=-1?{}:{ display: 'none' }}
                >
                  <ExpandLessIcon fontSize="inherit"/>
                </IconButton>
                </TableCell>
              <Hidden xlDown>
                <TableCell>Est Rent</TableCell>
                <TableCell>Est ROI</TableCell>
              </Hidden>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedOffers.filter(o=>o.city==c.name).map(o => (
              <TableRow hover key={o.guid} onClick={()=>handleOfferClick(o)}>
                <TableCell style={colorField("price",o.price)}>{o.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}{o.currency}</TableCell>
                <TableCell style={o.estimate?{fontSize:'small',fontStyle:'italic'}:{}}>{Math.round(o.surface)}m²</TableCell>
                <TableCell style={colorField("rate",o.rate)}>{isNaN(o.rate)?"":parseInt(o.rate).toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}{o.currency}/m²</TableCell>
                <Hidden xlDown>
                  <TableCell>X{o.currency}/month</TableCell>
                  <TableCell>X * 12 / {o.price} *100</TableCell>
                </Hidden>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <br/>
        </React.Fragment>
      ))}




    </React.Fragment>
  );
}
