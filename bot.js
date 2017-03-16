'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const {Wit, interactive} = require('node-wit');
const FB = require('./facebook.js');
const Config = require('./const.js');
const accessToken = Config.WIT_TOKEN;

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

// Bot actions
const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;

    console.log('sending...', JSON.stringify(response));


    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to from context
    // TODO: need to get Facebook user name
    // const recipientId = context._fbid_;
    // if (recipientId) {
    //   // Yay, we found our recipient!
    //   // Let's forward our bot response to her.
    //   FB.fbMessage(recipientId, message, (err, data) => {
    //     if (err) {
    //       console.log(
    //         'Oops! An error occurred while forwarding the response to',
    //         recipientId,
    //         ':',
    //         err
    //       );
    //     }

    //   });
    // } else {
    //   console.log('Oops! Couldn\'t find user in context:', context);
    // }
  },
  getForecast({context, entities}) {
    var location = firstEntityValue(entities, 'location');
    if (location) {
      context.forecast = 'sunny in ' + location; // we should call a weather API here
      delete context.missingLocation;
    } else {
      context.missingLocation = true;
      delete context.forecast;
    }
    return context;
  },

};


const getWit = () => {
  return new Wit({accessToken, actions});
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  interactive(client);
}