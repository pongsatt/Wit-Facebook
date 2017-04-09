const FBBot = require('../../bot/FbBot');
const Bot = require('../../bot/botwrapper');
var assert = require('chai').assert;

var bot = new Bot();

const assertContext = (p, expStatus) => {
  return p.then((context) => {
        assert.propertyVal(context, 'status', expStatus);
        return Promise.resolve(context);
      });
}

describe('FbBot', function () {
  describe('restaurant', function () {
    // it('should start recommend dialog', function () {
    //   let context = { sessionId: 1 };

    //   let p = bot.message('กินไรดี', context);
    //   p = p.then(response => {
    //     return bot.message('ไม่เอา', context);
    //   });

    //   return p;
    // });

    // it('should start recommend dialog', function () {
    //   let context = { sessionId: 1 };

    //   let p = bot.message('อยากกินอะไรก็ได้', context);

    //   return p;
    // });

    // it('should start recommend dialog', function () {
    //   let context = { sessionId: 1 };

    //   let p = bot.message('หิว', context);
    //   p = p.then(() => bot.message('อยากกินส้มตำ', context));

    //   return p;
    // });

    // it('should start recommend dialog', function () {
    //   let context = { sessionId: 1 };

    //   let p = bot.message('อยู่แถวพร้อมพงษ์กินอะไรดี', context);
    //   p = p.then(() => bot.message('ไม่เอา อยากกินอย่างอื่น', context))

    //   return p;
    // });

    // it('should start recommend dialog', function () {
    //   let context = { sessionId: 1 };

    //   let p = bot.message('อยู่เอ็มโพเรียมกินอะไรดี', context);
    //   p = p.then(() => bot.message('อยากกินเค้ก', context));
    //   p = p.then(() => bot.message('แล้วมีส้มตำมะ', context));
    //   p = p.then(() => bot.message('ไม่กินและ', context));

    //   return p;
    // });

    // it('should start recommend dialog', function () {
    //   let context = { sessionId: 1 };

    //   let p = bot.message('กินไรดี', context);
    //   p = assertContext(p, 'wait_location');

    //   p = p.then(() => bot.message('สยาม', context));
    //   p = assertContext(p, 'wait_next');
    //   return p;
    // });
    it('should start recommend dialog', function () {
      let context = { sessionId: 1 };

      let p = bot.message('อยากกินอาหารญี่ปุ่นแถวบางนา', context);
      p = assertContext(p, 'wait_next');

      p = p.then(() => bot.message('แพงไป', context));
      p = p.then(() => bot.message('ไม่สนราคา', context));
      p = p.then(() => bot.message('แล้วถ้าเป็นอาหารจีนละ', context));
      return p;
    });

    // it('should start pick by location', function () {
    //   let context = { sessionId: 1 };

    //   let p = bot.message('My location is lat 13.688668 lon 100.607515', context);
    //   // p = p.then(() => bot.message('อยากกินเค้ก', context));

    //   return p;
    // });

    // it('should start pick by location', function () {
    //   let context = { sessionId: 1 };

    //   let p = bot.message('อยากกินเค้กแถวบางนา', context);
    //   // p = p.then(() => bot.message('อยากกินเค้ก', context));

    //   return p;
    // });

  });

  // describe('word', function () {
  //   it('should response word meaning', function () {
  //     let context = { sessionId: 1 };

  //     let p = bot.message('test means', context);

  //     return p;
  //   });

  //   it('should response word pronunciation', function () {
  //     let context = { sessionId: 1 };

  //     let p = bot.message('say test', context);

  //     return p;
  //   });
  // });

  // describe('greeting', function () {
  //   it('should start greeting dialog', function () {
  //     let context = { sessionId: 1 };

  //     let p = bot.message('สวัสดี', context)
  //     .then( (s) => {
  //       return bot.message('พงศ์', context)
  //     });

  //     return p;
  //   });
  // });

});