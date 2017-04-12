'use strict';

const IntentResolver = require('../resolver/intentResolver');
const Recognizer = require('../nlp/recognizer');
const GreetConversation = require('../conversation/greeting');
const RestaurantConversation = require('../conversation/restaurant');
const WordConversation = require('../conversation/word');
const NotUnderstand = require('../conversation/notunderstand');
const Learn = require('../ml/learn');

class Bot {
  constructor() {
    this.intentResolver = new IntentResolver();
    this.recognizer = new Recognizer();
    this.learner = new Learn();
    this.conversations = {};
    this.contexts = {};
    this.topic = '';
    this.learn = true;
  }

  message(msg, context) {
    return this.recognizer.recognize(msg)
      .then(({ intent, entities }) => {
        console.log('Found intent: ', JSON.stringify({ intent, entities }));
        let conv = this.getOrCreateConversation(intent, context);
        // console.log('Got Conversion: ', conv);

        return (response) => {
            let p = conv.response(intent, entities, response);

            if(this.learn){
              p = p.then((c) => {
                let key = this.learner.addSentenceToLearn(msg, {intent, entities});
                return response(createConfirmButtons(key))
                .then(()=>c);
              });
            }

            return p;
          };
      });
  }

  postback(payload){
    console.log('payload: ', payload);

    const s = payload.split('|');
    const post = s[0];
    const key = s[1];
    this.learner.confirmSentenceLearned(key, post === 'yes');
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
      context = Object.assign({}, context, this.contexts[sessionId], {topic});
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
  }

  return previousTopic || 'unknown';
};

const createConfirmButtons = (key) => {
  return {
    text: 'Ok with result?',
    buttons: [
      {title: 'Yes', payload: 'yes|' + key},
      {title: 'No', payload: 'no|' + key}
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