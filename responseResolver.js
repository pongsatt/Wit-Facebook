const WordApi = require('./wordapi.js');

class ResponseResolver {
    constructor() {
    }

    resolve(intent, entities, context) {
        return getResponse(intent, entities, context);
    }
}

const getResponse = (intent, entities, context) => {
    let entitiesStr = JSON.stringify(entities);

    console.log(`Found intent ${intent} and entities ${entitiesStr}`);

    return {
        onResponse(response) {
            switch (intent) {
                case 'word_meaning':
                    return onMeaning(entities, context, response);
                case 'word_pronounce':
                    return onPronounce(entities, context, response);
            }
        }
    }
}

const getWord = (entities) => {
    const { word } = entities;

    if (!word) {
        return Promise.resolve();
    }

    return WordApi.getWords(word)
        .then(words => {
            if (words && words.length) {
                return words[0];
            }
            return Promise.resolve();
        });
}

const wordFormat = (word) => {
    let texts = [];

    for (var g = 0; g < word.groups.length; g++) {
        let text = '';

        let group = word.groups[g];
        let definitions = word.definitions[group];

        text += group + '\n';

        for (var d = 0; d < definitions.length; d++) {
            let def = definitions[d];

            text += '  - ' + def + '\n';
        }

        texts.push(text);
    }

    return texts;
}

const formatDefs = (defs) => {
    return defs.map(d => ` - ${d}`).join('\n');
}

const buildWordList = (word) => {
    let fbList = [];
    let defMap = word.definitions;

    for (var key in defMap) {
        if (defMap.hasOwnProperty(key)) {
            let defs = defMap[key];

            fbList.push({ title: key, subtitle: formatDefs(defs) });
        }
    }

    return buildList(fbList);
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

const buildList = (elements) => {
  return {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "list",
        "top_element_style": "compact",
        "elements": elements
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

const onMeaning = (entities, context, response) => {
    return getWord(entities)
        .then(word => {
            if (word) {
                return response(`Here is the meaning of word "${word.vocab}"`)
                    .then(() => {
                        let fbList = buildWordList(word);
                        return response(fbList);
                    });
            }

            return response("Which word do you mean exactly?");
        });
}

const pronounce = (word, context, country, response) => {
    return response(`Here is how to pronounce "${word.vocab}" in ${country}`)
        .then(() => {
            let msg = buildAudio(word.pronunciationAudios[country]);

            return response(msg);
        });

}

const onPronounce = (entities, context, response) => {
    return getWord(entities, response)
        .then(word => {
            if (word.pronunciationAudios) {
                return pronounce(word, context, "us", response)
                    .then(() => {
                        return pronounce(word, context, "uk", response);
                    });
            }

            return response("Cannot find pronounciation for this word");
        });
}

module.exports = ResponseResolver;