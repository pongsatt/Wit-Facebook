const Config = require('../config/const');

module.exports = [
    {lang: 'en', intent: 'greet_me',  p:`(?<botname>${Config.BOT_NAME})`},
    
    {lang: 'en', intent: 'res_location',  p:'.*lat (?<lat>.*) lon (?<lon>.*).*'},

    {lang: 'en', intent: 'greet_me',  p:`(hi|hello)(?<botname>${Config.BOT_NAME})`},
    {lang: 'th', intent: 'greet_me',  p:`(สวัสดี|หวัดดี|ว่าไง)(?<botname>${Config.BOT_NAME})`},
    {lang: 'en', intent: 'greet_normal',  p:'(hi|hello)(?<name>.*)*'},
    {lang: 'th', intent: 'greet_normal',  p:'(สวัสดี|หวัดดี|ว่าไง)(?<name>.*)*'},

    {lang: 'th', intent: 'common_reject',  p:'ไม่เอา.*'},
    {lang: 'th', intent: 'common_ok',  p:'(โอเค|ขอบคุณ)'},
    {lang: 'en', intent: 'common_ok',  p:'(thanks|ok)'},
    {lang: 'th', intent: 'common_change',  p:'เปลี่ยนเป็น(?<obj>.*)'},
    {lang: 'th', intent: 'common_where',  p:'^แถว(?<where>.*)'},

    {lang: 'en', intent: 'word_meaning',  p:'^(?<word>.*)mean.*'},
    {lang: 'en', intent: 'word_pronounce',  p:'say(?<word>.*)'},

    {lang: 'th', intent: 'res_any_near', p:'^อยากกิน(?<any>อะไร)?.*(?<near>แถวนี้|ใกล้)$'},
    {lang: 'th', intent: 'res_food_near',  p:'^อยากกิน(?<food>.*)(?<near>แถวนี้|ใกล้)$'},
    {lang: 'th', intent: 'res_foodtype_where',  p:'^อยากกินอาหาร(?<foodtype>.*)(ที่|ใน|แถว|ใกล้)(?<where>.*)$'},
    {lang: 'th', intent: 'res_food_where',  p:'^อยากกิน(?<food>.*).*(แถว|ใกล้|ใน)(?<where>.*)'},
    {lang: 'th', intent: 'res_any_recommend',  p:'^อยากกิน(?<any>อะไร).*แนะนำ.*'},
    {lang: 'th', intent: 'res_greet',  p:'หิว.*'},
    {lang: 'th', intent: 'res_ig_price',  p:'ไม่สนราคา'},
    {lang: 'th', intent: 'res_cancel',  p:'.*ไม่(:?กิน)?.*'},
    {lang: 'th', intent: 'res_cheap',  p:'(ราคา)*?แพง(ไป)*?'},
    {lang: 'th', intent: 'res_exp',  p:'(ราคา)*?ถูก(ไป)*?'},
    {lang: 'th', intent: 'res_any',  p:'^กิน(อะ)?ไรดี$'},
    {lang: 'th', intent: 'res_any',  p:'^อยากกิน(?<any>อะไร).*'},
    {lang: 'th', intent: 'res_any',  p:'^เบื่อ.*(?<any>อะไร).*'},
    {lang: 'th', intent: 'res_food_recommend',  p:'^อยากกิน(?<food>.*).*แนะนำ.*'},
    {lang: 'th', intent: 'res_foodtype',  p:'^อยากกินอาหาร(?<foodtype>.*)$'},
    {lang: 'th', intent: 'res_foodtype',  p:'^อาหาร(?<foodtype>.*)$'},
    {lang: 'th', intent: 'res_foodtype',  p:'^แล้วถ้า.*อาหาร(?<foodtype>.*)$'},
    {lang: 'th', intent: 'res_any_where',  p:'^แล้วถ้า.*(ที่|ใน|แถว|ใกล้)(?<where>.*)$'},
    {lang: 'th', intent: 'res_food',  p:'^แล้วถ้า(?:เป็น)?(?<food>.*)$'},
    {lang: 'th', intent: 'res_food',  p:'^อยากกิน(?<food>.*)$'},
    {lang: 'th', intent: 'res_food',  p:'^กิน(?<food>.*)$'},
    {lang: 'th', intent: 'res_food',  p:'^.*มี(?<food>.*?)(?:ขาย)*?(?:มะ|ไหม)$'},
    {lang: 'th', intent: 'res_any_where',  p:'^มี(อะ)?ไรกิน(ที่|ใน|แถว|ใกล้)(?<where>.*)$'},
    {lang: 'th', intent: 'res_any_where',  p:'^.*(อยู่|มา)(ที่|ใน|แถว|ใกล้)*(?<where>.*)กิน(อะ)?ไร.*$'},
    {lang: 'th', intent: 'res_foodtype_where',  p:'^.*(อยู่|มา)(ที่|ใน|แถว|ใกล้)?(?<where>.*)อยากกินอาหาร(?<foodtype>.*)'},
    {lang: 'th', intent: 'res_food_where',  p:'^.*(อยู่|มา)(ที่|ใน|แถว|ใกล้)?(?<where>.*)อยากกิน(?<food>.*)'},

]