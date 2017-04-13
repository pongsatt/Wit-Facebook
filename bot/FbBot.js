'use strict';

const FB = require('../api/facebook.js');
const Config = require('../config/const.js');
const Bot = require('../bot/bot');

class FBBot {
    constructor() {
        this.bot = new Bot();
    }

    message(msg, context, learning) {
        return this.bot.message(msg, context, learning)
            .then(onResponse => {
                return onResponse(response => {
                    if (typeof response == 'string') {
                        return fbTextSend(response, context);
                    } else if (response.audio) {
                        return fbSend(buildAudio(response.url), context);
                    } else if (response.buttons) {
                        return fbSend(buildbuttonsTemplate(response), context);
                    } else {
                        return fbSend(buildCards(response), context);
                    }
                });
            })
            .catch(error => {
                console.error(error);
                return fbTextSend("Sorry, something wrong with me. Please try something else.", context);
            });
    }

    postback(payload){
        return this.bot.postback(payload);
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

const buildCards = (cards) => {
    let elements = buildElement(cards);

    return buildGenericTemplate(elements);
};

const buildElement = (cards) => {
    let elements = [];

    for (let card of cards) {
        let { title, subtitle, image_url, url, buttons } = card;

        let element = {
            title,
            subtitle
        };

        if (image_url) element.image_url = image_url;
        if (url) {
            element.default_action = {
                type: 'web_url',
                url: url
            };
        }

        if (buttons && buttons.length) {
            element.buttons = buildbuttons(buttons);
        }

        elements.push(element);
    }

    return elements;
}

const buildGenericTemplate = (elements) => {
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
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
    };
};

const buildbuttonsTemplate = ({ text, buttons }) => {
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": text,
                "buttons": buildbuttons(buttons)
            }
        }
    };
};

const buildbuttons = (buttons) => {
    return buttons.map(b => {
        if (b.url) {
            return {
                type: 'web_url',
                title: b.title,
                url: b.url
            };
        } else {
            return {
                type: 'postback',
                title: b.title,
                payload: b.payload
            };
        }

    });
};

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
    const interactive = require('../utils/interactive');

    console.log("FBBot testing mode.");
    var bot = new FBBot();

    interactive((command) => {
        return bot.message(command, { sessionId: 1 });
    });

}