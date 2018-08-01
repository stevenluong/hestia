var http = require('http');
var request = require('request');
var scraperjs = require('scraperjs');
var tmp = scraperjs.StaticScraper.create('https://www.pap.fr/annonce/vente-immobiliere-paris-75-g439-studio');

var offers = [] ;
var process = function(){
    tmp.scrape(function($) {
        //console.log('---a--');
        //console.log($(".c-pa-info").find(".c-pa-criterion").toString());
        $(".search-list-item").map(function(el){
            var source = "pap";
            var url = "https://www.pap.fr";
            //            return $(this);
            //console.log($(this));
            var v = $(this);
            //console.log('---x--');
            //console.log(v.find(".c-pa-criterion em").length);
            //var criterion =v.find(".c-pa-info .c-pa-criterion em");
            var rawDescription = v.find(".item-content .item-description").text();;
            //console.log(rawDescription+"--RAWDESCRIPTION")
            var localId = v.find(".item-content .infos-box").attr("data-annonce");
            if(localId)
                localId = JSON.parse(localId).id
            //console.log(localId+"--LOCALID")
            var rooms = "";
            var r = v.find(".item-tags li:contains('pi')").text();
            if(r)
                rooms = r.split(" ")[0];
            //console.log(rooms+"--ROOMS")
            var surface = "1";
            var s = v.find(".item-tags li:contains('m2')").text();
            if(s)
                surface = s.split(" ")[0];
            //console.log(s+"--RAWSURFACE")
            //console.log(surface+"--RAWSURFACE")
            var rawPrice = v.find(".item-content .item-title .item-price").text();
            var price = parseInt(normalize(rawPrice).replace(/\./g, '').slice(0,-1));
            //console.log(rawPrice+"--RAWPRICE")
            //TODO
            var link = url+v.find(".item-content .item-title").attr("href");
            //console.log(link+"--LINK")
            var image = v.find("a.img-liquid img").attr("src");
            //console.log(image+"--IMAGE")
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
                rate:price/surface
            };
            //console.log(offer);
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


