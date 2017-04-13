'use strict';

const Recognizer = require('../nlp/recognizer');
const GreetConversation = require('../conversation/greeting');
const RestaurantConversation = require('../conversation/restaurant');
const WordConversation = require('../conversation/word');
const NotUnderstand = require('../conversation/notunderstand');
const CommandConversation = require('../conversation/command');
const Learn = require('../ml/learn');

class Bot {
  constructor() {
    this.recognizer = new Recognizer();
    this.learner = new Learn();
    this.conversations = {};
    this.contexts = {};
    this.topic = '';
  }

  message(msg, context, learning) {
    let p = this.learner.evaluateSentence(msg);
    
    p = p.then((intent) => {
      if(!intent){
        console.log('No intent from learner. Use rule base.');
        return this.recognizer.recognize(msg);
      }

      console.log('Found intent from learner');
      return {intent: intent.intent, entities: intent.entities, learned: true};
    });

    p = p.then(({ intent, entities, learned }) => {
      
      console.log('Found intent: ', JSON.stringify({ intent, entities }));
      let conv = this.getOrCreateConversation(intent, context);
      // console.log('Got Conversion: ', conv);

      return Promise.resolve({ intent, entities, conv, learned });
    });

    p = p.then(({ intent, entities, conv, learned }) => {
      return (response) => {
        let p1 = conv.response(intent, entities, response);

        if (learning === true && !learned) {
          console.log('In learning mode.');

          p1 = p1.then((c) => {
            let key = this.learner.addSentenceToLearn(msg, { intent, entities });
            c.learning = true;
            c.key = key;
            return response(createConfirmButtons(key))
              .then(() => c);
          });
        }

        return p1;
      };
    });

    return p;
  }

  postback(payload) {
    console.log('payload: ', payload);

    const s = payload.split('|');
    const post = s[0];
    const key = s[1];
    return this.learner.confirmSentenceLearned(key, post === 'yes');
  }

  getOrCreateConversation(intent, context) {
    const { sessionId } = context;

    if (!sessionId) {
      throw new Error('No sessionId found');
    }

    let topic = getTopic(intent, context, this.topic);
    let topicChanged = this.topic != topic;
    this.topic = topic;

    console.log('Topic: ', topic, ' Changed: ', topicChanged);

    let existingConv = this.conversations[sessionId];
    if (!existingConv || existingConv.ended || topicChanged) {
      context = Object.assign({}, context, this.contexts[sessionId], { topic });
      this.conversations[sessionId] = buildConversation(topic, intent, context);
    }

    return this.conversations[sessionId];
  }
}

const buildConversation = (topic, intent, context) => {
  switch (topic) {
    case 'greeting':
      return new GreetConversation(context);
    case 'restaurant_search':
      return new RestaurantConversation(context);
    case 'word_search':
      return new WordConversation(context);
    case 'command':
      return new CommandConversation(context);
    default:
      return new NotUnderstand(context);

  }
}

const getTopic = (intent, context, previousTopic) => {
  if (intent.startsWith('greet_')) {
    return 'greeting';
  } else if (intent.startsWith('res_')) {
    return 'restaurant_search';
  } else if (intent.startsWith('word_')) {
    return 'word_search';
  } else if (intent.startsWith('cmd_')) {
    return 'command';
  }

  return previousTopic || 'unknown';
};

const createConfirmButtons = (key) => {
  return {
    text: 'Ok with result?',
    buttons: [
      { title: 'Yes', payload: 'yes|' + key },
      { title: 'No', payload: 'no|' + key }
    ]
  };
};

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
      .then(onResponse => {
        return onResponse(response => {
          console.log('Response: ', response);
          return Promise.resolve();
        });
      });
  });

}