var wordcut = require("thai-wordcut");
var stopwords = require('./stopword_th');

class Thai {
    constructor(){
        wordcut.init(__dirname  + '/customdict.txt', true);
    }

    tokenize(str) {
        return tokenize(str);
    }

    clean(str){
        return removeStopsWord(tokenize(removeSymbol(str))).join('');
    }
}

const removeSymbol = (str) => {
    return str.replace(/ๆ/g, '');
};

const tokenize = (str) => {
    return wordcut.cutIntoArray(str);
};

const removeStopsWord = (arr) => {
    let results = [];

    for(let a of arr){
        if(stopwords.indexOf(a) == -1) results.push(a);
    }

    return results;
};

if (require.main === module) {
    let thai = new Thai();
    console.log(thai.clean('อยากกินอะไรอร่อยๆ แถวๆ นี้'));
}

module.exports = Thai;