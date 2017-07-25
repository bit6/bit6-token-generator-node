require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
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

    // Start building the token
    const builder = TokenBuilder.create()
        .identity(identity)
        .device(device)
        .access('client')
        // Grant permissions to access Signal, Video, and Chat services
        .grants({
            chat: true,
            signal: true,
            video: true
        })
        // Expire the token in 1 hour (ttl is in seconds)
        .ttl(60 * 60);

    // Connect to Bit6 'dev' environment. This is a special case for this demo.
    // This part can be omitted from your code as by default the token is generated
    // for the production Bit6 API.
    if (req.query.env === 'dev') {
        builder.env('dev').key(process.env.BIT6_DEV_KEY_ID, process.env.BIT6_DEV_KEY_SECRET);
    }
    // Connect to the default Bit6 production API
    else {
        // Read Bit6 API Key ID and Secret from environment variables
        builder.key(process.env.BIT6_KEY_ID, process.env.BIT6_KEY_SECRET);
    }

    // Response JSON
    res.send( {token: builder.build()} );
});

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
