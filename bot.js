'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const { Wit, interactive } = require('node-wit');
const FB = require('./facebook.js');
const Config = require('./const.js');
const WordApi = require('./wordapi.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

const fbTextSend = (text, context) => {
  fbSend({text}, context);
}

const fbSend = (msg, context) => {
  console.log('Sending msg to facebook.', msg);

  const recipientId = context._fbid_;
  if (recipientId) {
    // Yay, we found our recipient!
    // Let's forward our bot response to her.
    FB.fbMessage(recipientId, msg, (err, data) => {
      if (err) {
        console.log(
          'Oops! An error occurred while forwarding the response to',
          recipientId,
          ':',
          err
        );
      }

    });
  }
}

// Bot actions
const actions = {
  send(request, response) {
    const { sessionId, context, entities } = request;
    const { text, quickreplies } = response;

    console.log('sending...', JSON.stringify(response));

    fbTextSend(text, context);
  },
  getForecast({ context, entities }) {
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
  getMeaning({ context, entities }) {
    return new Promise((resolve, reject) => {
      var word = firstEntityValue(entities, 'word');

      return WordApi.getWords(word, function (error, words) {
        console.log("Get words is done.", words);
        if (words && words.length) {
          context.meaning = word + ' means ' + words[0].definitions[words[0].groups[0]][0];
          delete context.missingWord;
        } else {
          context.missingWord = true;
          delete context.meaning;
        }
        return resolve(context);
      });
    });

  },

};


const getWit = () => {
  return new Wit({ accessToken, actions });
};

const testWord = {
  groups: ['noun'],
  definitions: {
    noun: [
      'line1',
      'line2'
    ]
  }
}

const buildCard = (title, subtitle) => {
  return {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": title,
          "subtitle": subtitle,
        }]
      }
    }
  }
}

const buildAudio = (url) => {
  return {
    "attachment": {
      "type": "audio",
      "payload": {
        "url": url
      }
    }
  }
}

const witMessage = (client, msg, context) => {
  return client.message(msg, { context })
    .then((data) => {
      console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
      const { entities } = data;
      const { intent } = entities;

      let intentValue = intent[0].value;
      let word = firstEntityValue(entities, 'word');

      switch(intentValue){
        case 'word_meaning':
          // return onMeaning(word);
          let w = testWord;
          let text = wordFormat(w);

          return fbTextSend(text, context);
        case 'word_pronounce':
          return onPronounce(word);
      }
    })
    .catch(console.error);
}

const wordFormat = (word) => {
  let text = '';

  for(var g=0; g<word.groups.length; g++){
    let group = word.groups[g];
    let definitions = word.definitions[group];

    text+=group + '\n';

    for(var d=0; d<definitions.length; d++){
      let def = definitions[d];

      text+='   ' + def + '\n';
    }
  }

  return text;
}

const onMeaning = (word) => {
  return WordApi.getWords(word, function (error, words) {
    console.log("Get words is done.", words);

    if(words && words.length){
      let w = words[0];
      let text = wordFormat(w);

      return fbSend(text, context);
    }

  });
}

const onPronounce = (word) => {
  let msg = buildAudio("http://dictionary.cambridge.org/media/english/uk_pron/u/ukv/ukvor/ukvorte027.mp3");

  return fbSend(msg, context);
}

const onMessage = (client, msg, context) => {
  return witMessage(client, msg, context);
}

module.exports = {
  getWit: getWit,
  onMessage: onMessage
}

const rlInteractive = (client) => {
  rl.setPrompt('> ');
  const prompt = () => {
    rl.prompt();
    rl.write(null, { ctrl: true, name: 'e' });
  };
  prompt();
  rl.on('line', (line) => {
    line = line.trim();
    if (!line) {
      return prompt();
    }
    console.log(line);
    witMessage(client, line, {});
  });
}

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  // interactive(client);
  rlInteractive(client);

}