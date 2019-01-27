Template.fuelSensor.onCreated(function(){
    var template = Template.instance();

    
})

var $ = {
    scopes : function(){
        Meteor.subscribe("featured-scopes");
        return scope.featured();
    },
    regions : function(){
        Meteor.subscribe("featured-regions");
        return m_region.featured();
    },
    deviceCategories : function(args){
        Meteor.subscribe("featured-deviceCategory");
        return m_device_category.find({ _id : new Mongo.ObjectID(args) }, {sort : { _id : -1}});
    },
    siteDevices : function(args){
        // if(typeof args === "object"){ args = args._str; }else{ args = args;}
        Meteor.subscribe("featured-sitesDevices");
        return site_device.find(args.hash);
    },
    siteDeviceCategory : function(args){
        if(typeof args === "object"){ args = args._str; }else{ args = args;}
        Meteor.subscribe("featured-sitesDevices");
        var c = site_device.find({site_id : new Mongo.ObjectID(args)});
        if(c.count() > 0){
            var data = [];
            _.each(c.fetch(), function(row){
                data.push(row.device_category_id._str);
            })

            let result = [];
            for (let index = 0; index < data.length; index++) {
                let el = data[index];
                if (!result.includes(el)) result.push(el);
            }
            return result;
        }
    },
    sites : function(args){
        Meteor.subscribe("featured-sites");
        let sitelist = [];
        return site.find({ region_id : args });
    },
    devices : function(args){
        if(typeof args !== "undefined"){
            Meteor.subscribe("featured-devices");
            return m_device.find({_id : new Mongo.ObjectID(args)});
        }
    },
    siteDevicesSensor : function(args){
        if(typeof args !== "undefined"){
            Meteor.subscribe("featured-sitesDeviceSensors");
            // var d = site_device_sensor.find(args.hash);
            // console.log(d.fetch());
            return site_device_sensor.find(args.hash);
        }
    }
}

Template.fuelSensor.helpers({
    data_scope : $.scopes,
    data_region : $.regions,
    data_device_category : $.deviceCategories,
    data_site_device_category : $.siteDeviceCategory,
    data_site_devices : $.siteDevices,
    data_site : $.sites,
    data_devices : $.devices,
    data_site_device_sensor : $.siteDevicesSensor,
    reportContent : function(){
        if(Session.get("r_content")) return Session.get("r_content");
        return "report";
    }
})
