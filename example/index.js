require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

// Read Bit6 API Key ID and Secret from environment variables
const keyId = process.env.BIT6_KEY_ID;
const keySecret = process.env.BIT6_KEY_SECRET;

console.log('Bit6 API Key ID and Secret', keyId, keySecret);

const TokenBuilder = require('../lib/bit6-token-builder');

// Setup Express app
const app = express();
// App port
app.set('port', (process.env.PORT || 5000));
// Add CORS to allow calling this API from a browser
app.use( cors() );
// Parse urlencoded body
app.use( bodyParser.urlencoded({ extended: true }) );
// Parse application/json body
app.use( bodyParser.json() )

// Generate Bit6 JWT AccessToken
app.post('/token', function(req, res) {
    console.log('BODY', req.body);
    const identity = req.body.identity;
    const device = req.body.device;

    if (!identity || !device) {
        const msg = 'Make sure to include "identity" and "device" values in the POST body.';
        console.log(msg);
        return res.status(400).send(msg);
    }
    // Grant permissions to access Signal, Video, and Chat service
    const grants = {
        chat: true,
        signal: true,
        video: true
    };
    // Expire the token in 1 hour (ttl is in seconds)
    const ttl = 60 * 60;

    const token = TokenBuilder.create(keyId, keySecret)
        .env('dev')
        .access('client')
        .grants(grants)
        .identity(identity)
        .device(device)
        .ttl(ttl)
        .build()

    // Response JSON
    res.send( {token: token} );

});

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
