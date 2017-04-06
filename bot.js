'use strict';

const FB = require('./facebook.js');
const Config = require('./const.js');

const IntentResolver = require('./intentResolver');
const ResponseResolver = require('./responseResolver');

class Bot {
  constructor() {
    this.intentResolver = new IntentResolver();
    this.responseResolver = new ResponseResolver();
  }

  message(msg, context) {
    return this.intentResolver.resolve(msg, context)
      .then((intentObj) => {
        const { intent, entities } = intentObj;
        return this.responseResolver.resolve(intent, entities, context)
        .onResponse(response => {
          if(typeof response == 'string'){
            return fbTextSend(response, context);
          }else{
            return fbSend(response, context);
          }
        });
      });
  }
}

const fbTextSend = (text, context) => {
  return fbSend({ text }, context);
}

const fbSend = (msg, context) => {
  console.log('Try sending msg to facebook.', JSON.stringify(msg));

  const recipientId = context._fbid_;
  if (recipientId) {
    return FB.fbMessage(recipientId, msg);
  }

  return Promise.resolve();
}

module.exports = Bot;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  const interactive = require('./interactive');

  console.log("Bot testing mode.");
  var bot = new Bot();

  interactive((command) => {
    return bot.message(command, {});
  });

}