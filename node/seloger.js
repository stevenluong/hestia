var http = require('http');
var request = require('request');
var scraperjs = require('scraperjs');
var tmp = scraperjs.StaticScraper.create('http://www.seloger.com/immobilier/achat/immo-paris-75/bien-appartement/');

var offers = [] ;
var process = function(){
    tmp.scrape(function($) {
        //console.log('---a--');
        //console.log($(".c-pa-info").find(".c-pa-criterion").toString());
        $(".c-pa-list").map(function(el){
            //            return $(this);
            //console.log($(this));
            var v = $(this);
            //console.log('---x--');
            //console.log(v.find(".c-pa-criterion em").length);
            var criterion =v.find(".c-pa-info .c-pa-criterion em");
            var rawDescription = v.find(".description").text();;
            var localId = v.attr("data-listing-id");
            var rooms = criterion.eq(0).text()+","+criterion.eq(1).text();
            var rawSurface = criterion.eq(2).text();
            var rawPrice = v.find(".c-pa-info .c-pa-price span").eq(1).text();
            //TODO
            var link = v.find(".c-pa-info .c-pa-link").attr("href");
            var image = JSON.parse(v.find(".c-pa-pic .c-pa-visual .c-pa-imgs .slideContent a div").eq(0).attr("data-lazy")).url;
            //console.log(v);
            console.log('------');
            //console.log('ATTRIBS');
            //console.log(v['0'].attribs);
            //console.log('CHILDREN');
            //console.log(v['0'].children);
            /*
               var children = v['0'].children;
               children.forEach((c)=>{
            //console.log('---c--');
            //console.log(c);
            //console.log('---f--');
            if(c.attribs && c.attribs.class.indexOf("c-pa-criterion")!= -1){
            //console.log(c);
            c.children.forEach((cc)=>{
            if(cc.name && cc.name.includes("em")){
            console.log(cc.children[0].data)

            }
            });
            }

            })
            */
            //console.log($(this));
            var surface = parseFloat(rawSurface.replace(/,/g,'.').slice(0,-2)); 
            var price = parseInt(normalize(rawPrice).replace(/\s/g, '').slice(0,-1));
            var description = normalize(rawDescription);
            var offer = {
                guid:"seloger:"+localId,
                price:price,
                locationDescription:description.split(".")[0],
                description:description,
                location:{
                    lat : 0,
                    lng : 0
                },
                image:image,
                surface:surface, 
                link:link, 
                rooms:normalize(rooms),
                rate:price/surface
            };
            if(surface<10){
                console.log(rawSurface);
                console.log(offer);
            }
            offers.push(offer);
            putPost(offer);

        })//.get();
    })
    .then(function() {
        console.log(offers.length);
        //push to loopback

    })
}
var putPost = function(post){
    request.put({url:"https://hestia-loopback.slapps.fr/api/Posts",json:post},function(error,response,body){
        //console.log(title);
        if (!error && response.statusCode == 200) {
            //console.log(body);
        }else{
            console.log("ERROR");
            //console.log(body);
            //console.log(error);
        }
    })
}
var normalize = function(s){
    return s.replace(/\s+/g, ' ');
}

process();


