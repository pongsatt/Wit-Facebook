const Learn = require('../../ml/learn');
var assert = require('chai').assert;

var learn = new Learn();

describe('Learn', function () {
  describe('Learning process', function () {

    // it('should be able to learn', function () {
    //   let sentence = 'test sentence';
    //   let intent = { intent: 'test', entities: { key: 'test1' } };

    //   let key = learn.addSentenceToLearn(sentence, intent);
    //   assert.isDefined(key);

    //   let toLearn = learn.getSentenceToLearn(key);
    //   assert.isDefined(toLearn);

    //   let p = learn.evaluateSentence(sentence)
    //     .then(o => {
    //       assert.isUndefined(o);
    //       return Promise.resolve();
    //     });

    //   p = p.then(() => {
    //     return learn.confirmSentenceLearned(key, true)
    //       .then(confirmedLearn => {
    //         assert.equal(sentence, confirmedLearn.sentence);
    //         assert.equal(intent, confirmedLearn.intent);
    //         return Promise.resolve();
    //       });
    //   });

    //   p = p.then(() => {
    //     let toLearn = learn.getSentenceToLearn(key);
    //     assert.isUndefined(toLearn);
    //     return Promise.resolve();
    //   });

    //   p = p.then(() => {
    //     learn.evaluateSentence(sentence)
    //     .then(o => {
    //       assert.isDefined(o);
    //       return Promise.resolve();
    //     });
    //   });

    //   return p;
    // });

    // it('should nomalize sentence', function () {
    //   let sentence = 'อยากกินแกงกระหรี่แถวพร้อมพงษ์';
    //   let intentObj = { intent: 'res_food_where', entities: { food: 'แกงกระหรี่', where: 'พร้อมพงษ์' } };

    //   let normalizedSentence = learn.normalize(sentence, intentObj);

    //   assert.equal(normalizedSentence, 'อยากกินfoodแถวwhere');
    // });

    it('should detect intent', function () {
      return learn.detectIntent('อยากกินกระเพราแถวอโศก')
      .then(({intent, entities}) => {
        assert.equal(intent, 'res_food_where');
        assert.propertyVal(entities, 'where', 'อโศก');
      })
      .then(() => learn.detectIntent('อยากกินกระเพราแถวสยาม'));

    });


  });
});