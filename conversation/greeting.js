'use strict';

const Config = require('../config/const');
const myname = Config.BOT_NAME;

class GreetConversation {
    constructor(context) {
        this.context = context;
        this.context.status = '';
    }

    response(intent, entities, response) {
        this.context = Object.assign({}, this.context, entities);

        return doAction(intent, this.context, response)
            .then((newContext) => {
                this.context = newContext;
                let status = this.context.status;

                console.log('New status: ', newContext.status);
                this.ended = !status || status == 'ended';
                return Promise.resolve(this.context);
            });
    }

}

const doAction = (intent, context, response) => {
    let { name, lang, msg, status } = context;

    let p;

    if(intent == 'greet_normal' || intent == 'greet_me'){
        if(lang == 'th'){
            p = response(`สวัสดีครับ ผมชื่อ ${myname}`)
            .then(() => response(`ผมสามารถ ค้นหาร้านอาหารให้ได้นะ อยากกินอะไรละ`));
        }else{
            p = response(`Hi, my name is ${myname}`)
            .then(() => response(`I can help you search for restaurant or find meaning of word and pronunciation.`));
        }

        context.status = 'ended';
    }else if(intent == 'greet_pos'){
        if(lang == 'th'){
            p = response(`ขอบคุณครับ ที่ชม`)
        }else{
            p = response(`Thanks for your kindness`)
        }
    }else if(intent == 'greet_neg'){
        if(lang == 'th'){
            p = response(`เสียใจอะ`)
        }else{
            p = response(`Sorry, so sad`)
        }
    }

    return p.then(() => context, error => {
        context.status = 'ended';
        return context;
    });
}

const processAction = (action, entities, response) => {
    switch (action) {
        case 'say_name':
            let name = entities && entities.name || entities.msg || '';
            return response(`สวัสดี ${name}`);
        case 'ask_name':
            let { lang } = entities;
            if (lang === 'th') {
                return response('สวัสดี คุณชื่ออะไร');
            } else {
                return response('Hi! what is your name?');
            }
    }
}

const nextAction = (intent, status) => {
    if (status == 'wait_name') {
        return 'say_name';
    } else if (intent == 'greet_normal') {
        return 'ask_name';
    }
}

const nextStatus = (action, status) => {
    switch (action) {
        case 'ask_name':
            return 'wait_name';
    }
}

module.exports = GreetConversation;