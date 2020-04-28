import React from 'react';
import Title from './Title';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

export default function Filters({assets, filters, setFilters, setFiltered}) {
  var filters = [];
  const handleReset = () => {
    //var f = filters;
    //console.log(k);
    //var f = Object.assign(filters, {keywords:[...filters.keywords,k]})
    var f = {};//Object.assign(filters, {keywords:[],noKeywords:[]})
    setFilters(f);
    setFiltered(false);
  }
  return (
    <React.Fragment>
      <Title>Filters</Title>
      <p>
      {filters.map((k,i) => (
        <React.Fragment>
        </React.Fragment>
      ))}
      </p>
      <Button color="primary" variant="outlined" href="#" onClick={handleReset}>
        Reset
      </Button>

    </React.Fragment>
  );
}
