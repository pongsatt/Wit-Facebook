'use strict';

const Config = require('../config/const');
const client = require('../es/client');
const { buildBoolQ,
    buildGeoQ,
    buildMatchQ,
    buildMustQ,
    buildNestedQ,
    buildRangeQ,
    buildExistQ,
    buildWildCardQ } = require('../es/query');
const { calculateDistance } = require('../utils/geo_util');
const { getDayOfWeek, getTime } = require('../utils/date_util');

const pickOne = (opts, moreOpts) => {
    opts = Object.assign({}, {
        // location: Config.DEFAULT_LOCATION
    }, opts, moreOpts);

    return search(opts, { size: 0, timeOfDay: '' })
        .then(results => {
            let total = results.hits.total;
            let r = getRandomInt(0, total - 1);

            console.log('Pick index: ', r);

            return search(opts, { from: r, size: 1, timeOfDay: '' })
                .then(results => {
                    if (results.hits.total) {
                        let picked = results.hits.hits[0];
                        console.log('Pick: ', picked._source.name);
                    }
                    return results;
                });
        })
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const search = (opts, moreOpts) => {
    opts = Object.assign({}, {
        // location: Config.DEFAULT_LOCATION
    }, opts, moreOpts);

    let q = buildQuery(opts);

    return find(q, opts);
}

const find = (q, opts) => {
    return new Promise((resolve, reject) => {
        return client.search(q)
            .then(results => {
                console.log('Found:', results.hits.total);

                if(results && results.hits && results.hits.total){
                    return resolve(postProcess(results, opts));
                }

                return reject({code:'not_found', msg: 'Result not found.'});
            })
    });
}

const postProcess = (results, opts) => {
    if (results && results.hits && results.hits.hits && opts.location) {
        results.hits.hits = results.hits.hits.map(r => {
            let lat1 = opts.location.lat;
            let lon1 = opts.location.lon;
            let lat2 = r._source.geo.location[1];
            let lon2 = r._source.geo.location[0];

            r._distance = calculateDistance(lat1, lon1, lat2, lon2, 'K') * 1000;
            return r;
        });

    }

    return results;
}

const buildQuery = (opts) => {
    opts = Object.assign({}, {
        dayOfWeek: getDayOfWeek(),
        timeOfDay: getTime(),
    }, opts);

    let filters = [];

    if (opts.location) {
        let geoQ = buildGeoQ(opts.location);
        filters.push(geoQ);
    }

    if (opts.maxPrice) {
        let priceQ = buildRangeQ("priceRange.high", "lte", opts.maxPrice);
        filters.push(priceQ);
    }

    if (opts.minPrice) {
        let priceQ = buildRangeQ("priceRange.low", "gte", opts.minPrice);
        filters.push(priceQ);
    }

    if (opts.timeOfDay && opts.dayOfWeek) {
        let mustTimesQ = [
            buildRangeQ(`times.${opts.dayOfWeek}.open`, "lte", opts.timeOfDay),
            buildRangeQ(`times.${opts.dayOfWeek}.close`, "gte", opts.timeOfDay)
        ];
        let timesQ = buildNestedQ(`times.${opts.dayOfWeek}`, buildBoolQ({ must: mustTimesQ }));
        filters.push(timesQ);
    }

    if (opts.recommended === true) {
        let ratingExist = buildExistQ("rating");
        let ratingValue = buildRangeQ("rating.ratingValue", "gte", 1);
        let ratingCount = buildRangeQ("rating.ratingCount", "gte", 1);
        let reviewCount = buildRangeQ("rating.reviewCount", "gte", 1);

        filters.push(ratingExist);
        filters.push(ratingValue);
        filters.push(ratingCount);
        filters.push(reviewCount);
    }

    let mustQ = [];

    if (opts.keyword) {
        let keywordQ;

        if (opts.keyword.indexOf(' ') > -1) {
            keywordQ = buildMatchQ(opts.keyword);
        } else {
            keywordQ = buildWildCardQ(opts.keyword);
        }
        mustQ.push(keywordQ);
    }

    if (opts.type) {
        let typeQ = buildMatchQ(opts.type, 'cuisine');
        mustQ.push(typeQ);
    }

    if (opts.food) {
        let foodQ = buildMatchQ(opts.food, 'menus');
        mustQ.push(foodQ);
    }

    if (opts.where) {
        let whereQ = buildMatchQ(opts.where, 'address.addressLocality');
        mustQ.push(whereQ);
    }

    let q = {
        "query": buildBoolQ({ must: mustQ, filter: filters })
    };

    if (opts.from !== undefined) q.from = opts.from;
    if (opts.size !== undefined) q.size = opts.size;

    console.log('build q: ', JSON.stringify(q));

    return q;
}

module.exports = {
    pickOne,
    search
}