import React, { Component } from 'react';
class Post extends Component {
    render() {
        var green = {color:"green"};
        var red= {color:"red"};
        return (
                <tr>
                <td><a href={this.props.link}><img src={this.props.image} height="30px" alt=""/></a></td>
                <td><a href={this.props.link}>{this.props.guid}</a></td>
                <td>{this.props.surface}</td>
                {this.props.price <= 200000 ? (
                        <td style={green}> {this.props.price}</td>
                        ) : (
                        <td> {this.props.price}</td>
                        )}
                {this.props.rate<= 10000 ? (
                        <td style={green}> {this.props.rate}</td>
                        ) : (
                        <td> {this.props.rate}</td>
                        )}
                <td>{this.props.locationDescription}</td>
                <td>{this.props.costPerMonth}</td>
                <td>{this.props.rent}</td>
{this.props.delta>0 ? (
                        <td style={green}> {this.props.delta}</td>
                        ) : (
                        <td style={red}> {this.props.delta}</td>
                        )}
{this.props.roi> 3 ? (
                        <td style={green}> {this.props.roi}%</td>
                        ) : (
                        <td> {this.props.roi}%</td>
                        )}
                </tr>
               );
    }
}

export default Post;
