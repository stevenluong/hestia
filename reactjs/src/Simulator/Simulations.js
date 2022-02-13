import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../Common/Title';

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
            {props.insuranceChecked && (<TableCell>Insurance Rate</TableCell>)}
            <TableCell>Monthly Payment {props.insuranceChecked && (<span>(Insurrance)</span>)}</TableCell>
            <TableCell>Total Cost {props.insuranceChecked && (<span>(Insurrance)</span>)}</TableCell>
            <TableCell>Ratio {props.insuranceChecked && (<span>(Insurrance)</span>)}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {simulations.map(s => (
            <React.Fragment>
            <TableRow key={s.key}>
                <TableCell>{s.amount} {s.renegociate && (<span><br/>Remaining <br/> {s.renegociateAmount.toFixed(2)}</span>)}</TableCell>
                <TableCell>{s.rate}% {s.renegociate && (<span><br/>New <br/> {s.renegociateRate}%</span>)}</TableCell>
                <TableCell>{s.duration} y {s.renegociate && (<span><br/>Remaining <br/> {s.renegociateDuration.toFixed(2)} y</span>)}</TableCell>
                {props.insuranceChecked && (<TableCell>{s.insuranceRate}%</TableCell>)}
                <TableCell>{s.monthlyPayment.toFixed(0)}
                {props.insuranceChecked && (<span><br/>(+ {s.insurranceOnlyMonthlyPayment.toFixed(0)} = {(s.monthlyPayment+s.insurranceOnlyMonthlyPayment).toFixed(0)}) </span>)}
                {s.renegociate && (<span><br/>Renegociated <br/> {s.renegociateMonthlyPayment.toFixed(0) - s.monthlyPayment.toFixed(0)} = {s.renegociateMonthlyPayment.toFixed(0)}</span>)}
                </TableCell>
                <TableCell>
                {s.totalCost.toFixed(0)}
                {props.insuranceChecked && (<span><br/>(+ {s.insurranceOnlyTotalCost.toFixed(0)} = {(s.totalCost+s.insurranceOnlyTotalCost).toFixed(0)})</span>)}
                {s.renegociate && (<span><br/>Renegociated <br/> {s.renegociateTotalCost.toFixed(0) - s.totalCost.toFixed(0)} = {s.renegociateTotalCost.toFixed(0)}</span>)}
                </TableCell>
                <TableCell>
                {s.ratio.toFixed(0)}%
                {props.insuranceChecked && (<span><br/>({s.withInsurranceRatio.toFixed(0)}%)</span>)}
                {s.renegociate && (<span><br/>Renegociated <br/> {s.renegociateRatio.toFixed(0)-s.ratio.toFixed(0)} = {s.renegociateRatio.toFixed(0)}%</span>)}
                </TableCell>
            </TableRow>
            </React.Fragment>
          ))}

        </TableBody>
      </Table>
    </React.Fragment>
  );
}
