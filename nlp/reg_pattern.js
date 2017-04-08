module.exports = [
    {lang: 'th', intent: 'res_any_near', p:'^อยากกิน(?<any>อะไร)?.*(?<near>แถวนี้|ใกล้)$'},
    {lang: 'th', intent: 'res_food_near',  p:'^อยากกิน(?<food>.*)(?<near>แถวนี้|ใกล้)$'},
    {lang: 'th', intent: 'res_food_where',  p:'^อยากกิน(?<food>.*).*(แถว|ใกล้|ใน)(?<where>.*)'},
    {lang: 'th', intent: 'res_any_recommend',  p:'^อยากกิน(?<any>อะไร).*แนะนำ.*'},
    {lang: 'th', intent: 'res_any',  p:'^กินไรดี'},
    {lang: 'th', intent: 'res_any',  p:'^อยากกิน(?<any>อะไร).*'},
    {lang: 'th', intent: 'res_any',  p:'^เบื่อ.*(?<any>อะไร).*'},
    {lang: 'th', intent: 'res_food_recommend',  p:'^อยากกิน(?<food>.*).*แนะนำ.*'},
    {lang: 'th', intent: 'res_food',  p:'^อยากกิน(?<food>.*)$'},
    {lang: 'th', intent: 'res_any_where',  p:'^(อยู่|มา).*(ที่|ใน|แถว|ใกล้)(?<where>.*)กิน.*ไร.*$'},
    {lang: 'th', intent: 'res_food_where',  p:'^(อยู่|มา).*(ที่|ใน|แถว|ใกล้)(?<where>.*)อยากกิน(?<food>.*)'},

    {lang: 'en', intent: 'greet_normal',  p:'(hi|hello)(?<obj>.*)*'},
    {lang: 'th', intent: 'greet_normal',  p:'(สวัสดี|หวัดดี|ว่าไง)(?<obj>.*)*'},

    {lang: 'th', intent: 'reject',  p:'ไม่เอา'},
    {lang: 'th', intent: 'ok',  p:'(โอเค|ขอบคุณ)'},
    {lang: 'en', intent: 'ok',  p:'(thanks)'},
]