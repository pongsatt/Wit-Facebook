const FBBot = require('../../bot/FbBot');

var bot = new FBBot();

var assert = require('assert');
describe('FbBot', function() {
  describe('res_any', function() {
    it('should pick recommended', function() {
        return bot.message('กินไรดี', {})
        then(results => {
            console.log(results);
            return results;
        });
    });
  });
});