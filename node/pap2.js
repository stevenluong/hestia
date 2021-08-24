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
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.0183 Safari/537.36"'
    ];

const options = {
        //args,
        //headless: false,
        //ignoreHTTPSErrors: true,
        //userDataDir: './tmp',
        //slowMo:500,
        //devtools:true,
        executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        //executablePath:'./node_modules/puppeteer/.local-chromium/linux-809590/chrome-linux/chrome'
        //executablePath:'./node_modules/puppeteer/.local-chromium/mac-809590/chrome-mac/Chromium.app'
    };

//const source = "realestate";
const source = "pap";
const website = "https://www.pap.fr";
const process = async function(link,city){
  console.log("Process starting");
  const browser = await puppeteer.launch(options);
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
      //console.log(offer.link);
      //ID
      var localId = "";
      //offer.link=v.find(".address").attr("href");
      //if(offer.link!=undefined){
      var localIdSplit = offer.link.split("-r");
      localId=localIdSplit[1]
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
      offer.city = city;
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


var processAll = function(){
  process(website+'/annonce/vente-immobiliere-paris-75-g439-studio','Paris');
  process(website+'/annonce/vente-immobiliere-paris-75-g439','Paris');
  process(website+'/annonce/vente-immobiliere-biarritz-64200-g33376','Biarritz');
  process(website+'/annonce/vente-immobiliere-biarritz-64200-g33376-studio','Biarritz');
  process(website+'/annonce/vente-immobiliere-bordeaux-33-g43588','Bordeaux');
  process(website+'/annonce/vente-immobiliere-bordeaux-33-g43588-studio','Bordeaux');
}
processAll();
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
    cronTime: '0 30 8 * * *',
    onTick: function() {
      processAll();
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
