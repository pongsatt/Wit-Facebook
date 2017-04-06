'use strict';

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
      });
  }
}

module.exports = Bot;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  const interactive = require('./interactive');

  console.log("Bot testing mode.");
  var bot = new Bot();

  interactive((command) => {
    return bot.message(command, {})
    .then(res => {
      return res.onResponse(response => {
        console.log('Response: ', response);
        return Promise.resolve();
      });
    });
  });

}