m_protocol = new Mongo.Collection("nms_m_protocol");

m_protocol.featured = function() {
    return m_protocol.find();
}
