'use strict';

const Config = require('../config/const');

class CommandConversation {
    constructor(context) {
        this.context = context;
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
    let p;

    if(intent == 'cmd_enable_learn'){
        Config.LEARN_MODE = true;
        p = response(`learn mode has been enable`);
    }else if(intent == 'cmd_disable_learn'){
        Config.LEARN_MODE = false;
        p = response(`learn mode has been disable`);
    }

    context.status = 'ended';

    return p.then(() => context);
};

module.exports = CommandConversation;