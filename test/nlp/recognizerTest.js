const Recognizer = require('../../nlp/recognizer');
var assert = require('chai').assert;

var r = new Recognizer();

const assertRes = (intentObj, expIntent, expEntities) => {
    assert.isObject(intentObj);

    let { intent, entities } = intentObj;
    assert.equal(intent, expIntent);

    if(expEntities){
        for(k in expEntities){
            let v = expEntities[k];
            assert.propertyVal(entities, k, v);
        }
    }

}

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

        it('should res_any1', function () {
            let intent = r.intent('อยากกินอะไรก็ได้');
            assert.propertyVal(intent, 'intent', 'res_any', intent);
        });

        it('should res_any2', function () {
            let intent = r.intent('เบื่อ อยากกินอะไรอร่อยๆ');
            assert.propertyVal(intent, 'intent', 'res_any', intent);
        });

        it('should res_any3', function () {
            let intentObj = r.intent('กินไรดี', 'th');
            assertRes(intentObj, 'res_any')
        });

        it('should res_any4', function () {
            let intentObj = r.intent('กินอะไรดี', 'th');
            assertRes(intentObj, 'res_any')
        });

        it('should res_greet', function () {
            let intent = r.intent('หิว');
            assert.propertyVal(intent, 'intent', 'res_greet', intent);
        });

        it('should res_cancel1', function () {
            let intent = r.intent('ไม่กินและ');
            assert.propertyVal(intent, 'intent', 'res_cancel', intent);
        });

        it('should res_exp', function () {
            let intent = r.intent('แพงไป');
            assert.propertyVal(intent, 'intent', 'res_exp', intent);
        });

        it('should res_exp1', function () {
            let intent = r.intent('ราคาแพงไป');
            assert.propertyVal(intent, 'intent', 'res_exp', intent);
        });

        it('should res_cheap', function () {
            let intent = r.intent('ถูกไป');
            assert.propertyVal(intent, 'intent', 'res_cheap', intent);
        });

        it('should res_any_recommend', function () {
            let intent = r.intent('อยากกินอะไรสักอย่างแนะนำหน่อย');
            assert.propertyVal(intent, 'intent', 'res_any_recommend', intent);
        });

        it('should res_food', function () {
            let intent = r.intent('อยากกินส้มตำ');
            assert.propertyVal(intent, 'intent', 'res_food', intent);
        });

        it('should res_food1', function () {
            let intent = r.intent('แล้วมีส้มตำมะ');
            assert.propertyVal(intent, 'intent', 'res_food', intent);
        });

        it('should res_food2', function () {
            let intent = r.intent('แล้วมีส้มตำขายมะ');
            assert.propertyVal(intent, 'intent', 'res_food', intent);
        });

        it('should res_food3', function () {
            let intentObj = r.intent('อยากกินสุกี้');

            assertRes(intentObj, 'res_food', {food: 'สุกี้'});
        });

        it('should res_food4', function () {
            let intentObj = r.intent('กินสุกี้');

            assertRes(intentObj, 'res_food', {food: 'สุกี้'});
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

        it('should res_any_where1', function () {
            let intent = r.intent('อยู่แถวลาดพร้าวกินอะไรดี');
            assert.propertyVal(intent, 'intent', 'res_any_where', intent);
        });

        it('should res_any_where2', function () {
            let intent = r.intent('มาเดินเล่นแถวรามอินทรากินอะไรดี');
            assert.propertyVal(intent, 'intent', 'res_any_where', intent);
        });

        it('should res_any_where3', function () {
            let intent = r.intent('อยู่บางซื่อกินอะไรดี');
            assert.propertyVal(intent, 'intent', 'res_any_where', intent);
        });

        it('should res_any_where4', function () {
            let intent = r.intent('อยู่บางซื่อกินไรดี');
            assert.propertyVal(intent, 'intent', 'res_any_where', intent);
        });

        it('should res_any_where5', function () {
            let intentObj = r.intent('มีอะไรกินแถวเอ็มโพเรียม');
            
            assertRes(intentObj, 'res_any_where', {where: 'เอ็มโพเรียม'});
        });

        it('should res_any_where6', function () {
            let intentObj = r.intent('มีอะไรกินในเอ็มโพเรียม');
            
            assertRes(intentObj, 'res_any_where', {where: 'เอ็มโพเรียม'});
        });

        it('should res_any_where6', function () {
            let intentObj = r.intent('มีไรกินในเอ็มโพเรียม');
            
            assertRes(intentObj, 'res_any_where', {where: 'เอ็มโพเรียม'});
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

    describe('Common sentence', function () {
        it('should ok en', function () {
            let intent = r.intent('ok', 'en');
            assert.propertyVal(intent, 'intent', 'common_ok', intent);
        });

        it('should ok th', function () {
            let intent = r.intent('โอเค', 'th');
            assert.propertyVal(intent, 'intent', 'common_ok', intent);
        });

        it('should reject th', function () {
            let intent = r.intent('ไม่เอา', 'th');
            assert.propertyVal(intent, 'intent', 'common_reject', intent);
        });

        it('should reject th1', function () {
            let intent = r.intent('ไม่เอา อยากกินอย่างอื่น', 'th');
            assert.propertyVal(intent, 'intent', 'common_reject', intent);
        });

        it('should change th1', function () {
            let intentObj = r.intent('เปลี่ยนเป็นข้าว', 'th');
            assertRes(intentObj, 'common_change', {obj:'ข้าว'})
        });

        it('should where th1', function () {
            let intentObj = r.intent('แถวบางซื่อ', 'th');
            assertRes(intentObj, 'common_where', {where:'บางซื่อ'})
        });

    });

    describe('Location', function () {
        it('should get my location', function () {
            let intent = r.intent('My location is lat 13.688668 lon 100.607515', 'en');
            assert.propertyVal(intent, 'intent', 'res_location', intent);
        });


    });

    describe('About me', function () {
        it('should get my name', function () {
            let intent = r.intent('Tony', 'en');
            assert.propertyVal(intent, 'intent', 'greet_normal', intent);
        });


    });

    describe('Word', function () {
        it('should be meaning', function () {
            let intent = r.intent('test means', 'en');
            assert.propertyVal(intent, 'intent', 'word_meaning', intent);
        });

        it('should be pronounce', function () {
            let intent = r.intent('say test', 'en');
            assert.propertyVal(intent, 'intent', 'word_pronounce', intent);
        });

    });


});
