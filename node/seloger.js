var http = require('http');
var request = require('request');
var scraperjs = require('scraperjs');
var tmp = scraperjs.StaticScraper.create('http://www.seloger.com/immobilier/achat/immo-paris-75/bien-appartement/');
//var tmp = scraperjs.StaticScraper.create('https://www.seloger.com/list.htm?idtt=2,5&idtypebien=1,2&cp=75&tri=initial&naturebien=1,2,4&pxmax=300000');

var config = {
  //server : "http://localhost:8529", // local
  server : "https://athena.slapps.fr",
  //dbUrl : "/_db/_system/hephaistos" // local
  dbUrl : "/_db/production/hestia"
}

var offers = [] ;
var process = function(){
    tmp.scrape(function($) {
        console.log('---a--');
        console.log($.html());
        //console.log($(".c-pa-info").find(".c-pa-criterion").toString());
        //block__ShadowedBlock-sc-10w6hsj-0 ListContent__SmartClassifiedExtended-sc-1viyr2k-2 iddbNe classified__ClassifiedContainer-sc-1wmlctl-0 jzFgwH Card__CardContainer-sc-7insep-8 hglOTD
        $(".ListContent__SmartClassifiedExtended-sc-1viyr2k-2").map(function(el){
            console.log("in")
            //            return $(this);
            console.log($(this).text());
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
                rate:price/surface,
                displayed_on:Date.now()
            };
            if(surface<10){
                console.log(rawSurface);
                console.log(offer);
            }
            offers.push(offer);
            console.log(offer);
            //putPost(offer);

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
