import React, { Component } from 'react';
import { Button,Grid, Row, Col,Table, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import Post from './Post.js';
class List extends Component {
    render(){
        return (
                <Table responsive striped hover>
                <thead>
                <tr>
                <th>Thumb</th>
                <th>Link</th>
                <th>Surface</th>
                <th>Price <span className="glyphicon glyphicon-chevron-up" aria-hidden="true"></span> </th>
                <th>Price/m2 </th>
                <th>Location</th>
                <th>BETA - Cost/month (25y,1.84%)</th>
                <th>BETA - Estimated Rent</th>
                <th>BETA - Delta</th>
                <th>BETA - Return</th>
                </tr>
                </thead>
                <tbody>
                {this.props.selectedPosts.map(p=>
                        <Post
                        image={p.image}
                        link={p.link}
                        surface={p.surface}
                        locationDescription={p.locationDescription}
                        price={p.price}
                        rate={p.rate}
                        key={p.guid}
                        guid={p.guid}
                        rent={p.rent}
                        costPerMonth={p.costPerMonth}
                        roi={p.roi}
                        delta={p.delta}
                        />
                        )}
        </tbody>
            </Table>
            );
    }
}



export default List;
