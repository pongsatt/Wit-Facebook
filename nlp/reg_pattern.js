module.exports = [
    {intent: 'res_any_near', p:'^อยากกิน(?<any>อะไร).*(?<near>แถวนี้|ใกล้)$'},
    {intent: 'res_food_near',  p:'^อยากกิน(?<food>.*).*(?<near>แถวนี้|ใกล้)$'},
    {intent: 'res_food_where',  p:'^อยากกิน(?<food>.*).*(แถว|ใกล้|ใน)(?<where>.*)'},
    {intent: 'res_any_recommend',  p:'^อยากกิน(?<any>อะไร).*แนะนำ.*'},
    {intent: 'res_any',  p:'^อยากกิน(?<any>อะไร).*'},
    {intent: 'res_any',  p:'^เบื่อ.*(?<any>อะไร).*'},
    {intent: 'res_food_recommend',  p:'^อยากกิน(?<food>.*).*แนะนำ.*'},
    {intent: 'res_food',  p:'^อยากกิน(?<food>.*)$'},
    {intent: 'res_any_where',  p:'^(อยู่|มา).*(ที่|ใน|แถว|ใกล้)(?<where>.*)กิน.*ไร.*$'},
    {intent: 'res_food_where',  p:'^(อยู่|มา).*(ที่|ใน|แถว|ใกล้)(?<where>.*)อยากกิน(?<food>.*)'},
]