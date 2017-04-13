const esLearn = require('../../es/learn');
var assert = require('chai').assert;

describe('ES Learn', function () {
    describe('Fuzzy search', function () {
        it('should search similarity', function () {
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
    });
});