const Thai = require('./thai');
const patterns = require('./reg_pattern');
const XRegExp = require('xregexp');
const cld = require('cld');

class Recognizer {
    constructor() {
        this.thai = new Thai();
    }

    recognize(str) {
        return this.lang(str)
            .then(lang => {
                let intent = this.intent(str, lang);
                return intent || {intent: 'unknown', entities: {lang, msg: str}};
            });
    }

    intent(str, lang) {
        str = this.clean(str, lang || 'th');
        return match(str, lang);
    }

    lang(str) {
        return getLang(str);
    }

    clean(str, lang) {
        if (lang == 'th') str = this.thai.clean(str);
        return str;
    }
}

const getLang = (msg) => {
    return new Promise((resolve, reject) => {
        cld.detect(msg, function (err, result) {

            if (result && result.languages && result.languages.length) {
                console.log('Msg lang: ', result.languages);
                return resolve(result.languages[0].code == 'th'?'th':'en');
            }
            return resolve('en');
        });
    });
}

const match = (str, strLang) => {
    for (let o of patterns) {
        const { lang, intent, p } = o;

        if (!lang || !strLang || strLang == lang) {
            let r = test(str, p);

            if (r) {
                let entities = getEntities(r);
                entities.lang = strLang;
                return { intent, entities };
            }
        }

    }

}

const test = (str, p) => {
    var regex = XRegExp(p, 'i');
    var parts = XRegExp.exec(str, regex);

    return parts && parts.length && parts;
}

const getEntities = (r) => {
    let entities = {};

    for (let n in r) {
        if (isNaN(+n) && n != 'index' && n != 'input') {
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