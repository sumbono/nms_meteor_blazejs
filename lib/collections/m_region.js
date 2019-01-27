m_region = new Mongo.Collection("nms_m_region");

m_region.featured = function(){
    return m_region.find({}, {fields: {_id: 1, name: 1}});
}
