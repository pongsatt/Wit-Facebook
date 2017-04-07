const Thai = require('./thai');
const patterns = require('./reg_pattern');
const XRegExp = require('xregexp');

class Recognizer {
    constructor(){
        this.thai = new Thai();
    }

    recognize(str){
        str = this.thai.clean(str);
        return match(str);
    }
}

const match = (str) => {
    for(let o of patterns){
        const {intent, p } = o;
        let r = test(str, p);

        if(r){
            let entities = getEntities(r);
            return {intent, entities};
        }
    }

}

const test = (str, p) => {
    var regex = XRegExp(p);
    var parts = XRegExp.exec(str, regex);

    return parts && parts.length && parts;
}

const getEntities = (r) => {
    let entities = {};

    for(n in r){
        if(n != 'index' && n != 'input'){
            entities[n] = r[n];
        }
    }

    return entities;
}

if (require.main === module) {
    let rec = new Recognizer();
    console.log(rec.recognize('อยากกินอะไรอร่อยๆแถวๆนี้'));
}

module.exports = Recognizer