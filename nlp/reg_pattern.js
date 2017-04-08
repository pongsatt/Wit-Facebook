module.exports = [
    {lang: 'en', intent: 'greet_normal',  p:'(hi|hello)(?<obj>.*)*'},
    {lang: 'th', intent: 'greet_normal',  p:'(สวัสดี|หวัดดี|ว่าไง)(?<obj>.*)*'},

    {lang: 'th', intent: 'reject',  p:'ไม่เอา.*'},
    {lang: 'th', intent: 'ok',  p:'(โอเค|ขอบคุณ)'},
    {lang: 'en', intent: 'ok',  p:'(thanks|ok)'},

    {lang: 'en', intent: 'word_meaning',  p:'^(?<word>.*)mean.*'},
    {lang: 'en', intent: 'word_pronounce',  p:'say(?<word>.*)'},

    {lang: 'th', intent: 'res_any_near', p:'^อยากกิน(?<any>อะไร)?.*(?<near>แถวนี้|ใกล้)$'},
    {lang: 'th', intent: 'res_food_near',  p:'^อยากกิน(?<food>.*)(?<near>แถวนี้|ใกล้)$'},
    {lang: 'th', intent: 'res_food_where',  p:'^อยากกิน(?<food>.*).*(แถว|ใกล้|ใน)(?<where>.*)'},
    {lang: 'th', intent: 'res_any_recommend',  p:'^อยากกิน(?<any>อะไร).*แนะนำ.*'},
    {lang: 'th', intent: 'res_greet',  p:'หิว.*'},
    {lang: 'th', intent: 'res_cancel',  p:'.*ไม่(:?กิน)?.*'},
    {lang: 'th', intent: 'res_exp',  p:'(ราคา)*?แพง(ไป)*?'},
    {lang: 'th', intent: 'res_cheap',  p:'(ราคา)*?ถูก(ไป)*?'},
    {lang: 'th', intent: 'res_any',  p:'^กิิินไรดี'},
    {lang: 'th', intent: 'res_any',  p:'^อยากกิน(?<any>อะไร).*'},
    {lang: 'th', intent: 'res_any',  p:'^เบื่อ.*(?<any>อะไร).*'},
    {lang: 'th', intent: 'res_food_recommend',  p:'^อยากกิน(?<food>.*).*แนะนำ.*'},
    {lang: 'th', intent: 'res_food',  p:'^อยากกิน(?<food>.*)$'},
    {lang: 'th', intent: 'res_food',  p:'^แล้วมี(?<food>.*?)(?:ขาย)*?(?:มะ|ไหม)$'},
    {lang: 'th', intent: 'res_any_where',  p:'^.*(อยู่|มา)(ที่|ใน|แถว|ใกล้)*(?<where>.*)กิน(อะ)?ไร.*$'},
    {lang: 'th', intent: 'res_food_where',  p:'^.*(อยู่|มา)(ที่|ใน|แถว|ใกล้)?(?<where>.*)อยากกิน(?<food>.*)'},

]