var config = {
  //server : "http://localhost:8529", // local
  server : "https://athena.slapps.fr",
  usersUrl : "/_db/production/athena"
}

const helpers = {
    createUser: function(user,cb){
      var q = config.server+config.usersUrl+"/users/"
      console.log(q)
      fetch(q,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
          .then(result=>result.json())
          .then(u=>{
              //console.log(u);
              cb(Object.assign(user,u));
          });
    },

    getUser:function (user,cb){
      var q = config.server+config.usersUrl+"/users/"+user.sub
      console.log(q)
      fetch(q)
          .then(result=>result.json())
          .then(u=>{
              if(u.length==0){
                console.log(user)
                this.createUser(user, cb);
              }
              else{
                cb(Object.assign(user,u[0]));
              }
              //console.log(u);

          });
    },

    editUser:function (user,cb){
      console.log(user);
      user._rev=null;
      var q = config.server+config.usersUrl+"/users/"+user._key
      fetch(q,{
        method:'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
          .then(result=>result.json())
          .then(updatedUser=>{
              //console.log(updatedAsset);
              //assets.push(asset);
              cb(user);
          });
    }
}

export default helpers;
