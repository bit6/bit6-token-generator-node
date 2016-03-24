var jwt = require('jwt-simple');

function _createToken(apiKey, apiSecret, identities) {
    if (!identities || identities.length < 1) {
        throw 'Must have at least one identity URI';
    }
    // Primary identity
    var primary = identities.shift();
    // Current time - Unix timestamp
    var now = Math.floor(Date.now() / 1000);
    // JWT claims
    var data = {
      // Issued at
      iat: now,
      // Expiration - 10 minutes
      exp: now + 10*60,
      // Bit6 API key as audience claim
      aud: apiKey,
      // Primary identity as subject
      sub: primary
    };
    // Handle additional identities
    if (identities.length > 0) {
      data.identities = identities;
    }
    // Encode and sign the JWT token
    return jwt.encode(data, apiSecret);
}

module.exports = function(apiKey, apiSecret) {
    if (!apiKey || !apiSecret) {
        throw 'API key and/or secret not specified';
    }
    return {
        createToken: function(identities) {
            return _createToken(apiKey, apiSecret, identities);
        }
    };
}
