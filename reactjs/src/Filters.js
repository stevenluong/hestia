import React from 'react';
import Title from './Title';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Checkbox from '@material-ui/core/Checkbox';

export default function Filters({filters, setFilters, setFiltered}) {
  //var filters = [];
  //const [citiesFilter, setCitiesFilter] = React.useState(filters.cities);
  //setCitiesFilter(filters.cities);
  //console.log(filters.cities);
  //console.log(citiesFilter);
  const handleReset = () => {
    //var f = filters;
    //console.log(k);
    //var f = Object.assign(filters, {keywords:[...filters.keywords,k]})
    var f = {};//Object.assign(filters, {keywords:[],noKeywords:[]})
    setFilters(f);
    setFiltered(false);
  }
  const handleCitiesFilterChange = (e,c) => {
    console.log(c);

    //var f = filters;
    //console.log(k);
    var cities = filters.cities;
    cities.forEach(city => {
      if(city.name === c.name)
        city.selected = e.target.checked;
    })
    var f = {};
    //{cities:cities}//= Object.assign(filters, {cities:cities})
    //setCitiesFilter(cities);
    console.log(f);
    //var f = {};//Object.assign(filters, {keywords:[],noKeywords:[]})
    setFilters(Object.assign(f, {cities:cities}));
    setFiltered(false);
  }
  return (
    <React.Fragment>
      <Title>Filters</Title>
      Cities: <br/>
      <div>
      {filters.cities.map((c,i) => (
        <React.Fragment key={i}>
        <Checkbox
        checked={c.selected}
        color="primary"
        size="small"
        onChange={(e)=> handleCitiesFilterChange(e,c)}
      />
        {c.name}
        <br/>
        </React.Fragment>
      ))}
      </div>
      <Button color="primary" variant="outlined" href="#" onClick={handleReset}>
        Reset
      </Button>

    </React.Fragment>
  );
}
