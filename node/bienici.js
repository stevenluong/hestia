const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

var request = require('request');
var config = {
  //server : "http://localhost:8529", // local
  server : "https://athena.slapps.fr",
  //dbUrl : "/_db/_system/hephaistos" // local
  dbUrl : "/_db/production/hestia"
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
        //executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        //executablePath:process.env.LOCATION=="mac"?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':'./node_modules/puppeteer/.local-chromium/linux-809590/chrome-linux/chrome'
        //executablePath:'./node_modules/puppeteer/.local-chromium/mac-809590/chrome-mac/Chromium.app'
    };

//const source = "realestate";
const source = "bienici";
const website = "https://www.bienici.com";
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
    //console.log(document.querySelector("body").innerText)
    console.log(JSON.parse(document.querySelector("body").innerText).total)
    //console.log(`url is ${location.href}`)
    //console.log("in")
    var json = JSON.parse(document.querySelector("body").innerText);
    var offers = [];
    json.realEstateAds.forEach(o=>{
      console.log('---Offer--');
      var offer = {};
      //LINK
      offer.link = website+"/annonce/"+o.id;
      //console.log(offer.link);

      //ID
      var localId = o.id;
      //GUID
      offer.guid= source+":"+localId;
      //console.log(offer.guid)
      //PRICE
      offer.price = o.price;
      //CITY
      var retrievedCity = o.city;
      //TODO - type ?

      //ADDRESS
      offer.location = o.district.libelle;


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
      offer.surface = o.surfaceArea;
      //RATE
      offer.rate = offer.price/offer.surface;
      //console.log(offer.rate)
      offer.currency = "€";
      offer.city = retrievedCity;
      offer.source = source;
      offer.lastDisplayed=Date.now();

      console.log(offer.guid);
      console.log(offer.surface);
      console.log(offer.price);
      //console.log(offer.rate);
      if(isNaN(offer.rate))
        return;
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
  await scrape(website+'/realEstateAds.json?filters=%7B"size"%3A24%2C"from"%3A0%2C"showAllModels"%3Afalse%2C"filterType"%3A"buy"%2C"propertyType"%3A%5B"house"%2C"flat"%5D%2C"page"%3A1%2C"sortBy"%3A"relevance"%2C"sortOrder"%3A"desc"%2C"onTheMarket"%3A%5Btrue%5D%2C"zoneIdsByTypes"%3A%7B"zoneIds"%3A%5B"-422124"%5D%7D%7D&extensionType=extendedIfNoResult&leadingCount=2','Anglet');

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
/*
var CronJob = require('cron').CronJob;
var cronJob = new CronJob({
    cronTime: '0 30 8 * * *',
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
*/
