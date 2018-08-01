var request = require('request');

var key= "";

request.get({url:"https://hestia-loopback.slapps.fr/api/Posts"},function(error,response,body){
    //console.log(title);
    if (!error && response.statusCode == 200) {
        //console.log(body);
        var posts = JSON.parse(body); 
        posts.forEach((p)=>{
            //var p = posts[0];
            //console.log(p);
            //p.location = location;
            if(p.location.lat==0){
                locate(p,(location)=>{
                    p.location = location;
                    console.log(p);
                    update(p);
                });
            }
        });
    }else{
        //console.log(body);
        console.log("ERROR");
        //console.log(error);
    }
});

var update=function(post){
    request.put({url:"https://hestia-loopback.slapps.fr/api/Posts",json:post},function(error,response,body){
        //console.log(title);
        if (!error && response.statusCode == 200) {
            //console.log(body);
        }else{
            //console.log(body);
            //console.log(error);
        }
    });


}
var locate=function(p, callback){
    var query = p.locationDescription//.replace(/\s/g,'+');
    //var query = "sevres+babylone";
    console.log(query);
    //console.log(encodeURIComponent(escape(query)));
    var radius = 100000;
    var paris = {
        lat:48.860989,
        lon:2.335714
    }
    request.get({url:"https://maps.googleapis.com/maps/api/place/textsearch/json?query="+encodeURIComponent(query)+"&location="+paris.lat+","+paris.lon+"&radius="+radius+"&key="+key},function(error,response,body){
    //request.get({url:"https://maps.googleapis.com/maps/api/place/textsearch/json?query="+encodeURIComponent(escape(query))+"&location="+paris.lat+","+paris.lon+"&radius="+radius+"&key="+key},function(error,response,body){
        //console.log(title);
        if (!error && response.statusCode == 200) {
            //console.log(body);
            var result = JSON.parse(body);
            if(result.status=="ZERO_RESULTS")
                console.log("No results");
            else if(result.status=="OVER_QUERY_LIMIT"){
                console.log("QUOTA");
            }
            else{
                //console.log(result)
                //console.log(result.results[0].geometry.location);
                location = result.results[0].geometry.location;
                //console.log(location)
                    callback(location);
            }
        }else{
            console.log(body);
            //console.log(error);
        }
    });
}
