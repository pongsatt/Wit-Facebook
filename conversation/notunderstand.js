class NotUnderstand {
    constructor(context) {
        this.context = context;
    }

    response(intent, entities, response) {
        let { where } = this.context;

        let p;

        if (where) {
            p = response(`Do you want to go to ${where}?`);
        } else {
            p = response(`Sorry, sometimes, it's hard to understand you.`);
        }

        return p.then(() => this.context);
    }
}

module.exports = NotUnderstand;