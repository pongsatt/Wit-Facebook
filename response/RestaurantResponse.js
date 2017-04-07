const api = require('../api/estaurantapi');

const onResponse = (intent, entities, context, response) => {
    switch (intent) {
        case 'res_any':
            return onPick(
                "ไม่รู้จะกินอะไรใช่มะ เดี๋ยวหาร้านแถวนี้ให้ รอแป๊บหนึ่งนะ",
                { recommended: true, size: 2, timeOfDay: '' },
                context, response,
                "ลองดูร้านนี้เป็นยังไง",
                "ขอโทษที ไม่พบร้านแถวนี้เลย");
        case 'res_any_again':
            return onPick(
                "โอเค งั้นลองร้านใหม่ รอแป๊บหนึ่งนะ",
                { recommended: true, size: 2, timeOfDay: '' },
                context, response,
                "ลองดูร้านนี้เป็นยังไง",
                "ขอโทษที ไม่พบร้านแถวนี้เลย");
        case 'res_type':
            var { type } = entities;
            return onSearch(
                `อยากกินอาหาร${type}ใช่เปล่า รอเดี๋ยวนะ`,
                { type, size: 2, timeOfDay: '' },
                context, response);
        case 'res_near_type':
            var { type, near } = entities;
            return onSearch(
                `อยากกินอาหาร${type}ที่อยู่แถวนี้เหรอ รอเดี๋ยวนะ`,
                { type, size: 1, maxDistance: near, timeOfDay: '' },
                context, response);
        case 'res_food':
            return onFood(entities, context, response);
    }

    return onUnknown(context, response);
}

const onFood = (entities, context, response) => {
    let { food } = entities;

    return onSearch(`อยากกิน ${food} เหรอ รอแป๊บหนึ่ง`,
        { food, timeOfDay: '', size: 2 },
        context, response);
}

const onPick = (firstResponse, searchQ, context, response, lastResponse, errorResponse) => {
    return response(firstResponse)
        .then(() => api.pickOne(searchQ))
        .then((ress) => {
            if (lastResponse) {
                return response(lastResponse)
                    .then(() => ress);
            }
            return ress;
        })
        .then((ress) => {
            if (!ress.hits.total) return response(errorResponse || `ขอโทษที หาร้านที่ต้องการไม่เจอ ลองถามใหม่นะ`);

            return Promise.all(ress.hits.hits.map(r => {
                return response(toCard(r._source));
            }));
        });
}

const onSearch = (firstResponse, searchQ, context, response, lastResponse, errorResponse) => {
    return response(firstResponse)
        .then(() => api.search(searchQ))
        .then((ress) => {
            if (lastResponse) {
                return response(lastResponse)
                    .then(() => ress);
            }
            return ress;
        })
        .then((ress) => {
            if (!ress.hits.total) return response(errorResponse || `ขอโทษที หาร้านที่ต้องการไม่เจอ ลองถามใหม่นะ`);

            return Promise.all(ress.hits.hits.map(r => {
                return response(toCard(r._source));
            }));
        });
}

const onUnknown = (context, response) => {
    console.log('Unknown intent');
    return response("ผมไม่แน่ใจนะ แต่คุณอาจจะชอบร้านนี้ก็ได้ รอสักครู่")
        .then(() => {
            return api.pickOne().then(res => response(toCard(res.hits.hits[0]._source)));
        });
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

module.exports = {
    onResponse,
    onSearch,
    onUnknown,
    onFood
}