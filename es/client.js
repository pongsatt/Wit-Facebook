'use strict';
const request = require('request-promise');
const Config = require('../config/const');
const search_url = Config.ESTAURANT_API_URL + '/estaurant/_search';

const search = (query) => {
    let opts = {
        host: Config.ESTAURANT_API_HOST,
        port: Config.ESTAURANT_API_PORT,
        path: '/estaurant/_search',
        method: 'POST',
        json: true,
        timeout: 20000,
        headers : {
            "Authorization" : "Basic " + new Buffer(Config.ESTAURANT_API_AUTH).toString("base64")
        },
        body: query
    };

    // console.log('Request options: ', opts);

    return request(opts)
        .then((data) => {
            // console.log('Found data: ', data);
            return data;
        });
}

module.exports = {
    search
};