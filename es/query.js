'use strict';

const buildIdsQ = (ids) => {
    return {
        "ids": {
            values: ids
        }
    };
};

const buildWildCardQ = (keyword, field) => {
    let fieldQ = {};
    keyword = `*${keyword}*`;

    if(field) fieldQ[field] = keyword;
    else fieldQ._all = keyword;

    return {
        "wildcard": fieldQ
    };
};

const buildMatchQ = (keyword, field) => {
    let fieldQ = {};

    if(field) fieldQ[field] = keyword;
    else fieldQ._all = keyword;

    return {
        "match": fieldQ
    };
};

const buildFuzzyQ = (keyword, field) => {
    let fieldQ = {};

    if(field) fieldQ[field] = keyword;
    else fieldQ._all = keyword;

    return {
        "fuzzy": fieldQ
    };
};

const buildGeoQ = (location) => {
    return {
        "geo_distance": {
            "distance": location.maxDistance,
            "geo.location": [location.lon, location.lat]
        }
    };
};

const buildRangeQ = (field, exp, value) => {
    let expr = {};
    expr[exp] = value;

    let fieldExpr = {};
    fieldExpr[field] = expr;

    let q = { "range": fieldExpr };

    return q;
};

const buildMustQ = () => {
    return {
        "must": arguments
    };
};

const buildExistQ = (field) => {
    return {
        "exists": {"field": field}
    };
};

const buildNestedQ = (path, q) => {
    return {
        "nested": {
            "path": path,
            "query": q
        }
    };
};

const buildFilterQ = (filters) => {
    return {filter: filters};
};

const buildBoolQ = (q) => {
    let boolQ = { bool: {} };
    if (q.must && q.must.length) {
        boolQ.bool.must = q.must;
    }

    if (q.must_not && q.must_not.length) {
        boolQ.bool.must_not = q.must_not;
    }

    if (q.should && q.should.length) {
        boolQ.bool.should = q.should;
    }

    if (q.filter && q.filter.length) {
        boolQ.bool.filter = q.filter;
    }

    return boolQ;
};

const buildQuery = (q) => {
    return {query: q};
};

module.exports = {
    buildBoolQ,
    buildFilterQ,
    buildGeoQ,
    buildMatchQ,
    buildMustQ,
    buildNestedQ,
    buildRangeQ,
    buildExistQ,
    buildWildCardQ,
    buildIdsQ,
    buildFuzzyQ,
    buildQuery
};