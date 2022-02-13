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
    dispatch({type:'user/offerClicked',payload:o})
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

  //console.log(sortedOffers)
  //console.log(sortedNews)
  //console.log(reduxUser.seenOffers)
  //console.log(reduxUser)
  return (
    <React.Fragment>
      <Title id="news">Offers</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <Hidden smDown>
              <TableCell>Created On
              <IconButton
              size="small"
              onClick={()=>handleSortFieldChange("createdOn")}
              //style={reduxFilters.noKeywords.indexOf(k.word)!=-1?{}:{ display: 'none' }}
              >
                <ExpandLessIcon fontSize="inherit"/>
              </IconButton>
              <IconButton
              size="small"
              onClick={()=>handleSortFieldChange("createdOn-")}
              //style={reduxFilters.noKeywords.indexOf(k.word)!=-1?{}:{ display: 'none' }}
              >
                <ExpandMoreIcon fontSize="inherit"/>
              </IconButton>
              </TableCell>
            </Hidden>
            <Hidden smUp>
              <TableCell>Id / City</TableCell>
            </Hidden>
            <Hidden smDown>
              <TableCell>Id</TableCell>
              <TableCell>City</TableCell>
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

            </Hidden>
            <Hidden smUp>
              <TableCell>Price / Surface</TableCell>
            </Hidden>
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
          {sortedOffers.map(o => (
            <TableRow key={o.guid}>
              <Hidden smDown>
                <TableCell>{moment(o.createdOn).format("DD/MM/YYYY")} ({moment().diff(moment(o.createdOn),'days')}d)</TableCell>
              </Hidden>
              <Hidden smUp>
                <TableCell>
                <Link href={o.link} target="_blank" rel="noopener noreferrer" onClick={()=>handleOfferClick(o)} color={reduxUser.seenOffers.map(o=>o._id).indexOf(o._id)==-1?"primary":"textPrimary"}>{o.guid} </Link>
                 <br/>
                 {o.city}
                 <Done style={reduxUser.seenOffers.map(o=>o._id).indexOf(o._id)!==-1?{}:{display: 'none'}} fontSize="small"/>
                 </TableCell>
              </Hidden>
              <Hidden smDown>
                <TableCell>
                  <Link href={o.link} target="_blank" rel="noopener noreferrer" onClick={()=>handleOfferClick(o)} color={reduxUser.seenOffers.map(o=>o._id).indexOf(o._id)==-1?"primary":"textPrimary"}>{o.guid} </Link>
                  <Done style={reduxUser.seenOffers.map(o=>o._id).indexOf(o._id)!==-1?{}:{display: 'none'}} fontSize="small"/>
                </TableCell>
                <TableCell>{o.city}<small style={{display:"none"}}>,{o.source==="domain"?o.location.split(",")[1]:o.location}</small> </TableCell>
              </Hidden>
              <Hidden smUp>
                <TableCell style={o.price<200000?{color:'green'}:{}}>{o.price}{o.currency} <br/> {o.surface}m²</TableCell>
              </Hidden>
              <Hidden smDown>
                <TableCell style={o.price<200000?{color:'green'}:{}}>{o.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}{o.currency}</TableCell>
                <TableCell style={o.estimate?{fontSize:'small',fontStyle:'italic'}:{}}>{o.surface}m²</TableCell>
              </Hidden>
              <TableCell>{isNaN(o.rate)?"":parseInt(o.rate).toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}{o.currency}/m²</TableCell>

              <Hidden xlDown>
              <TableCell>X{o.currency}/month</TableCell>
              <TableCell>X * 12 / {o.price} *100</TableCell>
              </Hidden>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
