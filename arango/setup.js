// continued
'use strict';
const db = require('@arangodb').db;
const offersCollection = 'offers';

if (!db._collection(offersCollection)) {
  db._createDocumentCollection(offersCollection);
}
