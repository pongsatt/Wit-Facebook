'use strict';

const buildWildCardQ = (keyword) => {
    return {
        "wildcard": {
            "_all": `*${keyword}*`
        }
    };
}

const buildMatchQ = (keyword, field) => {
    let fieldQ = {};

    if(field) fieldQ[field] = keyword;
    else fieldQ._all = keyword;

    return {
        "match": fieldQ
    };
}

const buildGeoQ = (location) => {
    return {
        "geo_distance": {
            "distance": location.maxDistance,
            "geo.location": [location.lon, location.lat]
        }
    };
}

const buildRangeQ = (field, exp, value) => {
    let expr = {};
    expr[exp] = value;

    let fieldExpr = {};
    fieldExpr[field] = expr;

    let q = { "range": fieldExpr };

    return q;
}

const buildMustQ = () => {
    return {
        "must": arguments
    }
}

const buildExistQ = (field) => {
    return {
        "exists": {"field": field}
    }
}

const buildNestedQ = (path, q) => {
    return {
        "nested": {
            "path": path,
            "query": q
        }
    };
}

const buildBoolQ = (q) => {
    let boolQ = { bool: {} };
    if (q.must && q.must.length) {
        boolQ.bool.must = q.must;
    }

    if (q.filter && q.filter.length) {
        boolQ.bool.filter = q.filter;
    }

    return boolQ;
}

module.exports = {
    buildBoolQ,
    buildGeoQ,
    buildMatchQ,
    buildMustQ,
    buildNestedQ,
    buildRangeQ,
    buildExistQ,
    buildWildCardQ
}