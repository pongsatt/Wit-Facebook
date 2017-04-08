'use strict';
const request = require('request-promise');
const Config = require('../config/const');
var unirest = require('unirest');

const search = (query) => {
    let userPass = Config.ESTAURANT_API_AUTH.split(':');

    return new Promise((resolve, reject) => {
        return unirest.post('https://site:9ba59ac512ad38d86747aea0ca255596@nori-us-east-1.searchly.com/estaurant/_search')
        .headers({ 'Content-Type': 'application/json' })
        // .auth({ user: userPass[0], pass: userPass[1]})
        .send(query)
        .end(function (response) {
            return resolve(response.body);
        });
    });
}

module.exports = {
    search
};