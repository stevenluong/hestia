import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Title from '../Common/Title';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function Inputs(props) {
  const [simulation, setSimulation] = React.useState(props.simulations[0])
  const [insuranceChecked, setInsuranceChecked] = React.useState(props.insuranceChecked)
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
  const handleInsuranceChange = (e) => {
    setSimulation({...simulation, insuranceRate:e.target.value});
  };
  const handleStartDateChange = (e) => {
    setSimulation({...simulation, startDate:e.target.value});
  };
  const handleNewRateChange = (e) => {
    console.log("new Rate")
    setSimulation({...simulation, renegociateRate:e.target.value});
  };
  const handleRenegociateChange = (e) => {
    //props.toggleRenegociate(!renegociateChecked);
    //console.log(e.target.checked)
    setRenegociateChecked(e.target.checked);
    //props.toggleRenegociate(renegociateChecked);
    //console.log("reneg")
    //console.log(renegociateChecked)
    setSimulation({...simulation, renegociate:e.target.checked});
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
            onChange={()=>{props.toggleInsurance(!insuranceChecked);setInsuranceChecked(!insuranceChecked)}}
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
              onChange={handleRenegociateChange}
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
