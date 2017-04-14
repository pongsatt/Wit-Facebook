const client = require('./client');
const esQuery = require('./dsl');
const index = 'nlp';
const correctIntentType = 'correctIntent';
const incorrectIntentType = 'incorrectIntent';
const entityType = 'entity';

const saveIntent = (sentence, normalizedSentence, intent, correct) => {
    let doc = { sentence, normalizedSentence, intent };

    if (correct) {
        return client.saveIfNotExist({ sentence }, doc, correctIntentType, index);
    }

    return client.saveIfNotExist({ sentence }, doc, incorrectIntentType, index);
};

const getIntent = (sentence) => {
    let query = esQuery({size:1, min_score: 2})
                .bool()
                    .must()
                        .match('sentence', sentence, { minimum_should_match: '90%' })
                    .should()
                        .matchPhrase('sentence', sentence, { slop: 50 })
                    .q;

    return client.getDocument(query, 'intent', correctIntentType, index);
};

const getEntity = (value) => {
    let query = esQuery().matchPhrase('value', value).q;
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