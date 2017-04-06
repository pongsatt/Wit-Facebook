class RestaurantIntentResolver {
    constructor() {
    }

    resolve(msg, context) {
        console.log('Resolving msg: ', msg);
        return resolveIntent(msg, context);
    }
}
const resolveIntent = (msg, context) => {
    msg = msg || '';

    let { intentList, entities } = detectIntent(msg);

    if (intentList.length > 0) {
        let intent = 'res_' + intentList.join('_');
        return { intent, entities }
    }

    console.log('Not understand: ', msg);
    return { intent: 'res_unknown', entities: {} };
}

const detectIntent = (msg) => {
    let intentList = [];
    let entities = {};

    if (isAnyThing(msg)) {
        intentList.push('any');
        return {intentList, entities};
    }

    if (r = getNear(msg)) {
        intentList.push(r.intent);
        Object.assign(entities, r.entities);
        if(r.msg) msg = r.msg;
    }

    if (r = getFoodType(msg)) {
        intentList.push(r.intent);
        Object.assign(entities, r.entities);
        if(r.msg) msg = r.msg;
    }else if (r = getFood(msg)) {
        intentList.push(r.intent);
        Object.assign(entities, r.entities);
        if(r.msg) msg = r.msg;
    }

    return {intentList, entities};
}

const isAnyThing = (msg) => {
    let one = getOne(msg, ['ไรดี']);

    return one && one.length;
}

const getNear = (msg) => {
    let one = getOne(msg, ['ใกล้', 'ไม่ไกล', 'แถวๆนี้', 'แถวๆ']);
    let not = getOne(msg, ['ไม่ใกล้']);

    if (one.length && !not.length) {
        return {intent:'near', entities: {near: '300m'}, msg: removeAll(msg, one)};
    }
}

const getFood = (msg) => {
    let after = getAfter(msg, ['อยากกิน']);
    if(after.length){
        return {intent:'food', entities: {food: after[0]}};
    }
}

const getFoodType = (msg) => {
    let after = getAfter(msg, ['อยากกินอาหาร']);
    if(after.length){
        return {intent:'type', entities: {type: after[0]}};
    }
}

const getAfter = (msg, prefixs) => {
    for(let p of prefixs){
        let v = getByRegex(msg, new RegExp('.*' + p + '(.*)'));

        if(v) return [v];
    }

    return [];
}

const getByRegex = (msg, regex) => {
    let m = regex.exec(msg);

    if(m && m.length){
        return m[1];
    }
}

const getOne = (msg, includes) => {
    for(let inc of includes){
        let v = msg.includes(inc);

        if(v) return [inc];
    }

    return [];
}

const removeAll = (msg, removeList) => {
    for(let r of removeList){
        msg = msg.replace(new RegExp(r, 'g'), '');
    }

    return msg;
}

module.exports = RestaurantIntentResolver;

if (require.main === module) {
    let resolver = new RestaurantIntentResolver();
    console.log(resolver.resolve('อยากกินกระเพรา'));
}