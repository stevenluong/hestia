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

export default function Offers({offers}) {
  //var cleanedNews = props.news;
  var sortedOffers = offers.sort((a,b)=>(new Date(a.rate))-(new Date(b.rate)))
  //console.log(sortedNews)
  return (
    <React.Fragment>
      <Title id="news">Offers</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
          <Hidden smDown>
            <TableCell>Image</TableCell>
          </Hidden>
            <TableCell>Id</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedOffers.map(o => (
            <TableRow key={o.guid}>
            <Hidden smDown>
              <TableCell><img src={o.image} height="40" width="40" alt=""/></TableCell>
            </Hidden>
              <TableCell><Link href={o.link}>{o.guid} </Link>  <br/> <small>{o.lastDisplayed}</small></TableCell>
              <TableCell>{o.city}</TableCell>
              <TableCell>{o.price}{o.currency} <br/> {o.surface}m²</TableCell>
              <TableCell>{parseInt(o.rate)}{o.currency}/m²</TableCell>
              <TableCell>{o.location}</TableCell>
              <TableCell><Link href={o.link}>{o.description.substring(0,30)} </Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
