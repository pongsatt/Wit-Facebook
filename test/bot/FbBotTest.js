const FBBot = require('../../bot/FbBot');

var bot = new FBBot();

var assert = require('assert');
describe('FbBot', function () {
  describe('res_any', function () {
    it('should pick recommended', function () {
      let context = { sessionId: 1 };

      let p = bot.message('กินไรดี', context);
      p = p.then(results => bot.message('ไม่เอา', context));

      return p;
    });
  });
});