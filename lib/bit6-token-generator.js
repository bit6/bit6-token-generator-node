var jwt = require('jwt-simple');

const IDENT_SEP = '/';

function _createToken(keyId, keySecret, aud, sub, grants, ttl) {
    if (!grants) {
        throw 'Grants not specified';
    }
    // Current time - Unix timestamp
    var now = Math.floor(Date.now() / 1000);
    // JWT claims
    var claims = {
        // Issued at
        iat: now,
        // Base API URL as the audience claim
        aud: aud,
        // Key ID
        iss: keyId,
        // Permission grants
        grants: grants
    };
    // Identity/device as subject - optional
    if (sub) {
        claims.sub = sub;
    }
    // Set expiration claim based in time-to-live in seconds - optional
    if (ttl) {
        claims.exp = now + ttl;
    }
    // Encode and sign the JWT token
    return jwt.encode(claims, keySecret);
}

module.exports = function(keyId, keySecret, opts) {
    if (!keyId || !keySecret) {
        throw 'API Key ID and/or Secret not specified';
    }
    // API Base URL params
    opts = opts || {}
    var env = opts.env ? opts.env : 'prod';
    var version = opts.version ? opts.version : 'v1';
    return {
        createClientToken: function(identity, device, grants, ttl) {
            if (!identity || !device) {
                throw 'Identity and/or Device not specified';
            }
            // Use predefined API URL, or build one based on params
            var aud = opts.url ? opts.url : 'https://api.' + env + '.bit6.com/client/' + version;
            // Build JWT subject with identity and device
            var sub = identity + IDENT_SEP + device;
            return _createToken(keyId, keySecret, aud, sub, grants, ttl);
        },
        createPlatformToken: function(grants, ttl) {
            // Use predefined API URL, or build one based on params
            var aud = opts.url ? opts.url : 'https://api.' + env + '.bit6.com/platform/' + version;
            return _createToken(keyId, keySecret, aud, null, grants, ttl);
        }
    };
}
