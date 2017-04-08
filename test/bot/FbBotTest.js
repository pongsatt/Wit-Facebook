const FBBot = require('../../bot/FbBot');
const Bot = require('../../bot/botwrapper');
var assert = require('assert');

var bot = new Bot();

describe('FbBot', function () {
  describe('restaurant', function () {
    it('should start recommend dialog', function () {
      let context = { sessionId: 1 };

      let p = bot.message('กินไรดี', context);
      p = p.then(response => {
        return bot.message('ไม่เอา', context);
      });

      return p;
    });
  });

  // describe('greeting', function () {
  //   it('should start greeting dialog', function () {
  //     let context = { sessionId: 1 };

  //     let p = bot.message('สวัสดี', context)
  //     .then( (s) => {
  //       return bot.message('พงศ์', context)
  //     });

  //     return p;
  //   });
  // });

});