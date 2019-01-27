Template.receiver.onCreated( function(){
    var template = Template.instance();
})

var DATA = {
    scopes : function(){
        Meteor.subscribe("featured-scopes");
        return scope.featured();
    },
    protocol : function(args){
        if(typeof args === "object"){ args = args._str; }else{ args = args; }
        Meteor.subscribe("featured-protocols");
        return m_protocol.find({_id : new Mongo.ObjectID(args)});
    },
    deviceCategories : function(args){
        Meteor.subscribe("featured-deviceCategory");
        return m_device_category.find({ _id : new Mongo.ObjectID(args) }, {sort : { _id : -1}});
    },
    siteDevices : function(args){
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
            return site_device_sensor.find(args.hash);
        }
    }
    // sitelog_vNow : function(args){
    //     Meteor.subscribe("featured-sitelog");
    //     return sitelog.find({ dev_id : args.dev_id }, { sort:{ createdOn : -1 }, limit : 1 } ).fetch()[0];
    // }
}

Template.receiver.helpers({
    data_scope : DATA.scopes,
    data_protocol : DATA.protocol,
    data_device_category : DATA.deviceCategories,
    data_site_device_category : DATA.siteDeviceCategory,
    data_site_devices : DATA.siteDevices,
    data_site : DATA.sites,
    data_devices : DATA.devices,
    data_site_device_sensor : DATA.siteDevicesSensor,
    // persentase : function(args){
    //     args = args.hash;
    //     sitelog.findOne({ dev_id : args.dev_id }, { sort:{ createdOn : -1 }, limit : 1 } );
    //     var log = DATA.sitelog_vNow(args);
    //     if(typeof log !== 'undefined'){
    //         if(args.protocol in log.data){
    //             // if(Number.isInteger(log.data[args.protocol]) === false) v_now = 0;
    //             var n = (log.data[args.protocol] / args.v_max) * 100;
    //             console.log(n);
    //             return parseFloat(n).toFixed(2) + "%";
    //         }
    //     }
    // },
    // valueNow : function(args){
    //     args = args.hash;
    //     var log = DATA.sitelog_vNow(args);
    //     if(typeof log !== 'undefined'){
    //         if(args.protocol in log.data){
    //             return log.data[args.protocol];
    //         }
    //     }
    // },
    reportContent : function(){
        if(Session.get("r_content")) return Session.get("r_content");
        return "report";
    }
})
