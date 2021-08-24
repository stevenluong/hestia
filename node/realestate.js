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
/*
const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.0183 Safari/537.36"'
    ];
*/
const options = {
        //args,
        //headless: false,
        //ignoreHTTPSErrors: true,
        //userDataDir: './tmp',
        //slowMo:500,
        //devtools:true,
        //executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        executablePath:'./node_modules/puppeteer/.local-chromium/linux-809590/chrome-linux/chrome'
    };

//const source = "realestate";
const source = "realestate";
const website = "https://www.realestate.com.au";
const process = async function(link,city){
  console.log("TEST");
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
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
    var offers = [];
    var offersQ = document.querySelectorAll('article');
    offersQ.forEach(o=>{
      //console.log('---Offer--');
      var offer = {};
      //LINK
      var linkQ = o.querySelector(".details-link")
      offer.link = "";
      if(linkQ)
        offer.link = website+linkQ.getAttribute('href');
      //console.log(offer.link);
      //ID
      var localId = "";
      //offer.link=v.find(".address").attr("href");
      //if(offer.link!=undefined){
      var localIdSplit = offer.link.split("-");
      localId=localIdSplit[localIdSplit.length-1]
      localId = localId.split("?")[0]
      //}else{
      //    //IF NO LINK, THEN SKIP
      //    return;
      //}
      //GUID
      offer.guid= source+":"+localId;
      //console.log(offer.guid)
      //PRICE
      var priceQ = o.querySelector(".property-price")
      offer.price = NaN;
      if(priceQ)
        offer.price = priceQ.innerText.trim();
      else
        return
      if(offer.price.indexOf("$")!=-1 && offer.price.indexOf(",")!=-1){
        //console.log(offer.price.replace(/,/g,""));
        //console.log(offer.price.replace(/,/g,"").split("$")[1]);
        offer.price = offer.price.replace(/,/g,"").split("$")[1].split(" ")[0];
        offer.price = parseInt(offer.price);
      }else{
        return
      }
      //console.log(offer.price);

      //ADDRESS
      var addressQ = o.querySelector(".residential-card__address-heading")
      offer.location = "";
      if(addressQ)
        offer.location = addressQ.innerText.trim();
      //console.log(offer.address);


      //Bed Nb
      var bedQ = o.querySelector(".general-features__icon.general-features__beds")
      offer.bedNb = NaN;
      if(bedQ)
        offer.bedNb = bedQ.innerText.trim();
      //console.log(offer.bedNb);

      //Bath Nb
      var bathQ = o.querySelector(".general-features__icon.general-features__baths")
      offer.bathNb = NaN;
      if(bathQ)
        offer.bathNb = bathQ.innerText.trim();
      //console.log(offer.bathNb);

      //Parking Nb
      var parkingQ = o.querySelector(".general-features__icon.general-features__cars")
      offer.parkingNb = NaN;
      if(parkingQ)
        offer.parkingNb = parkingQ.innerText.trim();
      //console.log(offer.parkingNb);

      //SURFACE
      var surfaceQ = o.querySelector(".general-features__icon.general-features__land")
      offer.surface = NaN;
      if(surfaceQ)
        offer.surface = surfaceQ.innerText.trim();


      if(isNaN(offer.surface)){
        offer.estimate = true;
        offer.surface = offer.bedNb * 25 + offer.bathNb * 10;
      }else{
        offer.estimate = false;
      }
      //console.log(offer.surface);
      //RATE
      offer.rate = offer.price/offer.surface;

      offer.currency = "$";
      offer.city = city;
      offer.source = source;
      offer.lastDisplayed=Date.now();
      //console.log(offer);

      //PUSH TO LOOPBACK

          //console.log(offer);
          //offers.push(offer);
      //putPost(offer);
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



process(website+'/buy/between-100000-500000-in-gold+coast/list-1','Gold Coast');
process(website+'/buy/between-100000-500000-in-gold+coast/list-2','Gold Coast');
process(website+'/buy/between-100000-500000-in-gold+coast/list-3','Gold Coast');

process(website+'/buy/in-brisbane+-+greater+region,+qld/list-1','Brisbane');
process(website+'/buy/in-brisbane+-+greater+region,+qld/list-2','Brisbane');
process(website+'/buy/in-brisbane+-+greater+region,+qld/list-3','Brisbane');

process(website+'/buy/in-mascot,+nsw+2020/list-1','Mascot');
process(website+'/buy/in-mascot,+nsw+2020/list-2','Mascot');
process(website+'/buy/in-mascot,+nsw+2020/list-3','Mascot');

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
      process(website+'/buy/between-100000-500000-in-gold+coast/list-1','Gold Coast');
      process(website+'/buy/between-100000-500000-in-gold+coast/list-2','Gold Coast');
      process(website+'/buy/between-100000-500000-in-gold+coast/list-3','Gold Coast');

      process(website+'/buy/in-brisbane+-+greater+region,+qld/list-1','Brisbane');
      process(website+'/buy/in-brisbane+-+greater+region,+qld/list-2','Brisbane');
      process(website+'/buy/in-brisbane+-+greater+region,+qld/list-3','Brisbane');

      process(website+'/buy/in-mascot,+nsw+2020/list-1','Mascot');
      process(website+'/buy/in-mascot,+nsw+2020/list-2','Mascot');
      process(website+'/buy/in-mascot,+nsw+2020/list-3','Mascot');
    }
});
cronJob.start();
