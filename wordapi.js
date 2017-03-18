'use strict';

var request = require('request');
var Config = require('./const.js');

const getWords = (word, fn) => {
    console.log('Getting word:', word)

    if(!word){
        return fn(new Error('Word not defined.'));
    }

    var url = Config.WORD_API_URL + '/vocabs/search?group=true&q=' + word;
    request({ url: url, json: true, headers: { 'X-User': 'bd628cda-50a9-afa0-c90f-28f834931fe8' } }, function (error, response, data) {
        if (error) {
            console.error(error);
            return fn(error)
        }
        if (response.statusCode !== 200) {
            console.error(response.body);
            return fn(new Error('unexpected status ' + response.statusCode))
        }
        console.log('Data:', data);
        var words = data || [];
        fn(null, words)
    })
}

module.exports = {
    getWords: getWords
}