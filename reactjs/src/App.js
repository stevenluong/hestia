import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button,Grid, Row, Col,Table, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
//import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor() {
        super();
        //var y = new Date();
        //y.setDate(y.getDate()-1);
        this.state = {
            posts : [],
            filteredPosts : [],
            date : new Date(),
            toggled : false,
            isMap: false,
            userLocation :  {
                lat : 48.833227,
                lng : 2.375347 
            },
            filterAmount : 0
        };
        this.fetchPosts();
    }
    fetchPosts(){
        fetch("https://hestia-loopback.slapps.fr/api/Posts")
            .then(result=>result.json())
            .then(posts=>{
                //console.log(posts);
                this.setState({posts:posts});
                this.filter(1000000)
            });
    }
    toggleSidebar(){
        this.setState({toggled:!this.state.toggled});
        //console.log(this.state.toggled);
    }
    toggleSidebarWithPost(p){
        //console.log(p);
        //this.setState({toggled:true});
        if(this.state.selectedPost && p.guid==this.state.selectedPost.guid){
                this.toggleSidebar();
        }
        if(!this.state.selectedPost && !this.state.toggled){
                this.toggleSidebar();
        }
        this.setState({selectedPost:p});
    }
    updateDate(date){
        this.setState({date:date},()=>{
            this.updateTitles();
        });
    }
    filter(a){
        this.setState({filterAmount: a});
        var filteredPosts = [];
        var startOfTheDay = new Date();
        startOfTheDay.setHours(0,0,0,0);
        console.log(startOfTheDay)
        console.log(this.state.posts)
        this.state.posts.forEach(p=>{
            p = this.process(p);
            //console.log("filter");
            if(p.price<=a && p.displayed_on > startOfTheDay && p.surface>1)
                filteredPosts.push(p)
        })
        console.log(filteredPosts)
        this.setState({filteredPosts:filteredPosts})
    }
    process(post){
        var p = post;
        var t = 1.84/100;
        var N = 25;
        p.displayed_on = new Date(p.displayed_on);
        p.costPerMonth = parseInt((p.price*t/12)/(1-Math.pow(1+t/12,-N*12)));
        p.rate= parseInt(p.rate);
        p.rent = parseInt(p.surface*20+300);
        p.delta = p.rent-p.costPerMonth;
        p.roi = (p.rent*12/p.price*100).toFixed(2);
        return p;
    }
    displayMap(){
        this.setState({isMap:true});
    }
    displayList(){
        this.setState({isMap:false});
        this.setState({toggled:false});
        this.setState({selectedPost:{}});
    }
    updateCenter(location){
        this.setState({
            userLocation:{
                lat:location.latitude,
                lng:location.longitude,
            }
        })
    }
    render() {
        //var selectedPosts = [];
        var selectedPosts = this.state.filteredPosts;

        selectedPosts.sort(function(a,b){
            return new Date(a.price) - new Date(b.price);
        })
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                console.log(position);
                this.updateCenter(position.coords);
            });
        } else {
            console.log("not supported");
        }

        return (
                <div>
                <Navbar>
                <Navbar.Header>
                <Navbar.Brand>
                <a href="/">Hestia</a>
                </Navbar.Brand>
                <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                <Nav>
                <NavItem eventKey={1} href="#" onClick={()=>this.displayList()}>
                List
                </NavItem>
                <NavItem eventKey={1} href="#" onClick={()=>this.displayMap()}>
                Map 
                </NavItem>
                </Nav>
                <Nav pullRight>
                <NavItem eventKey={1} href="#" onClick={()=>this.toggleSidebar()}>
                Filters
                </NavItem>
                </Nav>
                </Navbar.Collapse>
                </Navbar>
                <div id="wrapper" className={this.state.toggled?"toggled":""}>
                <div id="sidebar-wrapper">
                <Sidebar
                selectedPost={this.state.selectedPost}
        />
            </div>

            <div id="page-content-wrapper">
            {!this.state.isMap ? (
                    <List 
                    selectedPosts={selectedPosts}
                    />
                    ):(
                        <div style={{ height: '80vh', width: '100%' }}>
                        <GoogleMapReact
                        bootstrapURLKeys={{ key:"AIzaSyA4_k3gweq4s-omKJzI_F9uJZ-rn7wzPl4"}}
                        defaultCenter={this.state.userLocation}
                        defaultZoom={16}
                        >
                        <button className="btn btn-primary btn-sm"
                        lat={48.833227}
                        lng={2.375347}
                        onClick={()=>this.toggleSidebarWithPost(selectedPosts[0])}
                        ><span className="glyphicon glyphicon-home" aria-hidden="true"></span> Steven s home</button>
                        {selectedPosts.map(p => 
                        <button className={p.rate<10000?"btn btn-success btn-sm":"btn btn-primary btn-sm"}
                        lat={p.location.lat}
                        lng={p.location.lng}
                        onClick={()=>this.toggleSidebarWithPost(p)}
                        ><span className="glyphicon glyphicon-home" aria-hidden="true"></span> Flat</button>

                        )
                        }
                        </GoogleMapReact>
                        </div>
                      )}

        </div>
            </div>
            </div>
            );
    }
}
class Sidebar extends Component {
    render(){
        if(this.props.selectedPost){
            var p = this.props.selectedPost;
            return (
                    <div>
                    <h2> Details </h2>
                    <p><a href={p.link}><img src={p.image} height="30px" alt=""/></a></p>
                    <p>Surface :</p><p> {p.surface}</p>
                    <p>Price : </p><p>{p.price}</p>
                    <p>Rate : </p><p>{p.rate}</p>
                    <p>Location : </p><p>{p.locationDescription}</p>
                    </div>
                   );
        }else
        {
            var filterAmount = 0;
            return (
                    <div>
                    <h2> Filters</h2>
                    <p> Amount : </p>
                    //TODO Fix
                    <input type="text" value={filterAmount}/>
                    <button onClick={()=>this.filter(filterAmount)}
                        ><span className="glyphicon glyphicon-filter" aria-hidden="true"></span> Filter</button>
                    </div>

                   );
        }
    }
}
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
/*
   function time(date){
   var d = (new Date(date)).toString();
   return d.substring(16,18)+':'+d.substring(19,21);
   };
   */
export default App;
