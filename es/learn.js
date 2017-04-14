const client = require('./client');
const { buildQuery, buildMatchPhraseQ, buildMatchQ } = require('./query');
const index = 'nlp';
const correctIntentType = 'correctIntent';
const incorrectIntentType = 'incorrectIntent';
const entityType = 'entity';

const saveIntent = (sentence, intent, correct) => {
    let doc = { sentence, intent };

    if (correct) {
        return client.saveIfNotExist({ sentence }, doc, correctIntentType, index);
    }

    return client.saveIfNotExist({ sentence }, doc, incorrectIntentType, index);
};

const getIntent = (sentence) => {
    let query = buildQuery(buildMatchQ(sentence, 'sentence'));
    query.size = 1;
    query.min_score = 0.75;

    return client.getDocument(query, 'intent', correctIntentType, index);
};

const getEntity = (value) => {
    let query = buildQuery(buildMatchPhraseQ(value, 'value'));
    return client.getDocument(query, '', entityType, index);
};

const saveEntity = (entity) => {
    let doc = entity;

    return client.saveIfNotExist(entity, doc, entityType, index);
};

module.exports = {
    saveIntent,
    getIntent,
    saveEntity,
    getEntity
};