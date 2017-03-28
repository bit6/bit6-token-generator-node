## Bit6 Token Generator for Node.js

A super simple application demonstrating the external authentication in Bit6.


### Prerequisites

* Get the API Key ID and Secret at [Bit6 Dashboard](https://dashboard.bit6.com).


### Running Locally

```sh
$ git clone git@github.com:bit6/bit6-token-generator-node.git
$ cd bit6-token-generator-node
$ npm install
```

Specify your Bit6 API Key ID and Secret using environment variables or a local `.env` config file. The file should contain two lines:

```
BIT6_KEY_ID=abc
BIT6_KEY_SECRET=xyz
```

Start the application

```sh
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).


### Deploying to Heroku

Make sure you have the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ heroku create
$ git push heroku master
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Set Bit6 API key and secret:

```sh
$ heroku config:set BIT6_KEY_ID=abc
$ heroku config:set BIT6_KEY_SECRET=xyz
```


### Generating a Token

You would normally generate a token by doing a POST from your app client to your application server. To simulate this using `curl`:

```sh
curl -X POST http://localhost:5000/token \
     -d 'identity=bob1' \
     -d 'device=web1'
```

The response should be a JSON object:

```json
{
    "token": "..."
}
```

You can view the token claims at https://jwt.io.


### Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
