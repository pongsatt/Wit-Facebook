const api = require('./estaurantapi');

const onAnyThing = (entities, context, response) => {
    const { keyword } = entities;

    if(keyword){
        return api.pickOne();
    }

    return response("ถ้าคุณไม่รู้จะกินอะไร เราจะแนะนำให้คุณเอง");
}

const onUnknown = (context, response) => {
    return response("ผมไม่แน่ใจว่าเข้าใจหรือเปล่า แต่ผมขอแนะนำร้านนี้ รอสักครู่")
    .then(()=> {
        return api.pickOne().then(res => response(toCard(res._source)));
    });
}

const toCard = (res) => {
    let desc = `${res.cuisine}`
    let menus = res.menus && res.menus.join(',');
    if(menus) desc+=` เมนูแนะนำ ${menus}`;

    let lon = res.geo.location[0];
    let lat = res.geo.location[1];

    let url = `https://www.wongnai.com/${res.original_id}`;
    let map = `http://maps.google.com/maps?q=${lat},${lon}`;
    let card = {
        title: res.name,
        subtitle: desc,
        image_url: res.image,
        url: url,
        buttons : [
            {title: 'Open', url: url},
            {title: 'Location', url: map}
        ]
    }

    return card;
}

module.exports = {
    onAnyThing,
    onUnknown
}