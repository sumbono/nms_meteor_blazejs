// status_link = new Mongo.Collection("nms_site_status_link");

// status_link.featured = function(){
//     return status_link.find({}, {fields: {_id: 1, site: 1, status: 1}});
// }

status_link = new Mongo.Collection("nms_site_status_link");

status_link.featured = function(){
    return status_link.find({}, {fields: {_id: 1, dev_id: 1, site: 1, status: 1}});
}