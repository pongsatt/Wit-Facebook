const Config = require('./const.js');
const cld = require('cld');
const resolveIntentWit = require('./WitIntentResolver');
const resolveIntentThai = require('./ThaiIntentResolver');
const { Wit } = require('node-wit');

class IntentResolver {
  constructor() {
    this.witClient = new Wit({ accessToken: Config.WIT_TOKEN });
  }

  resolve(msg, context) {
    return getLang(msg)
    .then(lang => {
      if(lang == 'th'){
        return resolveIntentThai(msg, context);
      }

      return resolveIntentWit(msg, context, this.witClient);
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