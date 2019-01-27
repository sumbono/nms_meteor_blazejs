list_camera = new Mongo.Collection('nms_list_camera');
// list_camera = new Mongo.Collection('nms_show_camera');

list_camera.featured = function() {
  return list_camera.find({});
}
