/**
 * The Server Can be configured and created here...
 *
 * You can find the JSON Data file here in the Data module. Feel free to impliment a framework if needed.
 */

/*
-- This is the product data, you can view it in the file itself for more details 
{
    "_id": "019",
    "isActive": "false",
    "price": "23.00",
    "picture": "/img/products/N16501_430.png",
    "name": "Damage Reverse Thickening Conditioner",
    "about": "Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.",
    "tags": [
        "ojon",
        "conditioner"
    ]
}
*/
const data = require('./data');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const minisearch = require('minisearch');
const hostname = 'localhost';
const port = 3035;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const makeIndex = () => {
  const index = new minisearch({
    fields: ['id', 'name', 'about', 'price', 'tags'], // fields to index for full-text search
    storeFields: ['name', 'picture'], // fields to return with search results
    extractField: (document, fieldName) => {
      // Access nested fields
      const value = fieldName
        .split('.')
        .reduce((doc, key) => doc && doc[key], document);
      // If field value is an array, join by space
      return Array.isArray(value) ? value.join(' ') : value;
    },
  });
  // change _id -> id
  const formatedData = JSON.parse(
    JSON.stringify(data).split('"_id":').join('"id":')
  );
  index.addAll(formatedData);
  return index;
};

const index = makeIndex();

app.get('/', function (req, res) {
  res.send(`Server running on ${hostname}:${port}`);
});

app.get('/search', function (req, res) {
  const result = index.search(req.query.search, { prefix: true });
  res.send(result);
});

/**
 * Start the Node Server Here...
 *
 * The http.createServer() method creates a new server that listens at the specified port.
 * The requestListener function (function (req, res)) is executed each time the server gets a request.
 * The Request object 'req' represents the request to the server.
 * The ServerResponse object 'res' represents the writable stream back to the client.
 */
app.listen(port, function (err) {
  console.log(`[Server running on ${hostname}:${port}]`);
  if (err) {
    console.log(err);
  }
});
