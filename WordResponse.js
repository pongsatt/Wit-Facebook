const WordApi = require('./wordapi.js');

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
    let list = [];
    let defMap = word.definitions;

    for (var key in defMap) {
        if (defMap.hasOwnProperty(key)) {
            let defs = defMap[key];

            list.push({ title: key, subtitle: formatDefs(defs) });
        }
    }

    return list;
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
            let url = word.pronunciationAudios[country];
            return response({audio:true, url});
        });

}

const onPronounce = (entities, context, response) => {
    return getWord(entities, response)
        .then(word => {
            if (word && word.pronunciationAudios) {
                return pronounce(word, context, "us", response)
                    .then(() => {
                        return pronounce(word, context, "uk", response);
                    });
            }

            return response("Sorry, cannot find the pronounciation of this word.");
        });
}

module.exports = {
    onMeaning,
    onPronounce
}
