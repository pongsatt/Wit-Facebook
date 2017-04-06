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
                case 'res_anything':
                    return restaurantResponse.onAnyThing(entities, context, response);
            }

            console.log('No handler of intent: ', intent);
            return Promise.resolve();
        }
    }
}

module.exports = ResponseResolver;