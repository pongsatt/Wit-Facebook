class RestaurantIntentResolver {
    constructor(){

    }

    resolve(msg, context){
        return resolveIntent(msg, context);
    }
}
const resolveIntent = (msg, context) => {
    return {intent: 'res_unknown', entities: {}};
}

module.exports = RestaurantIntentResolver;