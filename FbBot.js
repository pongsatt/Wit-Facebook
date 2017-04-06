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
                    } else if (Array.isArray(response)) {
                        return fbSend(buildList(response), context);
                    } else if (response.audio) {
                        return fbSend(buildAudio(response.url), context);
                    } else {
                        return fbSend(response, context);
                    }
                })
            }, (error) => fbTextSend("Sorry, we did something wrong. Please try something else.", context));
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

const buildCard = ({ title, subtitle, image_url, url, buttons }) => {
    let element = {
        title,
        subtitle
    };

    if(image_url) element.image_url = image_url;
    if(url){
        element.default_action = {
            type: 'web_url',
            url: url
        }
    }

    if(buttons && buttons.length){
        element.buttons = buttons.map( b => {
            return {
                type: 'web_url',
                title: b.title,
                url: b.url
            };
        });
    }

    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    element
                ]
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