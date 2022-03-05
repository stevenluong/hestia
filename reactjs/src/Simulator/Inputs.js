import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Title from '../Common/Title';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function Inputs(props) {
  var s = {
    //guid : 0,
    amount : 280000, //279712.21
    rate: 1.75,
    duration: 25,
    insuranceChecked: true,
    insuranceRate: 0.36,
    startDate : "05/02/2018"
  }
  const [simulation, setSimulation] = React.useState(s)
  const [insuranceChecked, setInsuranceChecked] = React.useState(s.insuranceChecked)
  //const [renegociateChecked, setRenegociateChecked] = React.useState(props.renegociateChecked)
  const [renegociateChecked, setRenegociateChecked] = React.useState(false)
  const handleAmountChange = (e) => {
    setSimulation({...simulation, amount:e.target.value});
  };
  const handleRateChange = (e) => {
    setSimulation({...simulation, rate:e.target.value});
  };
  const handleDurationChange = (e) => {
    setSimulation({...simulation, duration:e.target.value});
  };
  const handleInsuranceToggle = (e) => {
    setInsuranceChecked(e.target.checked);
    setSimulation({...simulation, insuranceChecked:e.target.checked});
  };
  const handleInsuranceChange = (e) => {
    setSimulation({...simulation, insuranceRate:e.target.value});
  };
  const handleStartDateChange = (e) => {
    setSimulation({...simulation, startDate:e.target.value});
  };
  const handleNewRateChange = (e) => {
    //console.log("new Rate")
    setSimulation({...simulation, renegociateRate:e.target.value});
  };
  const handleRenegociateToggle = (e) => {
    setRenegociateChecked(e.target.checked);
    setSimulation({...simulation, renegociateChecked:e.target.checked});
  };
  return (
    <React.Fragment>
      <Title>Inputs</Title>
      <br/>
      <TextField
          id="amount"
          label="Amount"
          variant="outlined"
          onChange={handleAmountChange}
          value={simulation.amount}
        />
      <br/>
      <TextField
          id="duration"
          label="Duration - Years"
          variant="outlined"
          onChange={handleDurationChange}
          value={simulation.duration}
        />
      <br/>
      <TextField
          id="rate"
          label="Rate - %"
          variant="outlined"
          onChange={handleRateChange}
          value={simulation.rate}
        />

      <br/>
      <FormControlLabel
        control={
          <Checkbox
            checked={insuranceChecked}
            onChange={(e)=>{handleInsuranceToggle(e)}}
            name="insuranceCheckbox"
            color="primary"
          />
        }
        label="Insurance"
      />
      {insuranceChecked&&(
      <React.Fragment>
      <br/>
      <TextField
          id="insuranceRate"
          label="Insurance Rate - %"
          variant="outlined"
          onChange={handleInsuranceChange}
          value={simulation.insuranceRate}
        />
        </React.Fragment>
      )}
        <br/>
        <FormControlLabel
          control={
            <Checkbox
              checked={renegociateChecked}
              onChange={handleRenegociateToggle}
              name="renegociateCheckbox"
              color="primary"
            />
          }
          label="Renegociate"
        />
        {renegociateChecked&&(
        <React.Fragment>
        <br/>
        <TextField
            id="startDate"
            label="Start Date - DD/MM/YYYY"
            variant="outlined"
            onChange={handleStartDateChange}
            value={simulation.startDate}
          />
        <br/>
        <TextField
            id="newRate"
            label="New Rate - %"
            variant="outlined"
            onChange={handleNewRateChange}
          />
        </React.Fragment>
        )}
      <br/>
        <Button
        variant="contained"
        color="primary"
        endIcon={<CloudUploadIcon/>}
        onClick = {()=> props.addSimulation(simulation)}
      >
        Simulate
      </Button>
    </React.Fragment>
  );
}
