const api = require('../api/estaurantapi');
const Config = require('../config/const');

class RestaurantConversation {
    constructor(context) {
        this.context = context;
        this.context.status = '';
    }

    response(intent, entities, response) {
        this.context = newContext(intent, entities, this.context);

        return doAction(intent, this.context, response)
            .then((newContext) => {
                this.context = newContext;
                let status = this.context.status;

                console.log('New status: ', newContext.status);
                this.ended = !status || status == 'ended';
                return Promise.resolve(this.context);
            });
    }

    response1(intent, entities, response) {
        this.context = getCurrentContext(entities, this.context);

        this.context = nextAction(intent, this.context);

        let action = this.context.action;

        return processAction(action, this.context, response)
            .then((newStatus) => {
                console.log('New status: ', newStatus);
                this.context = nextState(action, this.context, newStatus);

                let status = this.context.status;

                this.ended = !status || status == 'ended';
                return Promise.resolve(this.context);
            });
    }

}

const doAction = (intent, context, response) => {
    //start preparation
    let p;

    if (!p && intent == 'res_great') {
        p = response('อยากกินอะไรละ');
        context.status = 'ended'
    }

    if (!p && intent == 'res_cancel') {
        p = response('ขอบคุณครับ');
        context.status = 'ended'
    }

    if (!p && intent == 'res_exp') {
        context.maxPrice = 100;
        context.minPrice = 0;
    }

    if (!p && intent == 'res_cheap') {
        context.maxPrice = 1000;
        context.minPrice = 500;
    }

    if (!p && intent == 'res_near') {
        context.where = null;
        context.location = Config.DEFAULT_LOCATION;
    }

    if (!p && intent == 'res_location') {
        context.where = null;
        context.location = {lat: parseFloat(context.lat), lon: parseFloat(context.lon), maxDistance: Config.DEFAULT_DISTANCE};
    }

    if (!p && intent && intent.includes('where')) {
        context.location = null;
    }

    //end preparation

    let { status, food, minPrice, maxPrice, where, location } = context;

    if (!p && !location && !where) {
        p = response('แถวไหนเหรอ หรือจะ share location ก็ได้นะ');
        context.status = 'wait_location';
    }

    if (!p) {
        let first = buildFirstMsg(intent, context);
        let last = buildLastMsg(intent, context);
        let error = buildErrorMsg(intent, context);
        let query = buildQuery(intent, context);

        p = onPick(
            { first, last, error},
            query,
            response);
        context.status = 'wait_next';
    }

    return p.then(() => context, error => {
        context.status = 'ended';
        return context;
    });
}

const buildQuery = (intent, context) => {
    let { status, food, minPrice, maxPrice, where, location } = context;
    let q = {food, minPrice, maxPrice, where, location, size: 1};

    return q;
}

const buildFirstMsg = (intent, context) => {
    let { status, food, minPrice, maxPrice, where, location } = context;
    let msg = ``;

    let locText;
    if(where) locText = `ที่${where}`;
    else if(location) locText = `บริเวณนี้`;

    if(food && locText && minPrice && maxPrice){
        msg = `เดี๋ยวหาร้านที่ขาย${food}${locText} ราคาอยู่ระหว่าง ${minPrice} และ ${maxPrice}`;
    }else if(food && locText && minPrice){
        msg = `เดี๋ยวหาร้านที่ขาย${food}${locText} ราคาไม่เกิน ${minPrice}`;
    }else if(food && locText){
        msg = `เดี๋ยวหาร้านที่ขาย${food}${locText}`;
    }else if(locText){
        msg = `เดี๋ยวหาร้าน${locText}`;
    }

    return msg + 'ให้ รอแป๊บนะ';
}

const buildLastMsg = (intent, context) => {
    let { status, food, minPrice, maxPrice, where, location } = context;
    let msg = ``;

    let locText;
    if(where) locText = `ที่${where}`;
    else if(location) locText = `บริเวณนี้`;

    if(food && locText && minPrice && maxPrice){
        msg = `ได้ละร้านที่ขาย${food}${locText} ราคาอยู่ระหว่าง ${minPrice} และ ${maxPrice}`;
    }else if(food && locText && minPrice){
        msg = `ได้ละร้านที่ขาย${food}${locText} ราคาไม่เกิน ${minPrice}`;
    }else if(food && locText){
        msg = `ได้ละร้านที่ขาย${food}${locText}`;
    }else if(locText){
        msg = `ได้ละร้าน${locText}`;
    }

    return msg;
}

const buildErrorMsg = (intent, context) => {
    let { status, food, minPrice, maxPrice, where, location } = context;
    let msg = `หาร้านที่`;

    let locText;
    if(where) locText = `ที่${where}`;
    else if(location) locText = `บริเวณนี้`;

    if(food && locText && minPrice && maxPrice){
        msg += `ขาย${food}${locText} ราคาอยู่ระหว่าง ${minPrice} และ ${maxPrice}`;
    }else if(food && locText && minPrice){
        msg += `ขาย${food}${locText} ราคาไม่เกิน ${minPrice}`;
    }else if(food && locText){
        msg += `ขาย${food}${locText}`;
    }else if(locText){
        msg = `${locText}`;
    }

    return msg + `ไม่เจอเลย`;
}

const newContext = (intent, entities, context) => {
    return Object.assign({}, context, entities);
}

const getCurrentContext = (entities, context) => {
    return Object.assign({}, context, entities);
}

const processAction = (action, context, response) => {
    let p;
    let { food, where, status, minPrice, maxPrice } = context;

    switch (action) {
        case 'pickone':
            p = onPick(
                {
                    first: "ไม่รู้จะกินอะไรใช่มะ เดี๋ยวหาร้านแถวนี้ให้ รอแป๊บหนึ่งนะ",
                    last: "ลองดูร้านนี้เป็นยังไง",
                    error: "ขอโทษที ไม่พบร้านแถวนี้เลย"
                },
                { recommended: true, size: 1, timeOfDay: '', location: Config.DEFAULT_LOCATION },
                response);
            break;
        case 'picknewone':
            p = onPick(
                {
                    first: "โอเค งั้นลองใหม่ แป๊บนะ",
                    last: "ลองดูร้านนี้เป็นยังไง",
                    error: "ขอโทษที ไม่พบร้านแถวนี้เลย"
                },
                { recommended: true, size: 1, timeOfDay: '', location: Config.DEFAULT_LOCATION },
                response);
            break;
        case 'greet':
            p = response('อยากกินอะไรละ');
            break;
        case 'bye':
            p = response('ขอบคุณครับ');
            break;
        case 'search_food':
            p = onSearch(
                {
                    first: `อยากกิน${food}เหรอ รอแป๊บ`,
                    last: "ลองดูร้านนี้เป็นยังไง",
                    error: `ขอโทษที ไม่เจอร้านขาย${food}แถวนี้เลย`
                },
                { food, size: 1, timeOfDay: '', location: Config.DEFAULT_LOCATION },
                response);
            break;
        case 'search_any_where':
            p = onPick(
                {
                    first: `เดี๋ยวหาร้านแถว${where}ให้ รอแป๊บ`,
                    last: "ลองดูร้านนี้เป็นยังไง",
                    error: `ขอโทษที ไม่มีข้อมูลร้านแถว${where}`
                },
                { where, size: 1, timeOfDay: '' },
                response);
            break;
        case 'search_food_where':
            p = onPick(
                {
                    first: `เดี๋ยวหาร้านที่ขาย${food}แถว${where}ให้ รอแป๊บ`,
                    last: "ลองดูร้านนี้เป็นยังไง",
                    error: `ขอโทษที ไม่มีข้อมูลร้านที่ขาย${food}แถว${where}เลย`
                },
                { food, where, size: 1, timeOfDay: '' },
                response);
            break;

        default:
            p = response(`ไม่เข้าใจอะ ไม่รู้จะหาร้านอะไรให้ดี`);
    }

    return p.then(result => status, error => {
        return error.code || 'unknown_error';
    });
}

const onPick = (responses, query, response) => {
    return response(responses.first)
        .then(() => api.pickOne(query))
        .then((ress) => {
            if (responses.last) {
                return response(responses.last).then(() => ress);
            }
            return ress;
        })
        .then((ress) => {
            return Promise.all(ress.hits.hits.map(r => {
                return response(toCard(r._source));
            }));
        }, error => {
            return response(responses.error || `ขอโทษที หาร้านที่ต้องการไม่เจอ ลองถามใหม่นะ`);
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
        }, error => {
            return response(responses.error || `ขอโทษที หาร้านที่ต้องการไม่เจอ ลองถามใหม่นะ`);
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

const nextAction = (intent, context) => {
    let { food, where, status, action } = context;

    if (status == 'wait_answer') {
        switch (intent) {
            case 'reject':
                action = 'picknewone';
                break;
            case 'res_cancel':
            case 'ok':
                action = 'bye';
                break;
            case 'res_exp':
                action = 'lower_price'
                context.maxPrice = 100;
                break;
            default:
                if (food && where) {
                    action = 'search_food_where';
                } else if (food) {
                    action = 'search_food';
                } else if (where) {
                    action = 'search_any_where';
                }
        }
    } else {
        switch (intent) {
            case 'res_any':
                action = 'pickone';
                break;
            case 'res_greet':
                action = 'greet';
                break;
            case 'res_food':
                action = 'search_food';
                break;
            case 'res_any_where':
                action = 'search_any_where';
                break;
        }
    }

    context.action = action;

    return context;
}

const nextState = (action, context, newStatus) => {
    let status = newStatus || context.status;

    if (status == '') {
        status = 'wait_answer';
    } else if (status == 'not_found') {
        status = 'ended';
    } else if (status == 'end') {
        status = 'ended';
    }

    context.status = status;

    return context;

}

module.exports = RestaurantConversation;