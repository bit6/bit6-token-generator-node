require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');

// Read Bit6 API key and secret from environment variables
var apiKey = process.env.BIT6_API_KEY;
var apiSecret = process.env.BIT6_API_SECRET;

console.log('Bit6 API key/secret', apiKey, apiSecret);

// Bit6 external auth token generator.
var tokenGenerator = require('../lib/bit6-token-generator')(apiKey, apiSecret);

// Setup Express app
var app = express();
// App port
app.set('port', (process.env.PORT || 5000));
// Parse application/json body
app.use(bodyParser.json())

app.post('/auth', function(req, res) {
    console.log('BODY', req.body);
    // In this example, POST body contains JSON
    // object with the identity URIs to use. In real life
    // the identities should be provided by your application code.
    //var idents = ['usr:john', 'tel:+12125551234'];
    var idents = req.body.identities;
    // Generate the token
    var token = tokenGenerator.createToken(idents);
    // Response JSON
    res.send( {ext_token: token} );
});

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
