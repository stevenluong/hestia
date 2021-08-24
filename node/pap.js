var http = require('http');
var request = require('request');
var scraperjs = require('scraperjs');
var tmp = scraperjs.StaticScraper.create('https://www.pap.fr/annonce/vente-immobiliere-paris-75-g439-studio');

var config = {
  //server : "http://localhost:8529", // local
  server : "https://athena.slapps.fr",
  //dbUrl : "/_db/_system/hephaistos" // local
  dbUrl : "/_db/production/hestia"
}

var source = "pap";

var offers = [] ;
var process = function(){
    tmp.scrape(function($) {
        //console.log('---a--');
        //console.log($(".c-pa-info").find(".c-pa-criterion").toString());
        $(".search-list-item-alt").map(function(el){
            console.log('---Offer---');
            var offer = {}
            //var source = "pap";
            var url = "https://www.pap.fr";
            //            return $(this);
            //console.log($(this));
            var v = $(this);
            //console.log('---x--');
            //console.log(v.find(".c-pa-criterion em").length);
            //var criterion =v.find(".c-pa-info .c-pa-criterion em");

            //console.log(rawDescription+"--RAWDESCRIPTION")
            var localId = v.find("div a.item-title").attr("name");
            //console.log(localId)
            //if(localId)
            //    localId = JSON.parse(localId).id
            //console.log(localId+"--LOCALID")
            var rooms = "TBD";
            var r = v.find("div .item-tags li:contains('pi')").text();
            if(r)
                offer.rooms = r.split(" ")[0];
            //console.log(rooms+"--ROOMS")
            offer.surface = "TBD";
            var s = v.find("div .item-tags li:contains('m2')").text();
            if(s)
                offer.surface = s.split(" ")[0];
            //console.log(s+"--RAWSURFACE")
            //console.log(surface+"--RAWSURFACE")
            var rawPrice = v.find("div .item-title .item-price").text();

            offer.price = parseInt(normalize(rawPrice).replace(/\./g, '').slice(0,-1));
            console.log(rawPrice+"--RAWPRICE")
            //TODO
            offer.link = url+v.find("div .item-title").attr("href");
            //console.log(link+"--LINK")
            offer.image = v.find("a.img-liquid img").attr("src");
            //console.log(image+"--IMAGE")
            //console.log(v);
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
            //console.log(price+"--PRICE")
            //DESCRIPTION
            var rawDescription = v.find("div .item-description").text();;
            var description = normalize(rawDescription);
            offer.description = description.substring(1);
            offer.location = "TBD"//description.split(".")[0], //TODO - Improve
            offer.locationCoord = {
                    lat : 0,
                    lng : 0
                };

                //image:image,
                //surface:surface,
                //link:link,
                //rooms:rooms,
                //rate:price/surface,

            //};
            offer.lastDisplayed=Date.now();
            if(offer.price == "TBD" || offer.surface=="TBD")
              offer.rate = "TBD";
            else {
              offer.rate = offer.price/offer.surface;
            }

            offer.guid = source+":"+localId;
            offer.currency = "€";
            offer.city = "Paris";
            offer.source = source;

            //console.log(offer);
            if(offer.guid == "pap:undefined"){
                //console.log(offer);
            }
            else{
                console.log(offer);
                offers.push(offer);
                putPost(offer);
            }
            //if(surface<10){
                //console.log(rawSurface);
                //console.log(offer);
            //}

        })//.get();
    })
    .then(function() {
        console.log(offers.length);
        //push to loopback

    })
}
var putPost = function(post){
    console.log(post.guid)
    post._key = post.guid;
    request.patch({url:config.server+config.dbUrl+"/offers/"+post.guid,json:post},function(error,response,body){
        //console.log(title);
        if (!error && response.statusCode == 200) {
          console.log(post.guid+" saved");
            //console.log(body);
        }else{
            //console.log("ERROR");
            //console.log(body);
            //console.log(error);
        }
    })
}
var normalize = function(s){
    return s.replace(/\s+/g, ' ');
}

process();
