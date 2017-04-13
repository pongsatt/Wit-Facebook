'use strict';
const Config = require('../config/const');
var unirest = require('unirest');

const search = (query, type, index) => {
    return post(query, '/_search', type, index);
};

const searchDocuments = (query, type, index) => {
    return post(query, '/_search', type, index)
        .then(results => {
            if (results && results.hits && results.hits.total) {
                return results.hits.hits.map(d => d._source);
            }
            return Promise.resolve();
        });
};

const save = (doc, type, index) => {
    return post(doc, '', type, index);
};

const saveIfNotExist = (condition, doc, type, index) => {
    return search({ query: { bool: { filter: { match: condition } } }, size: 0 }, type, index)
        .then(results => {
            if (results && results.hits && results.hits.total) {
                return Promise.resolve();
            }
            return save(doc, type, index);
        });
};

const post = (payload, op, type, index) => {
    index = index || 'estaurant_th';
    type = type || 'restaurant';
    let url = Config.ESTAURANT_API_URL + `/${index}/${type}${op}`;

    console.log('POST index: ', index, 'type: ', type, 'url: ', url, 'payload: ', JSON.stringify(payload));

    return new Promise((resolve) => {
        return getClient('post', url, index, type)
            .send(payload)
            .end(function (response) {
                return resolve(response.body);
            });
    });
};

const getClient = (method, url) => {
    let userPass = Config.ESTAURANT_API_AUTH.split(':');

    return unirest(method, url)
        .headers({ 'Content-Type': 'application/json' })
        .auth({ user: userPass[0], pass: userPass[1] });
};



module.exports = {
    search,
    searchDocuments,
    save,
    saveIfNotExist
};