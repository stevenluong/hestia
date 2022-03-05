import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../Common/Title';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';

export default function Simulations(props) {
  var simulations = props.simulations;
  //var sortedAssets = props.assets.sort((a,b)=>(new Date(b.datetime))-(new Date(a.datetime)))
  //console.log(props.insuranceChecked);
  return (
    <React.Fragment>
      <Title>Simulations</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Monthly Payment </TableCell>
            <TableCell>Total Cost </TableCell>
            <TableCell>Ratio </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {simulations.map(s => (
            <React.Fragment>
            <TableRow key={s.key}>
                <TableCell>
                  {s.amount}
                  {s.insuranceChecked && (<span><br/>Insurance </span>)}
                  {s.renegociateChecked && (<span><br/>Renegociate  {s.renegociateAmount.toFixed(2)}</span>)}</TableCell>
                <TableCell>
                  {s.rate}%
                  {s.insuranceChecked && (<span><br/>{s.insuranceRate}%</span>)}
                  {s.renegociateChecked && (<span><br/>{s.renegociateRate}%</span>)}
                </TableCell>
                <TableCell>
                  {s.duration}y
                  {s.renegociateChecked && (<span><br/> <br/> {s.renegociateDuration.toFixed(0)}y</span>)}</TableCell>

                <TableCell>
                  {s.monthlyPayment.toFixed(0)}
                  {s.insuranceChecked && (<span><br/>+{s.insuranceOnlyMonthlyPayment.toFixed(0)} = {(s.monthlyPayment+s.insuranceOnlyMonthlyPayment).toFixed(0)} </span>)}
                  {s.renegociateChecked && (<span><br/> {s.renegociateMonthlyPayment.toFixed(0) - s.monthlyPayment.toFixed(0)} = {s.renegociateMonthlyPayment.toFixed(0)}</span>)}
                </TableCell>
                <TableCell>
                  {s.totalCost.toFixed(0)}
                  {s.insuranceChecked && (<span><br/>+{s.insuranceOnlyTotalCost.toFixed(0)} = {(s.totalCost+s.insuranceOnlyTotalCost).toFixed(0)}</span>)}
                  {s.renegociateChecked && (<span><br/> {s.renegociateTotalCost.toFixed(0) - s.totalCost.toFixed(0)} = {s.renegociateTotalCost.toFixed(0)}</span>)}
                </TableCell>
                <TableCell>
                  {s.ratio.toFixed(0)}%
                  {s.insuranceChecked && (<span><br/>+{s.withInsuranceRatio.toFixed(0)-s.ratio.toFixed(0)}% = {s.withInsuranceRatio.toFixed(0)}%</span>)}
                  {s.renegociateChecked && (<span><br/> {s.renegociateRatio.toFixed(0)-s.ratio.toFixed(0)} = {s.renegociateRatio.toFixed(0)}%</span>)}
                </TableCell>
            </TableRow>
            </React.Fragment>
          ))}

        </TableBody>
      </Table>
      <Button
      variant="outlined"
      color="primary"
      endIcon={<ClearIcon/>}
      onClick = {()=> props.clearSimulations()}
    >
      Clear
    </Button>
    </React.Fragment>
  );
}
