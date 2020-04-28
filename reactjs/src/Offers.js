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
  //var sortedAssets = []; //filteredNews.sort((a,b)=>(new Date(b.datetime))-(new Date(a.datetime)))
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
            <TableCell>Source</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Surface</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {offers.map(o => (
            <TableRow key={o.guid}>
            <Hidden smDown>
              <TableCell><img src={o.imageLink} height="40" width="40" alt=""/></TableCell>
            </Hidden>
              <TableCell><Link href={o.link}>{o.guid} </Link></TableCell>
              <TableCell>{o.source} <br/> <small>{o.datetime}</small></TableCell>
              <TableCell>{o.price}</TableCell>
              <TableCell>{o.surface}</TableCell>
              <TableCell><Link href={o.link}>{o.description} </Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
