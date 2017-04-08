'use strict';
const request = require('request-promise');
const Config = require('../config/const');

const options = {
  uri: Config.ESTAURANT_API_URL + '/estaurant/_search',
  method: 'POST',
  json: true,
  headers: {
    'Content-Type': 'application/json',
    "Authorization" : "Basic " + new Buffer(Config.ESTAURANT_API_AUTH).toString("base64")
  },
};

const search = (query) => {
    let opts = Object.assign({}, options, {body: query});

    console.log('Request options: ', opts);

    return request(opts)
        .then((data) => {
            // console.log('Found data: ', data);
            return data;
        });
}

module.exports = {
    search
};