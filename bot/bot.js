'use strict';

const IntentResolver = require('../resolver/intentResolver');
const Recognizer = require('../nlp/recognizer');
const GreetConversation = require('../conversation/greeting');
const RestaurantConversation = require('../conversation/restaurant');
const WordConversation = require('../conversation/word');
const NotUnderstand = require('../conversation/notunderstand');

class Bot {
  constructor() {
    this.intentResolver = new IntentResolver();
    this.recognizer = new Recognizer();
    this.conversations = {};
    this.contexts = {};
  }

  message(msg, context) {
    return this.recognizer.recognize(msg)
      .then(({ intent, entities }) => {
        console.log('Found intent: ', JSON.stringify({ intent, entities }));
        let conv = this.getOrCreateConversation(intent, context);
        // console.log('Got Conversion: ', conv);

        return {
          onResponse(response) {
            return conv.response(intent, entities, response);
          }
        }
      });
  }

  getOrCreateConversation(intent, context) {
    const { sessionId } = context;

    if (!sessionId) {
      throw new Error('No sessionId found');
    }

    let existingConv = this.conversations[sessionId];
    if (!existingConv || existingConv.ended) {
      context = Object.assign({}, context, this.contexts[sessionId]);
      this.conversations[sessionId] = buildConversation(intent, context);
    }

    return this.conversations[sessionId];
  }
}

const buildConversation = (intent, context) => {
  if (intent.startsWith('greet_')) {
    return new GreetConversation(context);
  } else if (intent.startsWith('res_')) {
    return new RestaurantConversation(context);
  } else if (intent.startsWith('word_')) {
    return new WordConversation(context);
  }

  return new NotUnderstand(context);
}

module.exports = Bot;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  const interactive = require('../utils/interactive');

  console.log("Bot testing mode.");
  var bot = new Bot();

  interactive((command) => {
    let context = { sessionId: 1 };
    return bot.message(command, context)
      .then(res => {
        return res.onResponse(response => {
          console.log('Response: ', response);
          return Promise.resolve();
        });
      });
  });

}