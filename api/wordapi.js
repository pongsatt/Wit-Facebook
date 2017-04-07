'use strict';

var request = require('request-promise');
var Config = require('../config/const.js');

const getWords = (word, fn) => {
    console.log('Getting word:', word)

    if(!word){
        return fn(new Error('Word not defined.'));
    }

    var url = Config.WORD_API_URL + '/vocabs/search?group=true&q=' + word;
    console.log("Connecting to " + url);
    
    let opts = { url: url, json: true, headers: { 'X-User': 'bd628cda-50a9-afa0-c90f-28f834931fe8' } };

    return request(opts)
    .then((data) => {
        var words = data || [];
        console.log('Found words:', words.length);
        return words;
    })
    .catch(body => console.error(body));
}

module.exports = {
    getWords: getWords
}