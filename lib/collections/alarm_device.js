alarm_device = new Mongo.Collection('nms_alarm_device');

alarm_device.featured = function() {
  return alarm_device.find();
}