import React from 'react';
import Title from './Title';
import Link from '@material-ui/core/Link';
//import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
//import IconButton from '@material-ui/core/IconButton';
//import AddIcon from '@material-ui/icons/Add';
//import RemoveIcon from '@material-ui/icons/Remove';
import Checkbox from '@material-ui/core/Checkbox';
//REDUX
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

export default function Filters() {
  const dispatch = useDispatch()
  const selectFilters = state => state.filters;
  const reduxFilters = useSelector(selectFilters);
  //var filters = [];
  //const [citiesFilter, setCitiesFilter] = React.useState(filters.cities);
  //setCitiesFilter(filters.cities);
  //console.log(filters.cities);
  //console.log(citiesFilter);
  const handleReset = () => {
    dispatch({type:'filters/filtersReset'})
  }
  const handleCityToggledChange = (e,c) => {
    dispatch({type:'filters/cityToggled',payload:c.name})
  }
  const handleCityChosenChange = (e,c) => {
    dispatch({type:'filters/cityChosen',payload:c.name})
  }
  const handleSourceToggledChange = (e,s) => {
    dispatch({type:'filters/sourceToggled',payload:s.name})
  }
  const handleSourceChosenChange = (e,s) => {
    dispatch({type:'filters/sourceChosen',payload:s.name})
  }
  return (
    <React.Fragment>
      <Title>Filters</Title>
      Cities: <br/>
      <div>
      {reduxFilters.cities.map((c,i) =>

        (
        <React.Fragment key={i}>
        <Checkbox
        checked={c.selected}
        style={{height:25, width:25}}
        color="primary"
        size="small"
        onChange={(e)=> handleCityToggledChange(e,c)}
      />
        <Link onClick={(e)=>handleCityChosenChange(e,c)}>{c.name}</Link> ({c.count})
        <br/>
        </React.Fragment>
      ))}
      </div>
      Sources: <br/>
      <div>
      {reduxFilters.sources.map((s,i) =>

        (
        <React.Fragment key={i}>
        <Checkbox
        checked={s.selected}
        style={{height:25, width:25}}
        color="primary"
        size="small"
        onChange={(e)=> handleSourceToggledChange(e,s)}
      />
        <Link onClick={(e)=>handleSourceChosenChange(e,s)}>{s.name}</Link> ({s.count})
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
