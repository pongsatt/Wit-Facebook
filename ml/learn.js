const uuid = require('uuid/v1');
// const MongoClient = require('../mongo/client');
const client = require('../es/learn');
const NerDict = require('../nlp/ner/dict');

class Learn {
    constructor() {
        // this.mgClient = new MongoClient();
        this.toLearnCache = {};
        this.learnedCorrect = {};
        this.nerDict = null;
    }

    confirmSentenceLearned(key, ok) {
        let toLearnObj = this.toLearnCache[key];
        let { sentence, intent } = toLearnObj;

        return this.learnSentence(sentence, intent, ok)
            .then(() => {
                delete this.toLearnCache[key];

                return toLearnObj;
            });
    }

    getSentenceToLearn(key) {
        return this.toLearnCache[key];
    }

    addSentenceToLearn(sentence, intent) {
        let key = uuid();
        this.toLearnCache[key] = { sentence, intent };

        return key;
    }

    learnSentence(sentence, intent, ok) {
        let allPromise = [];

        this.learnedCorrect[sentence] = intent;
        allPromise.push(saveIntent(sentence, intent, ok));

        if (ok) {
            if (intent.entities) {
                for (let type in intent.entities) {
                    let value = intent.entities[type];

                    if (value) {
                        let entity = {};
                        entity[type] = value;
                        let entIntent = { intent: type, entities: entity };
                        allPromise.push(saveIntent(value, entIntent, true));
                        allPromise.push(saveEntity({ type, value }));
                    }
                }
            }
        }

        return Promise.all(allPromise);
    }

    evaluateSentence(sentence) {
        if (this.learnedCorrect[sentence]) {
            return Promise.resolve(this.learnedCorrect[sentence]);
        }

        return getIntent(sentence)
            .then(intent => {
                if (!intent) {
                    console.log('Not intent from sentence matching.');
                    return this.detectIntent(sentence);
                }
                return intent;
            });
    }

    detectIntent(sentence) {
        let p = Promise.resolve();

        if (!this.nerDict) {
            p = buidNerDict()
                .then(nerDict => {
                    this.nerDict = nerDict;
                });
        }

        p = p.then(() => {
            let { phrases, tags } = this.nerDict.tag(sentence);

            let { normalized, entities } = buildPhrasesAndTags(phrases, tags);

            if(normalized){
                return client.detectIntent(normalized)
                .then(intentObj => {
                    if(intentObj){
                        return {intent:intentObj.intent, entities};
                    }
                    return {intent:'unknown', entities};
                });
            }

            return {intent:'unknown', entities};
        });

        return p;

    }

    getLearnedEntity(sentence) {
        return client.getEntity(sentence);
    }

    normalize(sentence, intent) {
        return normalize(sentence, intent);
    }
}

const buildPhrasesAndTags = (phrases, tags) => {
    let normalized = '';
    let entities = {};
    if (phrases && phrases.length && tags && tags.length) {
        for (let i = 0; i < phrases.length; i++) {
            let phrase = phrases[i];
            let tag = tags[i];

            if (tag) {
                normalized += tag;
                entities[tag] = phrase;
            } else {
                normalized += phrase;
            }
        }
    }

    return {normalized, entities};
};

const getIntent = (sentence) => {
    return client.getIntent(sentence);
};

const saveIntent = (sentence, intent, correct) => {
    let normalizedSentence = normalize(sentence, intent);

    return client.saveIntent(sentence, normalizedSentence, intent, correct);
};

const saveEntity = (entity) => {
    return client.saveEntity(entity);
};

const buidNerDict = () => {
    return client.getAllEntities()
        .then(entities => {
            return new NerDict(entities);
        });
};

const getEntities = (entities) => {
    if (entities) {
        let results = [];
        for (let k in entities) {
            let v = entities[k];

            if (v) {
                results.push({ type: k, value: v });
            }
        }

        return results;
    }
};

const normalize = (sentence, intent) => {
    let { entities } = intent;

    if (entities) {
        for (let type in entities) {
            let value = entities[type];

            sentence = sentence.replace(value, type);
        }
    }

    return sentence;
};

module.exports = Learn;