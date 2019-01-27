Meteor.publish("featured-regions",function(){
    return m_region.featured();
});
Meteor.publish("featured-provinces",function(){
    return m_province.featured();
});
Meteor.publish("featured-scopes",function(){
    return scope.featured();
});

Meteor.publish("featured-sites",function(){
    return site.featured();
});

Meteor.publish("featured-sites-setting",function( siteId, skipNumber ){
  check(siteId, Match.Any);
  check(skipNumber, Match.Any);
  if ( siteId === 'all' ) {
      return site.find({}, {limit: 10, sort: {name: 1}, skip: skipNumber} );
//     try {
//     } catch(error) {
//       console.log(error);
//     }
  } else {
      return site.find({ _id: new Mongo.ObjectID( siteId ) });
//     try {
//     } catch(error) {
//       console.log(error);
//     }
  }
});

Meteor.publish("featured-sitesRegion",function( data ){
  check(data, Match.Any);
  return site.find({ region_id: new Mongo.ObjectID( data ) }, { sort: {name: 1} } );
});

Meteor.publish("featured-sitesId",function( data ){
  check(data, Match.Any);
  return site.find({ _id: new Mongo.ObjectID( data ) });
});

Meteor.publish("featured-deviceCategory",function(){
    return m_device_category.featured();
});

Meteor.publish("featured-sitesDevices",function(){
  return site_device.featured();
});

Meteor.publish("featured-sitesDevicesRegion",function( data ){
  check(data, Match.Any);
  return site_device.find({ site_id: { $in: data } });
});

Meteor.publish("featured-sitesDeviceSensors",function( data ){
  check(data, Match.Any);
  return site_device_sensor.find({ dev_id: { $in: data } });
});

Meteor.publish("featured-devices", function(){
    return m_device.featured();
});

Meteor.publish("featured-protocols", function(){
    return m_protocol.featured();
});

Meteor.publish("featured-sitesDeviceSensorsAlarm",function( data ){
  check(data, Match.Any);
  return site_device_sensor.find({ dev_id : data });
});

Meteor.publish("featured-sitelog",function( data ){
  check(data, Match.Any);
  // console.log(`this devID is ${data.devId} and parameters is ${data.protocol}`);
  var self = this;
    try {
      var response = Sitelog.find({ dev_id : data.devId }, { sort: { _id : 1 } }).fetch();
      // console.log(`The number of documents for this devID ${data.devId} is ${response.length}.`);
      if (response.length>0) {
        var dataTrend = {};
        var dataElem = [];
        
        for (var j = 0; j < response.length; j++) {
          var parameter = response[j].data;
          let d = Date.parse( response[j].createdOn );
          var doc = {};
          for(let key in parameter) {
            if (key === data.protocol) {
              doc.T = d;
              doc[key] = parameter[key];
              // console.log(`doc for this devID ${item.dev_id}: `, doc);
              dataElem.push(doc);
            }
          }
        }
        dataTrend.dev_id = data.devId;
        dataTrend.param = data.protocol;
        // console.log(`Element number of this devID ${data.devId}-${data.protocol} is: ${dataElem.length}`);
        dataTrend.data = dataElem;
        // dataTrend['t_csrf'] = null;
        self.added('nms_sitelog', response[0]._id, dataTrend);
      }
      self.ready();
    } catch(error) {
      console.log(error);
    }  
});

Meteor.publish('featured-statusLink', function( data ) {
  check(data, Match.Any);
  return status_link.find({ site: { $in: data } });
});

Meteor.publish('featured-statusLinkAll', function( ) {
  return status_link.find({ });
});

Meteor.publish('featured-alarmDevices', function( data ) {
  check(data, Match.Any);
  return alarm_device.find({ Site: { $in: data } });
});

Meteor.publish('featured-alarmDevicesAll', function() {
  return alarm_device.find({});
});

Meteor.publish('featured-alarmDevicesAlarm', function( data ) {
  check(data, Match.Any);
  return alarm_device.find(
    {$and: [
        {Site: data.Site },
        {Device: data.Device },
        {Parameter: data.Parameter }
      ]}
  );
});

Meteor.publish('featured-alarmDevicesMenuNat', function( data ) {
  check(data, Match.Any);
  return alarm_device.find({
    $and: [
      { Status: { $in: ["CRITICAL_MIN", "CRITICAL_MAX", "MAJOR_MIN", "MAJOR_MAX"] } },
      // { }
    ]
  }, {limit: 15, sort : { Site : 1 }, skip: data});
  
});

Meteor.publish('featured-alarmMenuNetOne', function( site, skip ) {
  check(site, Match.Any);
  check(skip, Match.Any);
  var self = this;
    try {
      var response = alarm_device.find({
        $and: [
          { Status: { $in: ["CRITICAL_MIN", "CRITICAL_MAX", "MAJOR_MIN", "MAJOR_MAX"] } },
          { Site: { $in: site } }
        ]
      }, {limit: 15, sort : { Site : 1 }, skip: skip}).fetch();
      // console.log(`The number of documents for this devID ${data.devId} is ${response.length}.`);
      if (response.length>0) {
        _.each(response, (dataAlarm) => {
          self.added('nms_alarm_net_one', dataAlarm._id, 
             { 
                Site: dataAlarm.Site,
                Device: dataAlarm.Device,
                dev_id: dataAlarm.dev_id,
                Parameter: dataAlarm.Parameter,
                Value: dataAlarm.Value,
                Date: dataAlarm.Date,
                Status: dataAlarm.Status
             }
          );
        });
      }
      self.ready();
    } catch(error) {
      console.log(error);
    }
});

Meteor.publish('featured-alarmMenuNetTwo', function( site, skip ) {
  check(site, Match.Any);
  check(skip, Match.Any);
  var self = this;
    try {
      var response = alarm_device.find({
        $and: [
          { Status: { $in: ["CRITICAL_MIN", "CRITICAL_MAX", "MAJOR_MIN", "MAJOR_MAX"] } },
          { Site: { $in: site } }
        ]
      }, {limit: 15, sort : { Site : 1 }, skip: skip}).fetch();
      // console.log(`The number of documents for this devID ${data.devId} is ${response.length}.`);
      if (response.length>0) {
        _.each(response, (dataAlarm) => {
          self.added('nms_alarm_net_two', dataAlarm._id, 
             { 
                Site: dataAlarm.Site,
                Device: dataAlarm.Device,
                dev_id: dataAlarm.dev_id,
                Parameter: dataAlarm.Parameter,
                Value: dataAlarm.Value,
                Date: dataAlarm.Date,
                Status: dataAlarm.Status
             }
          );
        });
      }
      self.ready();
    } catch(error) {
      console.log(error);
    }
});

Meteor.publish('featured-alarmMenuNetSite', function( site ) {
  check(site, Match.Any);
  var self = this;
    try {
      var response = alarm_device.find({
        $and: [
          { Site: site },
          { Status: { $in: ["CRITICAL_MIN", "CRITICAL_MAX", "MAJOR_MIN", "MAJOR_MAX"] } }
        ]
      }, {limit: 50}).fetch();
      // console.log(`The number of documents for this devID ${data.devId} is ${response.length}.`);
      if (response.length>0) {
        // console.log(`this site alarm: `, response);
        _.each(response, (dataAlarm) => {
          self.added('nms_alarm_net_site', dataAlarm._id, 
             { 
                Site: dataAlarm.Site,
                Device: dataAlarm.Device,
                dev_id: dataAlarm.dev_id,
                Parameter: dataAlarm.Parameter,
                Value: dataAlarm.Value,
                Date: dataAlarm.Date,
                Status: dataAlarm.Status
             }
          );
        });
      }
      self.ready();
    } catch(error) {
      console.log(error);
    }
});

Meteor.publish('featured-dashboardTxGraph', function() {
  return dashboard_tx_graph.featured();
});

Meteor.publish('featured-dashboardRxGraph', function() {
  return dashboard_rx_graph.featured();
});

Meteor.publish('featured-dashboardTxGraph-Reg-Site', function( data ) {
  check(data, Match.Any);
  return dashboard_tx_graph.find({ site_id: { $in: data } });
});

Meteor.publish('featured-dashboardRxGraph-Reg-Site', function( data ) {
  check(data, Match.Any);
  return dashboard_rx_graph.find({ site_id: { $in: data } });
});

Meteor.publish('featured-listCamera', function( data ) {
  check(data, Match.Any);
  return list_camera.find({ dev_id: { $in: data } });
    // return list_camera.featured();
});

Meteor.publish("featured-battery-parsed",function( data ){
  check(data, Match.Any);
  return battery_parsed.find({ dev_id: { $in: data } });
});

Meteor.publish('userData', function () {
  var self = this;
  try {
    if ( Meteor.user().username === "admin" ) {
    // if ( Roles.userIsInRole(this.userId, ['admin']) ) {
      var response = Meteor.users.find({}).fetch();
      if (response.length>0) {
        _.each(response, (userData) => {
          if (userData.profile.site_id === "fihJ7FSBap8aFkjzF") {
            self.added('nms_users', userData._id, 
               { 
                  username: userData.username,
                  name: userData.profile.name,
                  email: userData.emails[0].address,
                  site_id: userData.profile.site_id,
                  scope: "National"
               }
            );
          } else {
            var siteNow = site.find({_id: new Mongo.ObjectID( userData.profile.site_id )}).fetch();
            if (siteNow.length>0) {
              self.added('nms_users', userData._id, 
                 { 
                    username: userData.username,
                    name: userData.profile.name,
                    email: userData.emails[0].address,
                    site_id: userData.profile.site_id,
                    scope: siteNow[0].name
                 }
              );
            } else {
              self.added('nms_users', userData._id, 
                 { 
                    username: userData.username,
                    name: userData.profile.name,
                    email: userData.emails[0].address,
                    site_id: userData.profile.site_id,
                    scope: ""
                 }
              );
            }
          }
        });
      }
      self.ready();
    
//     } else if ( Roles.userIsInRole(this.userId, ['ms']) ) {
    } else if ( Meteor.user().username === "ms_cudo" ) {
      var ms = Meteor.users.find({ username: { $nin: ['admin'] } }).fetch();
      if (ms.length>0) {
        _.each(ms, (userData) => {
          if (userData.profile.site_id === "fihJ7FSBap8aFkjzF") {
            self.added('nms_users', userData._id, 
               { 
                  username: userData.username,
                  name: userData.profile.name,
                  email: userData.emails[0].address,
                  site_id: userData.profile.site_id,
                  scope: "National"
               }
            );
          } else {
            var siteNow = site.find({_id: new Mongo.ObjectID( userData.profile.site_id )}).fetch();
            if (siteNow.length>0) {
              self.added('nms_users', userData._id, 
                 { 
                    username: userData.username,
                    name: userData.profile.name,
                    email: userData.emails[0].address,
                    site_id: userData.profile.site_id,
                    scope: siteNow[0].name
                 }
              );
            } else {
              self.added('nms_users', userData._id, 
                 { 
                    username: userData.username,
                    name: userData.profile.name,
                    email: userData.emails[0].address,
                    site_id: userData.profile.site_id,
                    scope: ""
                 }
              );
            }
          }
        });
      }
      self.ready();
      
    } else {
      var res = Meteor.users.find({_id: this.userId}).fetch();
      if (res.length>0) {
        _.each(res, (userData) => {
          if (userData.profile.site_id === "fihJ7FSBap8aFkjzF") {
            self.added('nms_users', userData._id, 
               { 
                  username: userData.username,
                  name: userData.profile.name,
                  email: userData.emails[0].address,
                  site_id: userData.profile.site_id,
                  scope: "National"
               }
            );
          } else {
            var siteNow = site.find({_id: new Mongo.ObjectID( userData.profile.site_id )}).fetch();
            if (siteNow.length>0) {
              self.added('nms_users', userData._id, 
                 { 
                    username: userData.username,
                    name: userData.profile.name,
                    email: userData.emails[0].address,
                    site_id: userData.profile.site_id,
                    scope: siteNow[0].name
                 }
              );
            } else {
              self.added('nms_users', userData._id, 
                 { 
                    username: userData.username,
                    name: userData.profile.name,
                    email: userData.emails[0].address,
                    site_id: userData.profile.site_id,
                    scope: ""
                 }
              );
            }
          }
        });
      }
      self.ready();
    }
    
  } catch(error) {
    console.log(error);
  }
});