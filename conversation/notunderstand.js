class NotUnderstand {
    constructor(context){
        this.context = context;
    }

    response(intent, entities, response) {
        return response(`Sorry, sometimes, it's hard to understand you.`);
    }
}

module.exports = NotUnderstand;