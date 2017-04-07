const Config = require('../config/const.js');
const WitIntentResolver = require('../resolver/WitIntentResolver');
const RestaurantIntentResolver = require('../resolver/RestaurantIntentResolver');
const cld = require('cld');

class IntentResolver {
  constructor() {
    this.witIntentResolver = new WitIntentResolver();
    this.restaurantIntentResolver = new RestaurantIntentResolver();
  }

  resolve(msg, context) {
    return getLang(msg)
    .then(lang => {
      context = context || {};
      context.lang = context.lang || lang;

      if(lang == 'th'){
        return this.restaurantIntentResolver.resolve(msg, context);
      }

      return this.witIntentResolver.resolve(msg, context);
    });
  }
}

const getLang = (msg) => {
  return new Promise((resolve, reject) => {
    cld.detect(msg, function (err, result) {
      console.log('Msg lang: ', result);

      if(result && result.languages && result.languages.length){
        return resolve(result.languages[0].code);
      }
      return resolve('');
    });
  });
}

module.exports = IntentResolver;