'use strict';
const Config = require('../config/const');
var unirest = require('unirest');

const search = (query, type, index) => {
    return post(query, '/_search', type, index);
};

const searchDocuments = (query, type, index) => {
    return post(query, '/_search', type, index);
};

const getDocument = (query, path, type, index) => {
    return getDocuments(query, path, type, index)
        .then(results => {
            if (results && results.length) {
                return results[0];
            }
            return Promise.resolve();
        });
};

const getDocuments = (query, path, type, index) => {
    return searchDocuments(query, type, index)
        .then(results => {
            if (results && results.hits && results.hits.total) {
                return results.hits.hits.map(r => {
                    if (path) return r._source[path];
                    return r._source;
                });
            }
            return Promise.resolve();
        });
};

const save = (doc, type, index) => {
    return post(doc, '', type, index);
};

const saveIfNotExist = (condition, doc, type, index) => {
    let filters = [];
    for (let path in condition) {
        let val = condition[path];
        let cond = {};
        cond[path] = val;

        filters.push({ match_phrase: cond });
    }
    let q = { query: { bool: { must: filters } }, size: 0 };

    return search(q, type, index)
        .then(results => {
            if (results && results.hits && results.hits.total === 0) {
                return save(doc, type, index);
            }
            return Promise.resolve();
        });
};

const post = (payload, op, type, index) => {
    index = index || 'estaurant';
    type = type || 'restaurant';
    let url = Config.ESTAURANT_API_URL + `/${index}/${type}${op}`;

    console.log('POST index:', index, ' type:', type, ' op:', op, ' payload:', JSON.stringify(payload));

    return new Promise((resolve) => {
        return getClient('post', url, index, type)
            .send(payload)
            .end(function (response) {
                console.log('Response: ', response.body);
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
    getDocuments,
    getDocument,
    save,
    saveIfNotExist
};