const api = require('../api/estaurantapi');

class RestaurantConversation {
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
        case 'pickone':
            return onPick(
                {
                    first: "ไม่รู้จะกินอะไรใช่มะ เดี๋ยวหาร้านแถวนี้ให้ รอแป๊บหนึ่งนะ",
                    last: "ลองดูร้านนี้เป็นยังไง",
                    error: "ขอโทษที ไม่พบร้านแถวนี้เลย"
                },
                { recommended: true, size: 1, timeOfDay: '' },
                response);
        case 'picknewone':
            return onPick(
                {
                    first: "โอเค งั้นลองใหม่ แป๊บนะ",
                    last: "ลองดูร้านนี้เป็นยังไง",
                    error: "ขอโทษที ไม่พบร้านแถวนี้เลย"
                },
                { recommended: true, size: 1, timeOfDay: '' },
                response);
        case 'ask_name':
            let { lang } = entities;
            if (lang === 'th') {
                return response('สวัสดี คุณชื่ออะไร');
            } else {
                return response('Hi! what is your name?');
            }
    }

    return response(`ไม่เข้าใจอะ ไม่รู้จะหาร้านอะไรให้ดี`);
}

const onPick = (responses, query, response) => {
    return response(responses.first)
        .then(() => api.pickOne(query))
        .then((ress) => {
            if (responses.last) {
                return response(responses.last)
                    .then(() => ress);
            }
            return ress;
        })
        .then((ress) => {
            if (!ress.hits.total) return response(responses.error || `ขอโทษที หาร้านที่ต้องการไม่เจอ ลองถามใหม่นะ`);

            return Promise.all(ress.hits.hits.map(r => {
                return response(toCard(r._source));
            }));
        });
}

const onSearch = (responses, query, response) => {
    return response(responses.first)
        .then(() => api.search(query))
        .then((ress) => {
            if (responses.last) {
                return response(responses.last)
                    .then(() => ress);
            }
            return ress;
        })
        .then((ress) => {
            if (!ress.hits.total) return response(responses.error || `ขอโทษที หาร้านที่ต้องการไม่เจอ ลองถามใหม่นะ`);

            return Promise.all(ress.hits.hits.map(r => {
                return response(toCard(r._source));
            }));
        });
}

const nextAction = (intent, status) => {
    if (intent == 'res_any') {
        return 'pickone';
    } else if (intent == 'reject' && status == 'wait_answer') {
        return 'picknewone'
    }
}

const nextStatus = (action, status) => {
    switch (action) {
        case 'pickone':
        case 'picknewone':
            return 'wait_answer';
    }
}

const toCard = (res) => {
    let desc = `${res.cuisine}`
    let menus = res.menus && res.menus.join(',');
    if (menus) desc += ` เมนูแนะนำ ${menus}`;

    let lon = res.geo.location[0];
    let lat = res.geo.location[1];

    let url = `https://www.wongnai.com/${res.original_id}`;
    let map = `http://maps.google.com/maps?q=${lat},${lon}`;
    let card = {
        title: res.name,
        subtitle: desc,
        image_url: res.image,
        url: url,
        buttons: [
            { title: 'Open', url: url },
            { title: 'Location', url: map }
        ]
    }

    return card;
}

module.exports = RestaurantConversation;