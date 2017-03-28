var jwt = require('jwt-simple');

const IDENT_SEP = '/';

class TokenBuilder {
    constructor(keyId, keySecret) {
        this.keyId = keyId;
        this.keySecret = keySecret;
        this.props = {
            grants: {},
            // Bit6 API default values
            env: 'prod',
            access: 'client',
            version: 'v1'
        };
    }

    access(access) {
        this.props.access = access;
        return this;
    }

    aud(aud) {
        this.props.aud = aud;
        return this;
    }

    device(device) {
        this.props.device = device;
        return this;
    }

    env(env) {
        this.props.env = env;
        return this;
    }

    exp(exp) {
        this.props.exp = exp;
        return this;
    }

    grant(key, val) {
        this.props.grants[key] = val;
        return this;
    }

    grants(grants) {
        this.props.grants = grants;
        return this;
    }

    identity(identity) {
        this.props.identity = identity;
        return this;
    }

    key(id, secret) {
        this.keyId = id;
        this.keySecret = secret;
        return this;
    }

    ttl(ttl) {
        this.props.ttl = ttl;
        return this;
    }

    build() {
        const p = this.props;
        let sub = null;
        if (p.access === 'client') {
            if (!p.identity || !p.device) {
                throw 'Identity and/or Device not specified';
            }
            sub = p.identity + IDENT_SEP + p.device;
        }
        // Determine the audience (if not specified directly)
        let aud = p.aud;
        if  (!aud) {
            // Audience is the Base API URL
            aud = 'https://api.' + p.env + '.bit6.com/' + p.access + '/' + p.version;
        }

        // Current time - Unix timestamp
        const now = Math.floor(Date.now() / 1000);
        // JWT claims
        let claims = {
            // Base API URL as the audience claim
            aud: aud,
            // Key ID
            iss: this.keyId,
            // Issued at
            iat: now,
            // Permission grants
            grants: p.grants
        };
        // Identity/device as subject - optional
        if (sub) {
            claims.sub = sub;
        }
        // Set expiration claim - optional
        if (p.exp) {
            claims.exp = p.exp;
        }
        // Set expiration claim based in time-to-live in seconds - optional
        else if (p.ttl) {
            claims.exp = now + p.ttl;
        }
        // Encode and sign the JWT token
        return jwt.encode(claims, this.keySecret);
    }

    static create(keyId, keySecret) {
        return new TokenBuilder(keyId, keySecret)
    }
}

module.exports = TokenBuilder;
