const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

var request = require('request');
var config = {
  //server : "http://localhost:8529", // local
  server : "https://slapps.fr",
  //dbUrl : "/_db/_system/hephaistos" // local
  dbUrl : "/athena/_db/production/hestia"
}


puppeteer.use(StealthPlugin())

const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
        //'--disable-infobars',
        //'--window-position=0,0',
        //'--ignore-certifcate-errors',
        //'--ignore-certifcate-errors-spki-list',
        //'--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.0183 Safari/537.36"'
    ];
//console.log("LOCATION:"+process.env.LOCATION)
var options = {
        args,
        headless: true,
        //ignoreHTTPSErrors: true,
        //userDataDir: './tmp',
        //slowMo:500,
        //devtools:true,
	executablePath:'google-chrome-stable',
        //executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        //executablePath:process.env.LOCATION=="mac"?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':'./node_modules/puppeteer/.local-chromium/linux-809590/chrome-linux/chrome'
        //executablePath:'./node_modules/puppeteer/.local-chromium/mac-809590/chrome-mac/Chromium.app'
    };

//const source = "realestate";
const source = "pap";
const website = "https://www.pap.fr";
var scrape = async function(link,city){
  console.log("Process starting with : "+city);
  var browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  page.on('console', msg => console.log('Console Log:', msg.text()));
  //await page.setRequestInterception(true);
  //const link = website+'/buy/between-100000-500000-in-gold+coast/list-1';
  //const city = "Gold Coast";
  //const c = city;
  //const s = source;
  await page.goto(link, {waitUntil: 'networkidle2',timeout:0});
  //await page.goto(link);
  const offers = await page.evaluate((source,city,website)=>{
    //debugger;
    //console.log(`url is ${location.href}`)
    //console.log("in")
    var offers = [];
    var offersQ = document.querySelectorAll('.search-list-item-alt');
    offersQ.forEach(o=>{
      console.log('---Offer--');
      var offer = {};
      //LINK
      var linkQ = o.querySelector("div .item-title")
      offer.link = linkQ?website+linkQ.getAttribute('href'):"";
      console.log(offer.link);
      //ID
      var localId = "";
      //offer.link=v.find(".address").attr("href");
      //if(offer.link!=undefined){
      var localIdSplit = offer.link.split("-r");
      localId=localIdSplit[localIdSplit.length-1]
      //localId = localId.split("?")[0]
      //}else{
      //    //IF NO LINK, THEN SKIP
      //    return;
      //}
      //GUID
      offer.guid= source+":"+localId;
      //console.log(offer.guid)
      //PRICE
      var priceQ = o.querySelector("div .item-title .item-price")
      offer.price = priceQ?priceQ.innerText.trim():"";
      var test = offer.price;
      //else
      //  return
      //console.log("PRICE")
      //console.log(offer.price.length)
      if(offer.price.indexOf("€")!=-1 && offer.price.indexOf(".")!=-1){
        //console.log("IN")
        //console.log(offer.price.replace(/,/g,""));
        //console.log(offer.price.replace(/,/g,"").split("$")[1]);
        //console.log(test.split(" ")[1]);
        offer.price = offer.price.replace("€","").replace(".","").replace(".","");
        //console.log(offer.price)
        //offer.price = offer.price;
        //console.log(offer.price)
        offer.price = parseInt(offer.price);
      }
      else {
        offer.price = ""
      }
      //console.log(offer.price)
      //else{
      //  return
      //}
      //console.log(offer.price);
      //CITY
      console.log(offer.link)
      /*
      var s = offer.link.split("/");
      var retrievedCity = city;
      if(s.length>0){
        var s2 = s[s.length-1].split("-");
        var i = 1;
        if(["appartement","terrain","maison"].indexOf(s2[0])!=-1 && s2[1]!="loft" )
          retrievedCity = s2[i]
        else if(s2[0]=="mobil" && s2[1]=="home"){
          i = i + 1 ;
          retrievedCity = s2[i];
        }
        if(retrievedCity == "saint"){
          i = i + 1
          retrievedCity = retrievedCity + "-" + s2[i].charAt(0).toUpperCase() + s2[i].slice(1)
        }
        retrievedCity =  retrievedCity.charAt(0).toUpperCase() + retrievedCity.slice(1)
        console.log(retrievedCity)
      }
      */
      if(offer.link.indexOf(city.toLowerCase())==-1){
        console.log("not keeping")
        return
      }else{
        retrievedCity = city
      }
      //TODO - type ?

      //ADDRESS
      //var addressQ = o.querySelector(".residential-card__address-heading")
      offer.location = "TBD";
      //if(addressQ)
      //  offer.location = addressQ.innerText.trim();
      //console.log(offer.address);


      //Bed Nb
      //var bedQ = o.querySelector(".general-features__icon.general-features__beds")
      //offer.bedNb = NaN;
      //if(bedQ)
      //  offer.bedNb = bedQ.innerText.trim();
      //console.log(offer.bedNb);

      //Bath Nb
      //var bathQ = o.querySelector(".general-features__icon.general-features__baths")
      //offer.bathNb = NaN;
      //if(bathQ)
      //  offer.bathNb = bathQ.innerText.trim();
      //console.log(offer.bathNb);

      //Parking Nb
      //var parkingQ = o.querySelector(".general-features__icon.general-features__cars")
      //offer.parkingNb = NaN;
      //if(parkingQ)
      //  offer.parkingNb = parkingQ.innerText.trim();
      //console.log(offer.parkingNb);

      //SURFACE
      //console.log(o.querySelector("div .item-tags"))
      var surfaceQ = Array.from(o.querySelectorAll("div .item-tags li"))
      //console.log(test.length)
      offer.surface = "";
      surfaceQ.map(li=>{
        //console.log(li.innerText.replace("²","2"))
        var text = li.innerText.replace("²","2")
        //console.log(text)
        if(text.indexOf("m2")!=-1){
          offer.surface = text.split(" m2")[0];
        }
      })
      offer.surface = parseInt(offer.surface);
      //var surfaceQ = o.querySelector("div .item-tags li:nth-child(2)")
      //offer.surface = surfaceQ?surfaceQ.textContent.trim().replace("²","2"):"";
      //if(offer.surface.indexOf("m2")!=-1 && offer.surface.indexOf(" ")!=-1){
        //console.log(offer.surface)
        //console.log(offer.price.replace(/,/g,""));
        //console.log(offer.price.replace(/,/g,"").split("$")[1]);
        //offer.surface = offer.surface.split(" m")[0];
        //offer.surface = parseInt(offer.surface);
      //}
      //else {
        //offer.surface=""
      //}
      console.log(offer.surface)

      //if(isNaN(offer.surface)){
      //  offer.estimate = true;
      //  offer.surface = offer.bedNb * 25 + offer.bathNb * 10;
      //}else{
      //  offer.estimate = false;
      //}
      //console.log(offer.surface);
      //RATE
      offer.rate = offer.price/offer.surface;
      //console.log(offer.rate)
      offer.currency = "€";
      offer.city = retrievedCity;
      offer.source = source;
      offer.lastDisplayed=Date.now();
      //console.log(offer);

      //PUSH TO LOOPBACK

          //console.log(offer);
          //offers.push(offer);
      //putPost(offer);
      if(offer.guid!==source+":undefined")
        offers.push(offer);

      //console.log(offer);
    })
    return offers;
  },source,city,website);
  //console.log(offers);
  //console.log(offers.length);
  offers.forEach(o=>{
    putPost(o);
  })

  await browser.close();

};


var scrapeAll = async function(){
  //await scrape(website+'/annonce/vente-immobiliere-paris-75-g439-studio','Paris');
  //await scrape(website+'/annonce/vente-immobiliere-paris-75-g439','Paris');
  //await scrape(website+'/annonce/vente-immobiliere-bordeaux-33-g43588','Bordeaux');
  //await scrape(website+'/annonce/vente-immobiliere-bordeaux-33-g43588-studio','Bordeaux');
  //await scrape(website+'/annonce/vente-immobiliere-rouen-76-g43640','Rouen');
  //await scrape(website+'/annonce/vente-immobiliere-rouen-76-g43640-studio','Rouen');
  //await scrape(website+'/annonce/vente-immobiliere-lille-59-g43627','Lille');
  //await scrape(website+'/annonce/vente-immobiliere-lille-59-g43627-studio','Lille');
  await scrape(website+'/annonce/vente-immobiliere-anglet-64600-g33708','Anglet');
  await scrape(website+'/annonce/vente-immobiliere-anglet-64600-g33708-studio','Anglet');
  await scrape(website+'/annonce/vente-immobiliere-biarritz-64200-g33376','Biarritz');
  await scrape(website+'/annonce/vente-immobiliere-biarritz-64200-g33376-studio','Biarritz');
  await scrape(website+'/annonce/vente-immobiliere-bayonne-64100-g33230','Bayonne');
  await scrape(website+'/annonce/vente-immobiliere-bayonne-64100-g33230-studio','Bayonne');
  await scrape(website+'/annonce/vente-immobiliere-hasparren-642400-g33402','Hasparren');
  await scrape(website+'/annonce/vente-immobiliere-hasparren-642400-g33402-studio','Hasparren');
  await scrape(website+'/annonce/vente-immobiliere-hossegor-g52800','Hossegor');
  await scrape(website+'/annonce/vente-immobiliere-hossegor-g52800-studio','Hossegor');
  await scrape(website+'/annonce/vente-immobiliere-seignosse-40510-g22964','Seignosse');
  await scrape(website+'/annonce/vente-immobiliere-seignosse-40510-g22964-studio','Seignosse');

}
scrapeAll();
//process(website+'/buy/between-100000-500000-in-gold+coast/list-2','Gold Coast');
//process(website+'/buy/between-100000-500000-in-gold+coast/list-3','Gold Coast');

//process(website+'/buy/in-brisbane+-+greater+region,+qld/list-1','Brisbane');
//process(website+'/buy/in-brisbane+-+greater+region,+qld/list-2','Brisbane');
//process(website+'/buy/in-brisbane+-+greater+region,+qld/list-3','Brisbane');

//process(website+'/buy/in-mascot,+nsw+2020/list-1','Mascot');
//process(website+'/buy/in-mascot,+nsw+2020/list-2','Mascot');
//process(website+'/buy/in-mascot,+nsw+2020/list-3','Mascot');

const putPost = function(post){
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


//CRON
var CronJob = require('cron').CronJob;
var cronJob = new CronJob({
    cronTime: '0 0 8,20 * * *',
    onTick: function() {
      scrapeAll();
      //process(website+'/buy/between-100000-500000-in-gold+coast/list-1','Gold Coast');
      //process(website+'/buy/between-100000-500000-in-gold+coast/list-2','Gold Coast');
      //process(website+'/buy/between-100000-500000-in-gold+coast/list-3','Gold Coast');

      //process(website+'/buy/in-brisbane+-+greater+region,+qld/list-1','Brisbane');
      //process(website+'/buy/in-brisbane+-+greater+region,+qld/list-2','Brisbane');
      //process(website+'/buy/in-brisbane+-+greater+region,+qld/list-3','Brisbane');

      //process(website+'/buy/in-mascot,+nsw+2020/list-1','Mascot');
      //process(website+'/buy/in-mascot,+nsw+2020/list-2','Mascot');
      //process(website+'/buy/in-mascot,+nsw+2020/list-3','Mascot');
    }
});
cronJob.start();
