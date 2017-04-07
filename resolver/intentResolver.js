const Config = require('../config/const.js');
const WitIntentResolver = require('../resolver/WitIntentResolver');
const RestaurantIntentResolver = require('../resolver/RestaurantIntentResolver');
const cld = require('cld');

class IntentResolver {
  constructor() {
    this.witIntentResolver = new WitIntentResolver();
    this.restaurantIntentResolver = new RestaurantIntentResolver();
    this.conversation = {};
  }

  resolve(msg, context) {
    return getLang(msg)
    .then(lang => {
      context = getContext(context, this.conversation);

      context.lang = context.lang || lang;

      let intent;

      if(lang == 'th'){
        intent = this.restaurantIntentResolver.resolve(msg, context);
      }else{
        intent = this.witIntentResolver.resolve(msg, context);
      }

      console.log('Resolved intent: ', intent);

      context.lastIntent = intent;
      this.conversation[context.sessionId] = context;
      return intent;
    });
  }
}

const getContext = (context, conversation) => {
  context = context || {};

  let { sessionId } = context;

  if(!sessionId) return context;
  
  return Object.assign({}, context, conversation[sessionId] || {sessionId});
}

const getLang = (msg) => {
  return new Promise((resolve, reject) => {
    cld.detect(msg, function (err, result) {

      if(result && result.languages && result.languages.length){
        console.log('Msg lang: ', result.languages);
        return resolve(result.languages[0].code);
      }
      return resolve('');
    });
  });
}

module.exports = IntentResolver;