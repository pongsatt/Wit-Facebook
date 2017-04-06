const wordResponse = require('./WordResponse');
const restaurantResponse = require('./RestaurantResponse');

class ResponseResolver {
    constructor() {
    }

    resolve(intent, entities, context) {
        return getResponse(intent, entities, context);
    }
}

const getResponse = (intent, entities, context) => {
    let entitiesStr = JSON.stringify(entities);

    console.log(`Found intent "${intent}" and entities "${entitiesStr}"`);

    return {
        onResponse(response) {
            switch (intent) {
                case 'word_meaning':
                    return wordResponse.onMeaning(entities, context, response);
                case 'word_pronounce':
                    return wordResponse.onPronounce(entities, context, response);
                case 'word_unknown':
                    return response('What word do you want to know meaning or pronunciation?');
                case 'res_any':
                    return restaurantResponse.onAnyThing(entities, context, response);
                case 'res_type':
                    var { type } = entities;
                    return restaurantResponse.onSearch(
                        `อยากกินอาหาร${type}ใช่เปล่า รอเดี๋ยวนะ`, 
                        {type, size:2, timeOfDay:''}, 
                        context, response);
                case 'res_near_type':
                    var { type, near } = entities;
                    return restaurantResponse.onSearch(
                        `อยากกินอาหาร${type}ที่อยู่แถวนี้เหรอ รอเดี๋ยวนะ`, 
                        {type, size:1, maxDistance:near, timeOfDay:''}, 
                        context, response);
                case 'res_food':
                    return restaurantResponse.onFood(entities, context, response);
                case 'res_unknown':
                    return restaurantResponse.onUnknown(context, response);
            }

            console.log('No handler of intent: ', intent);
            return response(`Sorry, I don't understand. Please try another sentence.`);
        }
    }
}

module.exports = ResponseResolver;