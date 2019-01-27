m_province = new Mongo.Collection("nms_m_province");

m_province.featured = function(){
    return m_province.find({}, { fields: {_id: 1, name: 1, region_id: 1} });
}
