const mongoose = require('mongoose');
const Config = require('../config/const');
const {IncorrectIntent, CorrectIntent} = require('./intent');
const Entity = require('./entity');

class MongoClient {
    constructor() {
        mongoose.connect(Config.MONGO_URL);
    }

    getIntent(sentence) {
        let conditions = { sentence };

        return new Promise((resolve, reject) => {
            CorrectIntent.findOne(conditions, (error, doc) => {
                if(error){
                    console.error(error);
                    return reject(error);
                }
                return resolve(doc);
            });
        });

    }

    saveIntent(sentence, intent, correct) {
        let conditions = { sentence };
        let doc = { sentence, intent };
        let opts = { upsert: true };

        return new Promise((resolve, reject) => {
            let Intent = correct?CorrectIntent:IncorrectIntent;
            
            Intent.findOneAndUpdate(conditions, doc, opts, (error) => {
                if(error){
                    console.error(error);
                    return reject(error);
                }
                return resolve(doc);
            });
        });

    }

    getEntity(type, value) {
        let conditions = { type, value };

        return new Promise((resolve, reject) => {
            Entity.findOne(conditions, (error, doc) => {
                if(error){
                    console.error(error);
                    return reject(error);
                }
                return resolve(doc);
            });
        });

    }

    saveEntity(type, value) {
        let conditions = { type, value };
        let doc = { type, value };
        let opts = { upsert: true };

        return new Promise((resolve, reject) => {
            Entity.findOneAndUpdate(conditions, doc, opts, (error) => {
                if(error){
                    console.error(error);
                    return reject(error);
                }
                return resolve(doc);
            });
        });

    }
}

module.exports = MongoClient;