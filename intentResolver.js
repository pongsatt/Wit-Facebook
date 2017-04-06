const { Wit } = require('node-wit');
const Config = require('./const.js');

class IntentResolver {
  constructor() {
    this.witClient = new Wit({ accessToken: Config.WIT_TOKEN });
  }

  resolve(msg, context) {
    return resolveIntentWit(msg, context, this.witClient);
  }
}

const resolveIntentWit = (msg, context, witClient) => {
  return witClient.message(msg, { context })
    .then((data) => {
      const { entities } = data;
      const { intent } = entities;

      let intentValue;
      if (intent && intent.length) {
        intentValue = intent.length && intent[0].value;
      }
      let word = firstEntityValue(entities, 'word');

      return { intent: intentValue, entities: {word} };
    })
    .catch(console.error);
}

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

module.exports = IntentResolver;