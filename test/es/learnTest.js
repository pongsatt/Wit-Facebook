const esLearn = require('../../es/learn');
var assert = require('chai').assert;

describe('ES Learn', function () {
    describe('Fuzzy search', function () {
        it('should search intent by sentence similarity', function () {
              let p = esLearn.saveIntent('อยากกินข้าวมันไก่', {intent: 'res_food', entities: {food: 'ข้าวมันไก่'}}, true);

            // let p = Promise.resolve();

            p = p.then(() => {
                return esLearn.getIntent('อยากกินข้าวมันไก่มากๆๆ');
            });

            p = p.then((results) => {
                assert.isDefined(results);
                assert.propertyVal(results[0].intent, 'intent', 'res_food');
                return results;
            });

            return p;

        });

        it('should search entity by type and value similarity', function () {
              let p = esLearn.saveEntity({type: 'food', value:'ข้าวมันไก่'});

            // let p = Promise.resolve();

            p = p.then(() => {
                return esLearn.getEntity('ข้าวมันไก่');
            });

            p = p.then((results) => {
                assert.isDefined(results);
                assert.propertyVal(results[0], 'type', 'food');
                return results;
            });

            return p;

        });


    });
});