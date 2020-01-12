import React, { Component } from 'react';
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

export default Sidebar;
