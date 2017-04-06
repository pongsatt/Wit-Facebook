const api = require('./estaurantapi');

const onAnyThing = (entities, context, response) => {
    return onSearch("ไม่รู้จะกินอะไรใช่มะ เดี๋ยวหาร้านแถวนี้ให้ รอแป๊บหนึ่งนะ", 
    {recommended:true, size: 2, timeOfDay: ''}, 
    context, response);
}

const onFood = (entities, context, response) => {
    let { food } = entities;

    return onSearch(`อยากกิน ${food} เหรอ รอแป๊บหนึ่ง`, 
    {food, timeOfDay: '', size: 2}, 
    context, response);
}

const onSearch = (firstResponse, searchQ, context, response) => {
    return response(firstResponse)
    .then(() => api.search(searchQ))
    .then((ress) => {
        if(!ress || !ress.length) return response(`ขอโทษที หาร้านที่ต้องการไม่เจอ ลองถามใหม่นะ`);

        return Promise.all(ress.map(r => {
            return response(toCard(r._source));
        }));
    });
}

const onUnknown = (context, response) => {
    return response("ผมไม่แน่ใจนะ แต่คุณอาจจะชอบร้านนี้ก็ได้ รอสักครู่")
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
    onSearch,        
    onAnyThing,
    onUnknown,
    onFood
}