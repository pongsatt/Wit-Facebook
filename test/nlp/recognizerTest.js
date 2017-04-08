const Recognizer = require('../../nlp/recognizer');
var assert = require('chai').assert;

var r = new Recognizer();

describe('Recognizer', function () {
    describe('Restaurant Recognizer', function () {
        it('should res_any_near1', function () {
            let intent = r.intent('อยากกินอะไรก็ได้แถวๆนี้');
            assert.propertyVal(intent, 'intent', 'res_any_near', intent);
        });

        it('should res_any_near2', function () {
            let intent = r.intent('อยากกินอะไรก็ได้ใกล้ๆ');
            assert.propertyVal(intent, 'intent', 'res_any_near', intent);
        });

        it('should res_any', function () {
            let intent = r.intent('อยากกินอะไรก็ได้');
            assert.propertyVal(intent, 'intent', 'res_any', intent);
        });

        it('should res_any', function () {
            let intent = r.intent('เบื่อ อยากกินอะไรอร่อยๆ');
            assert.propertyVal(intent, 'intent', 'res_any', intent);
        });

        it('should res_any_recommend', function () {
            let intent = r.intent('อยากกินอะไรสักอย่างแนะนำหน่อย');
            assert.propertyVal(intent, 'intent', 'res_any_recommend', intent);
        });

        it('should res_food', function () {
            let intent = r.intent('อยากกินส้มตำ');
            assert.propertyVal(intent, 'intent', 'res_food', intent);
        });

        it('should res_food_recommend', function () {
            let intent = r.intent('อยากกินส้มตำแนะนำด้วย');
            assert.propertyVal(intent, 'intent', 'res_food_recommend', intent);
        });

        it('should res_food_where1', function () {
            let intent = r.intent('อยากกินส้มตำแถวทองหล่อ');
            assert.propertyVal(intent, 'intent', 'res_food_where', intent);
        });

        it('should res_food_where2', function () {
            let intent = r.intent('อยากกินส้มตำใกล้ทองหล่อ');
            assert.propertyVal(intent, 'intent', 'res_food_where', intent);
        });

        it('should res_food_where3', function () {
            let intent = r.intent('อยากกินส้มตำในห้าง');
            assert.propertyVal(intent, 'intent', 'res_food_where', intent);
        });

        it('should res_any_where', function () {
            let intent = r.intent('อยู่แถวลาดพร้าวกินอะไรดี');
            assert.propertyVal(intent, 'intent', 'res_any_where', intent);
        });

        it('should res_any_where', function () {
            let intent = r.intent('มาเดินเล่นแถวรามอินทรากินอะไรดี');
            assert.propertyVal(intent, 'intent', 'res_any_where', intent);
        });

        it('should res_food_where4', function () {
            let intent = r.intent('อยู่แถวอ่อนนุชอยากกินส้มตำ');
            assert.propertyVal(intent, 'intent', 'res_food_where', intent);
        });


    });


    describe('Greeting Recognizer', function () {
        it('should greet_normal en', function () {
            let intent = r.intent('Hi', 'en');
            assert.propertyVal(intent, 'intent', 'greet_normal', intent);
        });

        it('should greet_normal th', function () {
            let intent = r.intent('สวัสดี', 'th');
            assert.propertyVal(intent, 'intent', 'greet_normal', intent);
        });

        it('should greet_normal th1', function () {
            let intent = r.intent('หวัดดี', 'th');
            assert.propertyVal(intent, 'intent', 'greet_normal', intent);
        });

    });


});
