site_device = new Mongo.Collection("nms_site_device");

site_device.featured = function(obj){
  return site_device.find({}, {fields: {_id: 1, dev_id: 1, site_id: 1, device_category_id: 1, device_id: 1, title: 1, title2: 1, status: 1, position: 1}});
}

// site_device.aggregated = function(args){
//     var d = site_device.aggregate([{
//         $match : {
//             site_id : new Mongo.ObjectID("5b59931c6f97984a0ad8c688") }
//         },{
//         $group : {
//             _id : "$device_category_id" }
//         }]);
//
//     return site_device.aggregate(args);
// }
