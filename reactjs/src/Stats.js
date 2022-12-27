import React from 'react';
import Title from './Common/Title';
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

export default function Stats() {
  const dispatch = useDispatch()
  const selectStats = state => state.stats;
  const reduxStats = useSelector(selectStats);
  //console.log(reduxStats.cities)
  return (
    <React.Fragment>
      <Title>Stats</Title>
      Cities: <br/>
      <div>
      {reduxStats.cities.sort((a,b)=> a.avg-b.avg).map((c,i) =>
        (
        <React.Fragment key={i}>
          {c.name} <br/> ~{c.avg}€/m2
          <br/>
        </React.Fragment>
        )
      )}
      </div>

    </React.Fragment>
  );
}
