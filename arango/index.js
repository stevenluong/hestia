'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();

module.context.use(router);

router.get('/hi', function (req, res) {
  res.send('γεια');
})
.response(['text/plain'], 'Hi in greek')
.summary('Greek greeting')
.description('Prints the greek greeting.');

const joi = require('joi');
const db = require('@arangodb').db;
const aql = require('@arangodb').aql;
const errors = require('@arangodb').errors;
const offersCollection = db._collection('offers');
const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;


// store schema in variable to make it re-usable, see .body()
const offerDocSchema = joi.object().required().keys({
  link: joi.string()
}).unknown(); // allow additional attributes

router.patch('/offers/:guid', function (req, res) {
  console.log(req.pathParams.guid)
  //console.log(req.body)
  var data = null;
  //const data = receiptsCollection.update(req.pathParams.key,req.body);
  if(offersCollection.exists(req.pathParams.guid))
    data = offersCollection.update(req.pathParams.guid, req.body);
  else{
    req.body.createdOn = new Date();
    console.log(req.body)
    data = offersCollection.save(req.body);
  }

  res.send(data)
})
.body(offerDocSchema, 'Offer to update in the collection.')
.pathParam('guid', joi.string().required(), 'GUID of the offer')
.response(joi.object().required(), 'Offer stored in the collection.')
.summary('Updates an Offer')
.description('Updates an Offer based on a key = GUID');


router.post('/offers', function (req, res) {
  const multiple = Array.isArray(req.body);
  const body = multiple ? req.body : [req.body];

  let data = [];
  for (var doc of body) {
    const meta = offersCollection.save(doc);
    data.push(Object.assign(doc, meta));
  }
  res.send(multiple ? data : data[0]);

})
.body(joi.alternatives().try(
  offerDocSchema,
  joi.array().items(offerDocSchema)
), 'Offers to store in the collection.')
.response(joi.alternatives().try(
  joi.object().required(),
  joi.array().items(joi.object().required())
), 'Offers stored in the collection.')
.summary('Store offers')
.description('Store offers');

/*
router.get('/offers', function (req, res) {
  const offers = db._query(aql`
    FOR asset IN ${offersCollection}
    RETURN asset
  `);
  res.send(offers);
})
.response(joi.array().items(
  joi.string().required()
).required(), 'List of offers.')
.summary('List Offers')
.description('List Offers');
*/
router.get('/offers', function (req, res) {
  const offers = db._query(aql`
    FOR asset IN ${offersCollection}
    FILTER DATE_TIMESTAMP(asset.lastDisplayed) > DATE_TIMESTAMP(DATE_SUBTRACT(DATE_NOW(),1,"day")) AND DATE_TIMESTAMP(asset.lastDisplayed) < DATE_TIMESTAMP(DATE_NOW())
    RETURN asset
  `);
  res.send(offers);
})
.response(joi.array().items(
  joi.string().required()
).required(), 'List of offers.')
.summary('List Offers')
.description('List Offers');
