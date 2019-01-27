m_device = new Mongo.Collection("nms_m_device");

m_device.featured = function(){
    return m_device.find({}, {fields: {_id: 1, name: 1, description: 1, icon: 1, device_category_id: 1, position: 1}});
}
