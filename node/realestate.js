var http = require('http');
var request = require('request');
var scraperjs = require('scraperjs');

var config = {
  //server : "http://localhost:8529", // local
  server : "https://athena.slapps.fr",
  //dbUrl : "/_db/_system/hephaistos" // local
  dbUrl : "/_db/production/hestia"
}

var DEBUG = false;
var offers = [] ;
var source = "realestate";

var process = function(link, city){
    var tmp = scraperjs.StaticScraper.create(link);
    //console.log(link);
    tmp.catch((error,utils)=>{
      console.log(error);
    })
    tmp.scrape(function($) {
        console.log($("html"));
        $("div.tiered-results.tiered-results--exact div").map(function(el){
            console.log('---Offer--');
            var offer = {};
            //console.log("in");
            //TODO - Get all links
            /*
            var v = $(this);

            //var description="";
            offer.image=v.find("img").attr("src");
            //var rooms=0;
            //console.log($(this));

            offer.location = v.find(".css-bqbbuf").text().substring(0,100);

            //LOCALID
            //LINK
            var localId = "";
            offer.link=v.find(".address").attr("href");
            if(offer.link!=undefined){
                var localIdSplit = offer.link.split("-");
                localId=localIdSplit[localIdSplit.length-1]
                localId = localId.split("?")[0]
            }else{
                //IF NO LINK, THEN SKIP
                return;
            }
            //GUID
            offer.guid= source+":"+localId;
            console.log(offer.guid)
            //PRICE
            var rawPrice=v.find(".css-mgq8yx").text();
            offer.price = extractPrice(rawPrice);

            //ROOMS
            //rooms = v.find("[data-testid*=property-features-text-container]").text();

            //DESCRIPTION
            //SURFACE
            var surface = 0;
            var features = v.find(".css-1rzse3v");
            offer.description = "";
            features.map((i,f) =>{
              var feature = $(f).text();
              //console.log(feature);
              if(feature.indexOf("Bed")!=-1){
                offer.bedNb = parseInt(feature.split(" ")[0]);
                if(isNaN(offer.bedNb))
                  offer.bedNb = 1;
              }
              if(feature.indexOf("Bath")!=-1)
                offer.bathNb = parseInt(feature.split(" ")[0]);
              if(feature.indexOf("Parking")!=-1)
                offer.parkingNb = parseInt(feature.split(" ")[0]);
              offer.description = offer.description+ feature + ",";
              //console.log(feature);
              var s = feature.split("m²");
              //console.log(s)
              if(s.length > 1)
                surface = s[0];
              //console.log(t);
            })
            if(surface == 0)
              offer.surface = NaN;
            else {
              offer.surface = parseInt(surface);
            }
            //surface = getSurface(link, localId);
            //surface = parseInt(rooms[0])*30;
            //console.log(rooms);
            //console.log(surface);
            //console.log(rawPrice.indexOf("$"));
            //If NO PRICE, THEN SKIP
            //if(rawPrice.indexOf("$")==-1)
            //    return;
            //console.log(rawPrice);


            //MAP TO MODEL

            //offer.description=description;
            offer.locationCoord={lat:0,lng:0};

            //offer.surface=surface;
            //offer.rooms=rooms;
            offer.lastDisplayed=Date.now();
            //console.log(offer.surface)

            //ESTIMATE
            if(isNaN(offer.surface)){
              console.log(offer.description)
              //console.log(features)
              offer.surface = 10 * offer.bathNb + 25 * offer.bedNb;
              offer.estimate=true;
            }else{
              offer.estimate=false;
            }
            if(isNaN(offer.price))
              offer.rate = NaN;
            else {
              offer.rate = offer.price/offer.surface;
            }
            //offer.displayed_on=Date.now();

            //OFFER

            offer.currency = "$";
            offer.city = city;
            offer.source = source;
            console.log(offer);

            //FILTER OUT
            if(offer.link==undefined){
                console.log("UNPARSABLE")
            }
            //PUSH TO LOOPBACK
            else{
                //console.log(offer);
                //offers.push(offer);
                //putPost(offer);
            }
            */

        })

    })

}
var putPost = function(post){
    //console.log(post.guid)
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
var extractPrice = function(rawPrice){
    //console.log(rawPrice)
    var price = "";
    rawPrice = rawPrice.replace("k","000").replace("K","000")
    var split = rawPrice.split("$");
    price = split[split.length-1]
    price = price.replace(/,/g,"").replace(" ","")
    price = parseInt(price);
    if(isNaN(price))
      return NaN;
    //console.log(price);
    return price;
}
var getSurface = function(link,localId){

    var l = scraperjs.StaticScraper.create(link);

    l.scrape(function($) {
        return $(".listing-details__description").map(function() {
            return $(this).text();
        }).get();
    })
    .then(function(description) {
        console.log(description);
    })
}
//process('https://www.domain.com.au/sale/brisbane-city-qld-4000/?price=100000-500000&excludeunderoffer=1&sort=price-asc',"Brisbane");

process('https://www.realestate.com.au/buy/between-100000-500000-in-brisbane+-+greater+region,+qld/list-1',"Brisbane");
