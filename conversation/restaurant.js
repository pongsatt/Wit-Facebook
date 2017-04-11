const api = require('../api/estaurantapi');
const Config = require('../config/const');
const myname = Config.BOT_NAME;

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

}

const doAction = (intent, context, response) => {
    var { status, food, foodtype, minPrice, maxPrice, where, location, msg, lastTotal, resname, result_ids } = context;

    //start preparation
    let p;

    if (!p && intent == 'res_great') {
        p = response('อยากกินอะไรละ');
        context.status = 'ended';
    }

    if (!p && intent == 'res_cancel' && intent == 'common_ok') {
        p = response('ขอบคุณครับ');
        context.status = 'ended';
    }

    if (!p && intent == 'res_exp') {
        context.maxPrice = 100;
        context.minPrice = 0;
    }

    if (!p && intent == 'res_cheap') {
        context.maxPrice = 1000;
        context.minPrice = 500;
    }

    if (!p && intent == 'res_ig_price') {
        context.maxPrice = undefined;
        context.minPrice = undefined;
    }

    if (!p && intent.includes('near')) {
        context.where = null;
        context.location = Config.DEFAULT_LOCATION;
    }

    if (!p && intent == 'res_cheap') {
        context.minPrice = 0;
        context.maxPrice = 100;
    }

    if (!p && intent == 'res_exp') {
        context.minPrice = 100;
        context.maxPrice = 1000;
    }

    if (!p && intent == 'res_location') {
        context.where = null;
        context.location = { lat: parseFloat(context.lat), lon: parseFloat(context.lon), maxDistance: Config.DEFAULT_DISTANCE };
    }

    if (!p && intent.includes('where')) {
        context.location = null;
    }

    if (!p && intent.includes('foodtype')) {
        context.food = null;
        context.resname = null;
    } else if (!p && intent && intent.includes('food')) {
        context.foodtype = null;
        context.resname = null;
    }

    if (!p && intent != 'res_change' && intent != 'common_reject') {
        context.result_ids = null;
    }

    if (!p && (intent == 'res_change' || intent == 'common_reject') && lastTotal <= 1) {
        p = response(`ไม่มีร้านอื่นแล้วครับ ลองเงื่อนไขดูนะ`);
        context.status = 'ended';
    }

    //this should be last
    if (!p && intent == 'res_any') {
        context.where = null;
        context.location = null;
        context.food = null;
        context.foodtype = null;
        context.resname = null;
        context.minPrice = null;
        context.maxPrice = null;
    }

    if (!p && intent == 'res_name') {
        context.food = null;
        context.foodtype = null;
        context.minPrice = null;
        context.maxPrice = null;
    }

    //status handler
    if (!p) {
        if (status == 'wait_location') {
            if (intent == 'unknown') {
                if (!location && !where) {
                    context.where = context.msg;
                }
            }
        } else if (status == 'wait_next') {
            if (intent == 'unknown') {
                p = response('โทษที ไม่เข้าใจอะ ลองเปลี่ยนอาหาร สถานที่ หรือถ้าแพงไปหรือถูกไป ก็บอกได้นะ');
            }
        }
    }
    //end status handler

    //end preparation
    ({ status, food, foodtype, minPrice, maxPrice, where, location, msg, result_ids } = context);

    if (!p && !location && !where && !resname) {
        p = response('แถวไหนเหรอ หรือจะ share location ก็ได้นะ');
        context.status = 'wait_location';
    }

    if (!p && resname) {
        context.status = 'ended';
    }

    if (!p) {
        let first = buildFirstMsg(intent, context);
        let last = buildLastMsg(intent, context);
        let error = buildErrorMsg(intent, context);
        let query = buildQuery(intent, context);

        p = onPick(
            { first, last, error },
            query,
            response)
            .then((results) => {
                if (results && results.hits) {
                    context.lastTotal = results.hits.total;
                    for (let r of results.hits.hits) {
                        context.result_ids = context.result_ids || [];
                        context.result_ids.push(r._id);
                    }
                }
                return results;
            });
        context.status = 'wait_next';
    }

    return p.then(() => context, error => {
        console.error(error);
        return response(`มี error เดี๋ยวลองดูใหม่อีกทีนะ`)
            .then(() => context);
    });
};

const buildQuery = (intent, context) => {
    let { food, foodtype, minPrice, maxPrice, where, location, result_ids, resname } = context;
    let q = {
        food, foodtype, minPrice, maxPrice, where, location,
        exclude_ids: result_ids, result_ids, size: 3, name: resname, timeOfDay: ''
    };

    return q;
};

const buildFirstMsg = (intent, context) => {
    let { food, foodtype, minPrice, maxPrice, where, location, resname } = context;
    let msg = ``;

    foodtype = foodtype && `อาหาร${foodtype}`;
    let foodText = food || foodtype;

    let locText;
    if (where) locText = `ที่${where}`;
    else if (location) locText = `บริเวณนี้`;

    if (foodText && locText && minPrice !== undefined && maxPrice !== undefined) {
        msg = `เดี๋ยวหาร้านที่ขาย${foodText}${locText} ราคาอยู่ระหว่าง ${minPrice} และ ${maxPrice}`;
    } else if (foodText && locText && minPrice !== undefined) {
        msg = `เดี๋ยวหาร้านที่ขาย${foodText}${locText} ราคาไม่เกิน ${minPrice}`;
    } else if (foodText && locText) {
        msg = `เดี๋ยวหาร้านที่ขาย${foodText}${locText}`;
    } else if (locText && resname) {
        msg = `เดี๋ยวหาร้าน ${resname} ${locText}`;
    } else if (locText) {
        msg = `เดี๋ยวหาร้าน${locText}`;
    } else if (resname) {
        msg = `เดี๋ยวหาร้าน ${resname} `;
    }

    msg = msg + 'ให้ รอแป๊บนะ';

    if (intent == 'res_change' || intent == 'common_reject') {
        msg = 'งั้นเอาใหม่ ' + msg;
    }

    return msg;
};

const buildLastMsg = (intent, context) => {
    let { food, foodtype, minPrice, maxPrice, where, location, resname } = context;
    let msg = ``;

    foodtype = foodtype && `อาหาร${foodtype}`;
    let foodText = food || foodtype;

    let locText;
    if (where) locText = `ที่${where}`;
    else if (location) locText = `บริเวณนี้`;

    if (foodText && locText && minPrice !== undefined && maxPrice !== undefined) {
        msg = `ได้ละร้านที่ขาย${foodText}${locText} ราคาอยู่ระหว่าง ${minPrice} และ ${maxPrice}`;
    } else if (foodText && locText && minPrice !== undefined) {
        msg = `ได้ละร้านที่ขาย${foodText}${locText} ราคาไม่เกิน ${minPrice}`;
    } else if (foodText && locText) {
        msg = `ได้ละร้านที่ขาย${foodText}${locText}`;
    } else if (locText && resname) {
        msg = `ได้ละร้าน ${resname} ${locText}`;
    } else if (locText) {
        msg = `ได้ละร้าน${locText}`;
    } else if (resname) {
        msg = `ได้ละร้าน ${resname} `;
    }

    return msg;
};

const buildErrorMsg = (intent, context) => {
    let { food, foodtype, minPrice, maxPrice, where, location, resname } = context;
    let msg = `ไม่มีร้าน`;

    foodtype = foodtype && `อาหาร${foodtype}`;
    let foodText = food || foodtype;

    let locText;
    if (where) locText = `ที่${where}`;
    else if (location) locText = `บริเวณนี้`;

    if (foodText && locText && minPrice !== undefined && maxPrice !== undefined) {
        msg += `ขาย${foodText}${locText} ราคาอยู่ระหว่าง ${minPrice} และ ${maxPrice}`;
    } else if (foodText && locText && minPrice !== undefined) {
        msg += `ขาย${foodText}${locText} ราคาไม่เกิน ${minPrice}`;
    } else if (foodText && locText) {
        msg += `ขาย${foodText}${locText}`;
    } else if (locText && resname) {
        msg += `${resname} ${locText}`;
    } else if (locText) {
        msg += `${locText}`;
    } else if (resname) {
        msg += `${resname}`;
    }

    return msg + `เลย`;
};

const newContext = (intent, entities, context) => {
    return Object.assign({}, context, entities);
};

const onPick = (responses, query, response) => {
    return response(responses.first)
        .then(() => api.search(query))
        .then((ress) => {
            if (ress.hits && ress.hits.total && responses.last) {
                return response(responses.last)
                    .then(() => ress);
            }
            return ress;
        })
        .then((ress) => {
            if (!ress.hits || !ress.hits.hits || !ress.hits.total) {
                return response(responses.error || `ขอโทษที หาร้านที่ต้องการไม่เจอ ลองถามใหม่นะ`);
            }

            let cards = ress.hits.hits.map(r => {
                return toCard(r);
            });

            return response(cards).then(() => ress);
        });
};

/* jshint ignore:start */
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
                return response(toCard(r));
            }));
        }, error => {
            return response(responses.error || `ขอโทษที หาร้านที่ต้องการไม่เจอ ลองถามใหม่นะ`);
        });
};
/* jshint ignore:end */

const toCard = (doc) => {
    let res = doc._source;

    let desc = `${res.cuisine}`;
    let menus = res.menus && res.menus.join(',');
    if (menus) desc += ` เมนูแนะนำ ${menus}`;

    let lon = res.geo.location[0];
    let lat = res.geo.location[1];

    let url = `https://www.wongnai.com/${res.original_id}`;
    let map = `http://maps.google.com/maps?q=${lat},${lon}`;
    let card = {
        id: doc._id,
        title: res.name,
        subtitle: desc,
        image_url: res.image,
        url: url,
        buttons: [
            { title: 'Open', url: url },
            { title: 'Location', url: map }
        ]
    };

    return card;
};

module.exports = RestaurantConversation;
