const api = require('./estaurantapi');

const onAnyThing = (entities, context, response) => {
    const { keyword } = entities;

    if(keyword){
        return api.pickOne();
    }

    return response("ถ้าคุณไม่รู้จะกินอะไร เราจะแนะนำให้คุณเอง");
}

const onUnknown = (context, response) => {
    return response("ผมไม่แน่ใจว่าเข้าใจหรือเปล่า แต่ผมขอแนะนำร้านนี้")
    .then(()=> {
        return api.pickOne().then(res => response(res));
    });
}

module.exports = {
    onAnyThing,
    onUnknown
}