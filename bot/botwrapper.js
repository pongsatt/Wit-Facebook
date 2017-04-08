'use strict';

const Bot = require('./bot');

class BotWrapper {
    constructor() {
        this.bot = new Bot();
    }

    message(msg, context) {
        return this.bot.message(msg, context)
            .then(res => {
                return res.onResponse(response => {
                    console.log('Response: ', response);
                        return Promise.resolve(response);
                    });
            });
    }
}

module.exports = BotWrapper;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
    const interactive = require('../utils/interactive');

    console.log("BotWrapper testing mode.");
    var bot = new BotWrapper();

    interactive((command) => {
        return bot.message(command, {sessionId:1});
    });

}