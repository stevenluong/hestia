import React from 'react';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Button from '@material-ui/core/Button';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Hidden from '@material-ui/core/Hidden';
import moment from 'moment';

export default function Offers({offers, filteredOffers}) {
  //var cleanedNews = props.news;
  if(filteredOffers[0])
    console.log(moment(filteredOffers[0].lastDisplayed))
  //var sortedOffers = filteredOffers.sort((a,b)=>(moment(b.lastDisplayed)-moment(a.lastDisplayed)))
  var sortedOffers = filteredOffers.sort((a,b)=>(a.rate-b.rate))
  //console.log(sortedNews)
  return (
    <React.Fragment>
      <Title id="news">Offers</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Id</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Surface</TableCell>
            <TableCell>Rate</TableCell>
            <Hidden xlDown>
            <TableCell>Est Rent</TableCell>
            <TableCell>Est ROI</TableCell>
            </Hidden>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedOffers.map(o => (
            <TableRow key={o.guid}>
              <TableCell>{moment(o.lastDisplayed).format("DD/MM/YYYY")}</TableCell>
              <TableCell><Link href={o.link}>{o.guid} </Link></TableCell>
              <TableCell>{o.city},<small>{o.source=="domain"?o.location.split(",")[1]:o.location}</small> </TableCell>
              <TableCell style={o.price<200000?{color:'green'}:{}}>{o.price}{o.currency}</TableCell>
              <TableCell style={o.estimate?{fontSize:'small',fontStyle:'italic'}:{}}>{o.surface}m²</TableCell>
              <TableCell>{isNaN(o.rate)?"":parseInt(o.rate)}{o.currency}/m²</TableCell>
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
