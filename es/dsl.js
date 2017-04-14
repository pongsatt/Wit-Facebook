const objectPath = require("object-path");

const queryFn = (root) => {
    root = root || { query: {} };

    return {
        q: root,
        bool: boolFn(root)
    };
};

const boolFn = (root) => {

    return () => {
        let path = 'query.bool';
        let bool = objectPath.get(root, path) || {};
        objectPath.set(root, path, bool);
        return {
            q: root,
            must: mustFn(root),
            should: shouldFn(root)
        };
    };
};

const mustFn = (root) => {

    return () => {
        let path = 'query.bool.must';
        let must = objectPath.get(root, path) || [];
        objectPath.set(root, path, must);
        return {
            q: root,
            match: matchFn(root, path),
            matchPhrase: matchPhraseFn(root, path)
        };
    };
};

const shouldFn = (root) => {

    return () => {
        let path = 'query.bool.should';
        let should = objectPath.get(root, path) || [];
        objectPath.set(root, path, should);
        return {
            q: root,
            match: matchFn(root, path),
            matchPhrase: matchPhraseFn(root, path)
        };
    };
};

const matchFn = (root, path) => {
    let type = 'match';
    return (field, value, options) => {
        return matchGenericFn(root, path, type, field, value, options);
    };
};

const matchPhraseFn = (root, path) => {
    let type = 'match_phrase';
    return (field, value, options) => {
        return matchGenericFn(root, path, type, field, value, options);
    };
};

const matchGenericFn = (root, path, type, field, value, options) => {
    let match = {};
        match[type] = {};

        if (options) {
            match[type][field] = Object.assign({ query: value }, options);
        } else {
            match[type][field] = value;
        }

        let parent = objectPath.get(root, path);

        if (Array.isArray(parent)) {
            objectPath.insert(root, path, match);
        } else {
            objectPath.set(root, path, match);
        }

        return {
            q: root,
            match: matchFn(root, path),
            matchPhrase: matchPhraseFn(root, path),
            must: mustFn(root),
            should: shouldFn(root)
        };
};

module.exports = queryFn;

if (require.main === module) {
    console.log(JSON.stringify(
        queryFn()
            .bool()
                .must()
                    .match('sentence', 'อยากกินข้าวผัดกระเพราแถวพร้อมพง', { minimum_should_match: '85%' })
                .should()
                    .matchPhrase('sentence', 'อยากกินข้าวผัดกระเพราแถวพร้อมพง', { slop: 50 })
            .q
    ));
}