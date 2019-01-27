site_device_sensor = new Mongo.Collection("nms_site_device_sensor");

site_device_sensor.featured = function(){
    return site_device_sensor.find({}, {fields: {_id: 1, dev_id: 1, protocol_id: 1, sensor_name: 1, is_show: 1, unit: 1, description: 1, value_min: 1, value_max: 1, major_min: 1, major_max: 1, limit_min: 1, limit_max: 1, sensor_view: 1, valueNow: 1, persent: 1, colour: 1, condition: 1}});
}
