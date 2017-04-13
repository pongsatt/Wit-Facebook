const Recognizer = require('../../nlp/recognizer');
var assert = require('chai').assert;
const Config = require('../../config/const');

var r = new Recognizer();

const assertIntent = (intentObj, expIntent, expEntities) => {
    assert.isObject(intentObj);

    let { intent, entities } = intentObj;
    assert.equal(intent, expIntent, JSON.stringify(intentObj));

    if (expEntities) {
        for (k in expEntities) {
            let v = expEntities[k];
            assert.propertyVal(entities, k, v, intentObj);
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
            assertIntent(intentObj, 'res_any')
        });

        it('should res_any4', function () {
            let intentObj = r.intent('กินอะไรดี', 'th');
            assertIntent(intentObj, 'res_any')
        });

        it('should res_any5', function () {
            let intentObj = r.intent('แนะนำร้านแถวนี้หน่อย', 'th');
            assertIntent(intentObj, 'res_any')
        });

        it('should res_any6', function () {
            let intentObj = r.intent('กินไรดีวันนี้', 'th');
            assertIntent(intentObj, 'res_any')
        });

        it('should res_greet', function () {
            let intent = r.intent('หิว');
            assert.propertyVal(intent, 'intent', 'res_greet', intent);
        });

        it('should res_cancel1', function () {
            let intent = r.intent('ไม่กินและ');
            assert.propertyVal(intent, 'intent', 'res_cancel', intent);
        });

        it('should res_cheap', function () {
            let intent = r.intent('แพงไป');
            assert.propertyVal(intent, 'intent', 'res_cheap', intent);
        });

        it('should res_cheap1', function () {
            let intent = r.intent('ราคาแพงไป');
            assert.propertyVal(intent, 'intent', 'res_cheap', intent);
        });

        it('should res_cheap2', function () {
            let intent = r.intent('ราคาไม่เกิน 100');
            assertIntent(intent, 'res_cheap', {maxPrice: '100'});
        });

        it('should res_cheap2', function () {
            let intent = r.intent('ราคาต่ำกว่า 100');
            assertIntent(intent, 'res_cheap', {maxPrice: '100'});
        });

        it('should res_exp1', function () {
            let intent = r.intent('ถูกไป');
            assert.propertyVal(intent, 'intent', 'res_exp', intent);
        });

        it('should res_exp2', function () {
            let intent = r.intent('ราคาสูงกว่า 100');
            assertIntent(intent, 'res_exp', {minPrice: '100'});
        });

        it('should res_ig_price', function () {
            let intent = r.intent('ไม่สนราคา');
            assert.propertyVal(intent, 'intent', 'res_ig_price', intent);
        });

        it('should res_ig_price1', function () {
            let intent = r.intent('ราคาเท่าไหร่ก็ได้');
            assert.propertyVal(intent, 'intent', 'res_ig_price', intent);
        });

        it('should res_ig_price2', function () {
            let intent = r.intent('ไม่เอาราคา');
            assert.propertyVal(intent, 'intent', 'res_ig_price', intent);
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
            let intentObj = r.intent('แล้วถ้าเป็นของหวานละ');
            assertIntent(intentObj, 'res_food', { food: 'ของหวาน' })
        });

        it('should res_food2', function () {
            let intentObj = r.intent('แล้วมีส้มตำมะ');
            assertIntent(intentObj, 'res_food', { food: 'ส้มตำ' })
        });

        it('should res_food3', function () {
            let intentObj = r.intent('แล้วถ้าขนมจีนละ');
            assertIntent(intentObj, 'res_food', { food: 'ขนมจีน' })
        });

        it('should res_food4', function () {
            let intent = r.intent('แล้วมีส้มตำขายมะ');
            assert.propertyVal(intent, 'intent', 'res_food', intent);
        });

        it('should res_food5', function () {
            let intentObj = r.intent('อยากกินสุกี้');

            assertIntent(intentObj, 'res_food', { food: 'สุกี้' });
        });

        it('should res_food6', function () {
            let intentObj = r.intent('กินสุกี้');

            assertIntent(intentObj, 'res_food', { food: 'สุกี้' });
        });

        it('should res_food7', function () {
            let intentObj = r.intent('แนะนำซูชิแถวนี้หน่อย');

            assertIntent(intentObj, 'res_food', { food: 'ซูชิ' });
        });

        it('should res_food8', function () {
            let intentObj = r.intent('ร้านที่ขายน้ำพริก');

            assertIntent(intentObj, 'res_food', { food: 'น้ำพริก' });
        });

        it('should res_food9', function () {
            let intentObj = r.intent('วันนี้อยากกินส้มตำ');

            assertIntent(intentObj, 'res_food', { food: 'ส้มตำ' });
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

            assertIntent(intentObj, 'res_any_where', { where: 'เอ็มโพเรียม' });
        });

        it('should res_any_where6', function () {
            let intentObj = r.intent('มีอะไรกินในเอ็มโพเรียม');

            assertIntent(intentObj, 'res_any_where', { where: 'เอ็มโพเรียม' });
        });

        it('should res_any_where7', function () {
            let intentObj = r.intent('มีไรกินในเอ็มโพเรียม');

            assertIntent(intentObj, 'res_any_where', { where: 'เอ็มโพเรียม' });
        });

        it('should res_any_where8', function () {
            let intentObj = r.intent('แล้วถ้าเป็นที่บางซื่อ');
            assertIntent(intentObj, 'res_any_where', { where: 'บางซื่อ' });
        });

        it('should res_any_where9', function () {
            let intentObj = r.intent('แล้วถ้าที่สยามละ');
            assertIntent(intentObj, 'res_any_where', { where: 'สยาม' });
        });

        it('should res_food_where4', function () {
            let intent = r.intent('อยู่แถวอ่อนนุชอยากกินส้มตำ');
            assert.propertyVal(intent, 'intent', 'res_food_where', intent);
        });

        it('should res_foodtype1', function () {
            let intentObj = r.intent('อยากกินอาหารญี่ปุ่น');
            assertIntent(intentObj, 'res_foodtype', { foodtype: 'ญี่ปุ่น' });
        });

        it('should res_foodtype2', function () {
            let intentObj = r.intent('อาหารจีน');
            assertIntent(intentObj, 'res_foodtype', { foodtype: 'จีน' });
        });

        it('should res_foodtype3', function () {
            let intentObj = r.intent('แล้วถ้าเป็นอาหารจีนละ');
            assertIntent(intentObj, 'res_foodtype', { foodtype: 'จีน' });
        });

        it('should res_foodtype4', function () {
            let intentObj = r.intent('แนะนำร้านอาหารญี่ปุ่นแถวนี้ให้หน่อย');
            assertIntent(intentObj, 'res_foodtype', { foodtype: 'ญี่ปุ่น' });
        });

        it('should res_foodtype5', function () {
            let intentObj = r.intent('แนะนำร้านอาหารญี่ปุ่นหน่อย');
            assertIntent(intentObj, 'res_foodtype', { foodtype: 'ญี่ปุ่น' });
        });

        it('should res_foodtype6', function () {
            let intentObj = r.intent('แนะนำอาหารญี่ปุ่นหน่อย');
            assertIntent(intentObj, 'res_foodtype', { foodtype: 'ญี่ปุ่น' });
        });

        it('should res_foodtype7', function () {
            let intentObj = r.intent('แนะนำร้านอาหารญี่ปุ่น');
            assertIntent(intentObj, 'res_foodtype', { foodtype: 'ญี่ปุ่น' });
        });

        it('should res_foodtype8', function () {
            let intentObj = r.intent('ร้านอาหารไทยแถวนี้');
            assertIntent(intentObj, 'res_foodtype', { foodtype: 'ไทย' });
        });

        it('should res_foodtype9', function () {
            let intentObj = r.intent('ร้านอาหารไทย');
            assertIntent(intentObj, 'res_foodtype', { foodtype: 'ไทย' });
        });

         it('should res_foodtype10', function () {
            let intentObj = r.intent('ร้านที่ขายอาหารไทย');
            assertIntent(intentObj, 'res_foodtype', { foodtype: 'ไทย' });
        });

        it('should res_foodtype_where1', function () {
            let intentObj = r.intent('อยากกินอาหารญี่ปุ่นแถวบางนา');
            assertIntent(intentObj, 'res_foodtype_where', { foodtype: 'ญี่ปุ่น', where: 'บางนา' });
        });

        it('should res_foodtype_where2', function () {
            let intentObj = r.intent('อยู่อโศกอยากกินอาหารไทย');
            assertIntent(intentObj, 'res_foodtype_where', { foodtype: 'ไทย', where: 'อโศก' });
        });

        it('should res_change', function () {
            let intentObj = r.intent('เปลี่ยนร้าน');
            assertIntent(intentObj, 'res_change');
        });

        it('should res_change1', function () {
            let intentObj = r.intent('ร้านอื่น');
            assertIntent(intentObj, 'res_change');
        });

        it('should res_change2', function () {
            let intentObj = r.intent('ร้านใหม่');
            assertIntent(intentObj, 'res_change');
        });

        it('should res_name', function () {
            let intentObj = r.intent('ร้าน torinada');
            assertIntent(intentObj, 'res_name', {resname: 'torinada'});
        });

        it('should res_name1', function () {
            let intentObj = r.intent('ข้อมูลร้าน torinada');
            assertIntent(intentObj, 'res_name', {resname: 'torinada'});
        });

        it('should res_any_near', function () {
            let intentObj = r.intent('อยากกินอะไรก็ได้แถวนี้');
            assertIntent(intentObj, 'res_any_near');
        });

        it('should res_any_near', function () {
            let intentObj = r.intent('อยากกินอะไรอร่อยๆ แถวนี้');
            assertIntent(intentObj, 'res_any_near');
        });

        it('should res_food_near', function () {
            let intentObj = r.intent('อยากกินขนมปังแถวนี้');
            assertIntent(intentObj, 'res_food_near', {food: 'ขนมปัง'});
        });

        it('should res_foodtype_near', function () {
            let intentObj = r.intent('อยากกินอาหารไทยแถวนี้');
            assertIntent(intentObj, 'res_foodtype_near', {foodtype: 'ไทย'});
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

        it('should greet_neg th', function () {
            let intent = r.intent('แย่มาก', 'th');
            assert.propertyVal(intent, 'intent', 'greet_neg', intent);
        });

        it('should greet_pos th', function () {
            let intent = r.intent('เจ๋ง', 'th');
            assert.propertyVal(intent, 'intent', 'greet_pos', intent);
        });

        it('should greet_neg en', function () {
            let intent = r.intent('bad', 'en');
            assert.propertyVal(intent, 'intent', 'greet_neg', intent);
        });

        it('should greet_pos en', function () {
            let intent = r.intent('great', 'en');
            assert.propertyVal(intent, 'intent', 'greet_pos', intent);
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

        it('should change th1', function () {
            let intentObj = r.intent('เปลี่ยนเป็นข้าว', 'th');
            assertIntent(intentObj, 'common_change', { obj: 'ข้าว' })
        });

        it('should where th1', function () {
            let intentObj = r.intent('แถวบางซื่อ', 'th');
            assertIntent(intentObj, 'common_where', { where: 'บางซื่อ' })
        });

        it('should where th2', function () {
            let intentObj = r.intent('ที่ทองหล่อละ', 'th');
            assertIntent(intentObj, 'common_where', { where: 'ทองหล่อ' })
        });

        it('should where th3', function () {
            let intentObj = r.intent('แถวพระโขนง', 'th');
            assertIntent(intentObj, 'common_where', { where: 'พระโขนง' })
        });

        it('should where th4', function () {
            let intentObj = r.intent('ในห้างเซ็ลทรัลบางนา', 'th');
            assertIntent(intentObj, 'common_where', { where: 'ห้างเซ็ลทรัลบางนา' })
        });

    });

    describe('Location', function () {
        it('should get my location', function () {
            let intent = r.intent('My location is lat 13.688668 lon 100.607515', 'en');
            assert.propertyVal(intent, 'intent', 'res_location', intent);
        });


    });

    describe('About me', function () {
        it('should get my name1', function () {
            let intentObj = r.intent(Config.BOT_NAME, 'en');
            assertIntent(intentObj, 'greet_me', {botname: Config.BOT_NAME})
        });

        it('should get my name2', function () {
            let intentObj = r.intent(`Hi ${Config.BOT_NAME}`, 'en');
            assertIntent(intentObj, 'greet_me', {botname: Config.BOT_NAME})
        });

        it('should get my name3', function () {
            let intentObj = r.intent(`สวัสดี ${Config.BOT_NAME}`, 'th');
            assertIntent(intentObj, 'greet_me', {botname: Config.BOT_NAME})
        });


    });

    describe('Command', function () {
        it('should enable learn', function () {
            let intentObj = r.intent('enable learn', 'en');
            assertIntent(intentObj, 'cmd_enable_learn');
        });

        it('should enable learn', function () {
            let intentObj = r.intent('disable learn', 'en');
            assertIntent(intentObj, 'cmd_disable_learn');
        });

    });

    describe('Word', function () {
        it('should be meaning', function () {
            let intent = r.intent('test means', 'en');
            assertIntent(intent, 'word_meaning', {word: 'test'});
        });

        it('should be pronounce', function () {
            let intent = r.intent('say test', 'en');
            assertIntent(intent, 'word_pronounce', {word: 'test'});
        });

    });


});
