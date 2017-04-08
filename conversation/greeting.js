class GreetConversation {
    constructor(context) {
        this.context = context;
        this.status = '';
    }

    response(intent, entities, response) {
        let action = nextAction(intent, this.status);

        return processAction(action, entities, response)
            .then(() => {
                this.status = nextStatus(action, this.status);
                this.ended = !this.status;
            });
    }

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