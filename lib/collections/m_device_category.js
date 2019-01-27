m_device_category = new Mongo.Collection("nms_m_device_category");

m_device_category.featured = function(){
    return m_device_category.find({}, {fields: {_id: 1, name: 1, position: 1}});
}
