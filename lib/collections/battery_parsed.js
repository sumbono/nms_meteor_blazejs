battery_parsed = new Mongo.Collection("nms_battery_parsed");

battery_parsed.featured = function(){
    return battery_parsed.find();
}
