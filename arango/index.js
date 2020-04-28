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

// RECEIPTS ----------------------------------------------------------------
// store schema in variable to make it re-usable, see .body()
const offerDocSchema = joi.object().required().keys({
  link: joi.string()
}).unknown(); // allow additional attributes

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
