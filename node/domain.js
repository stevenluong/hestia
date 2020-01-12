var http = require('http');
var request = require('request');
var scraperjs = require('scraperjs');
var tmp = scraperjs.StaticScraper.create('https://www.domain.com.au/sale/mascot-nsw-2020/');

var DEBUG = FALSE;
var offers = [] ;
var process = function(){
    tmp.scrape(function($) {
        //console.log('---a--');
        //console.log($(".c-pa-info").find(".c-pa-criterion").toString());
        $(".listing-result__details").map(function(el){
            //TODO - Get all links
            var source = "domain";
            var localId = "";
            var price =0;
            var description="";
            var locationDescription=""
            var location={lat:0,lng:0};
            var image="";
            var surface=0;
            var link="";
            var rooms=0;
            //console.log($(this));
            var v = $(this);

            locationDescription = v.find(".address").text();
            link=v.find(".address").attr("href");
            if(link!=undefined){
            var localIdSplit = link.split("-");
            localId=localIdSplit[localIdSplit.length-1]
            }
            price=v.find(".listing-result__price").text();
            rooms = v.find("[data-testid*=property-features-text-container]").text();
            //IF NO LINK, THEN SKIP
            if(link==undefined)
                return;

            if(DEBUG){
            console.log("---");
            console.log("LINK:"+link);
            console.log("LOCALID:"+localId);
            console.log("PRICE:"+price);
            console.log("LOCATION:"+locationDescription);
            console.log("ROOMS:"+rooms);
            }


            //MAP TO MODEL
            var offer = {
                guid: source+":"+localId,    
                price:price,
                locationDescription:description.substring(0,100),
                description:description,
                location:location,
                image:image,
                surface:surface, 
                link:link, 
                rooms:rooms,
                rate:price/surface,
                displayed_on:Date.now()
            };
            //console.log(offer);
            //FILTER OUT
            if(link==undefined){
                console.log("UNPARSABLE")
            }
            //PUSH TO LOOPBACK
            else{
                console.log(offer);
                //offers.push(offer);
                putPost(offer);
            }

        })

    })
            //TODO - Get all details
            //TODO - Clean old
            /*
            var source = "pap";
            var url = "https://www.pap.fr";
            //            return $(this);
            //console.log($(this));
            var v = $(this);
            //console.log('---x--');
            //console.log(v.find(".c-pa-criterion em").length);
            //var criterion =v.find(".c-pa-info .c-pa-criterion em");
            var rawDescription = v.find("div .item-description").text();;
            //console.log(rawDescription+"--RAWDESCRIPTION")
            var localId = v.find("div .infos-box").attr("data-annonce");
            if(localId)
                localId = JSON.parse(localId).id
            //console.log(localId+"--LOCALID")
            var rooms = "";
            var r = v.find("div .item-tags li:contains('pi')").text();
            if(r)
                rooms = r.split(" ")[0];
            //console.log(rooms+"--ROOMS")
            var surface = "1";
            var s = v.find("div .item-tags li:contains('m2')").text();
            if(s)
                surface = s.split(" ")[0];
            //console.log(s+"--RAWSURFACE")
            //console.log(surface+"--RAWSURFACE")
            var rawPrice = v.find("div .item-title .item-price").text();

            var price = parseInt(normalize(rawPrice).replace(/\./g, '').slice(0,-1));
            console.log(rawPrice+"--RAWPRICE")
            //TODO
            var link = url+v.find("div .item-title").attr("href");
            //console.log(link+"--LINK")
            var image = v.find("a.img-liquid img").attr("src");
            //console.log(image+"--IMAGE")
            //console.log(v);
            console.log('------');
            //console.log('ATTRIBS');
            //console.log(v['0'].attribs);
            //console.log('CHILDREN');
            //console.log(v['0'].children);
            //console.log($(this));
            //console.log(price+"--PRICE")

            var description = normalize(rawDescription);
            var offer = {
                guid: source+":"+localId,    
                price:price,
                locationDescription:description.substring(0,100),
                description:description,
                location:{
                    lat : 0,
                    lng : 0
                },
                image:image,
                surface:surface, 
                link:link, 
                rooms:rooms,
                rate:price/surface,
                displayed_on:Date.now()
            };
            console.log(offer);
            if(offer.guid == "pap:undefined" || surface == 1){
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
        //console.log(offers.length);
        //push to loopback

    })

            */
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


