const uuid = require('uuid/v1');
// const MongoClient = require('../mongo/client');
const client = require('../es/learn');

class Learn {
    constructor() {
        // this.mgClient = new MongoClient();
        this.toLearnCache = {};
        this.learnedCorrect = {};
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
            let entities = getEntities(intent.entities);
            if (entities && entities.length) {
                entities.forEach(ent => {
                    allPromise.push(saveEntity(ent));
                });
            }
        }

        return Promise.all(allPromise);
    }

    evaluateSentence(sentence) {
        if(this.learnedCorrect[sentence]){
            return Promise.resolve(this.learnedCorrect[sentence]);
        }

        return getIntent(sentence);
    }
}

const getIntent = (sentence) => {
    return client.getIntent(sentence);
};

const saveIntent = (sentence, intent, correct) => {
    return client.saveIntent(sentence, intent, correct);
};

const saveEntity = (entity) => {
    return client.saveEntity(entity);
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

module.exports = Learn;