const Recognizer = require('../../nlp/recognizer');
var assert = require('chai').assert;

var r = new Recognizer();

describe('Recognizer', function() {
  describe('res_any_near', function() {
    it('should res_any_near1', function() {
        let intent = r.recognize('อยากกินอะไรก็ได้แถวๆนี้');
        assert.propertyVal(intent, 'intent', 'res_any_near', intent);
    });

    it('should res_any_near2', function() {
        let intent = r.recognize('อยากกินอะไรก็ได้ใกล้ๆ');
        assert.propertyVal(intent, 'intent', 'res_any_near', intent);
    });

    it('should res_any', function() {
        let intent = r.recognize('อยากกินอะไรก็ได้');
        assert.propertyVal(intent, 'intent', 'res_any', intent);
    });

    it('should res_any', function() {
        let intent = r.recognize('เบื่อ อยากกินอะไรอร่อยๆ');
        assert.propertyVal(intent, 'intent', 'res_any', intent);
    });

    it('should res_any_recommend', function() {
        let intent = r.recognize('อยากกินอะไรสักอย่างแนะนำหน่อย');
        assert.propertyVal(intent, 'intent', 'res_any_recommend', intent);
    });

    it('should res_food', function() {
        let intent = r.recognize('อยากกินส้มตำ');
        assert.propertyVal(intent, 'intent', 'res_food', intent);
    });

    it('should res_food_recommend', function() {
        let intent = r.recognize('อยากกินส้มตำแนะนำด้วย');
        assert.propertyVal(intent, 'intent', 'res_food_recommend', intent);
    });

    it('should res_food_where1', function() {
        let intent = r.recognize('อยากกินส้มตำแถวทองหล่อ');
        assert.propertyVal(intent, 'intent', 'res_food_where', intent);
    });

    it('should res_food_where2', function() {
        let intent = r.recognize('อยากกินส้มตำใกล้ทองหล่อ');
        assert.propertyVal(intent, 'intent', 'res_food_where', intent);
    });

    it('should res_food_where3', function() {
        let intent = r.recognize('อยากกินส้มตำในห้าง');
        assert.propertyVal(intent, 'intent', 'res_food_where', intent);
    });

    it('should res_any_where', function() {
        let intent = r.recognize('อยู่แถวลาดพร้าวกินอะไรดี');
        assert.propertyVal(intent, 'intent', 'res_any_where', intent);
    });

    it('should res_any_where', function() {
        let intent = r.recognize('มาเดินเล่นแถวรามอินทรากินอะไรดี');
        assert.propertyVal(intent, 'intent', 'res_any_where', intent);
    });

    it('should res_food_where4', function() {
        let intent = r.recognize('อยู่แถวอ่อนนุชอยากกินส้มตำ');
        assert.propertyVal(intent, 'intent', 'res_food_where', intent);
    });
    
    
  });
});