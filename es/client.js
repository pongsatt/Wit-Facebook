'use strict';
const request = require('request-promise');
const Config = require('../config/const');
var unirest = require('unirest');

const options = {
    uri: Config.ESTAURANT_API_URL + '/estaurant/_search',
    method: 'POST',
    json: true,
    headers: {
        'Content-Type': 'application/json',
        "Authorization": "Basic " + new Buffer(Config.ESTAURANT_API_AUTH).toString("base64")
    },
};

const search = (query) => {
    let opts = Object.assign({}, options, { body: query });

    let userPass = Config.ESTAURANT_API_AUTH.split(':');

    return new Promise((resolve, reject) => {
        return unirest.post(Config.ESTAURANT_API_URL + '/estaurant/_search')
        .headers({ 'Content-Type': 'application/json' })
        .auth({ user: userPass[0], pass: userPass[1]})
        .send(query)
        .end(function (response) {
            return resolve(response.body);
        });
    });
}

module.exports = {
    search
};