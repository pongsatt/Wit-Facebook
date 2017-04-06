'use strict';

const FB = require('./facebook.js');
const Config = require('./const.js');
const Bot = require('./bot');

class FBBot {
    constructor() {
        this.bot = new Bot();
    }

    message(msg, context) {
        return this.bot.message(msg, context)
            .then(res => {
                return res.onResponse(response => {
                    if (typeof response == 'string') {
                        return fbTextSend(response, context);
                    } else if(Array.isArray(response)){
                        return fbSend(buildList(response), context);
                    } else if(response.audio){
                        return fbSend( buildAudio(response.url), context);
                    } else {
                        return fbSend(response, context);
                    }
                })
            });
    }
}

const fbTextSend = (text, context) => {
    return fbSend({ text }, context);
}

const fbSend = (msg, context) => {
    console.log('Try sending msg to facebook.', JSON.stringify(msg));

    const recipientId = context._fbid_;
    if (recipientId) {
        return FB.fbMessage(recipientId, msg);
    }

    return Promise.resolve();
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

module.exports = FBBot;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
    const interactive = require('./interactive');

    console.log("FBBot testing mode.");
    var bot = new FBBot();

    interactive((command) => {
        return bot.message(command, {});
    });

}