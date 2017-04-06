'use strict';
const request = require('request-promise');
const Config = require('../const');
const search_url = Config.ESTAURANT_API_URL + '/estaurant/_search';

const search = (query) => {
    let opts = {
        method: 'POST',
        url: search_url,
        json: true,
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