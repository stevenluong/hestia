var http = require('http');
var request = require('request');
var scraperjs = require('scraperjs');
var tmp = scraperjs.StaticScraper.create('https://www.domain.com.au/sale/mascot-nsw-2020/');

var config = {
  //server : "http://localhost:8529", // local
  server : "https://athena.slapps.fr",
  //dbUrl : "/_db/_system/hephaistos" // local
  dbUrl : "/_db/production/hestia"
}

var DEBUG = false;
var offers = [] ;
var source = "domain";

var process = function(){
    tmp.scrape(function($) {
        //console.log($(".c-pa-info").find(".c-pa-criterion").toString());
        $(".css-1ctih3l").map(function(el){
            console.log('---Offer--');
            var offer = {};
            //console.log("in");
            //TODO - Get all links

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
              offer.description = offer.description+ feature + " ";
              //console.log(feature);
              var s = feature.split("m²");
              //console.log(s)
              if(s.length > 1)
                surface = s[0];
              //console.log(t);
            })
            if(surface == 0)
              offer.surface = "TBD";
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
            if(offer.price == "TBD" || offer.surface=="TBD")
              offer.rate = "TBD";
            else {
              offer.rate = offer.price/offer.surface;
            }
            offer.displayed_on=Date.now();

            //OFFER

            offer.currency = "$";
            offer.city = "Sydney";
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
                putPost(offer);
            }

        })

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
var extractPrice = function(rawPrice){
    //console.log(rawPrice)
    var price = "";
    var split = rawPrice.split("$");
    price = split[split.length-1]
    price = price.replace(/,/g,"").replace(" ","")
    price = parseInt(price);
    if(isNaN(price))
      return "TBD";
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
process();
