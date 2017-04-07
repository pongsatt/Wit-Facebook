const IntentResolver = require('../../resolver/intentResolver');
var assert = require('assert');

var resolver = new IntentResolver();

describe('IntentResolver', function() {
  describe('save context', function() {
    it('should save context when resolved', function(done) {
        let context = {sessionId:1};
        return resolver.resolve('กินไรดี', context)
        .then(results => {
            return resolver.resolve('ไม่เอา', context);
        });
    });
  });
});