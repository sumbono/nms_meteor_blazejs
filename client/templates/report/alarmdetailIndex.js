Template.alarmdetailIndex.onCreated(function(){
  var _self = this;
  
  var siteIni = site.find({_id: new Mongo.ObjectID( Session.get("siteId") ) }).fetch();
  var alarmParamIni = {
    Site: siteIni[0].name,
    Device: Session.get("deviceName"),
    Parameter: Session.get("parameterName")
  };
  // console.log(alarmParamIni);
  this.autorun(() => {
    // this.subscribe("featured-sites");
    this.subscribe("featured-alarmDevicesAlarm", alarmParamIni);
    this.subscribe("featured-sitesDeviceSensorsAlarm", Session.get("deviceId") );
    // this.subscribe("featured-sitesDevices");
  });
});

Template.alarmdetailIndex.helpers({
  
//   var qry = Request.param('query');
  alarmNational: function(){
    var siteSelected = site.find({_id: new Mongo.ObjectID( Session.get("siteId") ) }).fetch();
    console.log(`Site Selected id is: `, Session.get("siteId") );
    console.log(`Site Selected name is: `, siteSelected[0].name );
    console.log(`Device Selected id is: `, Session.get("deviceId") );
    console.log(`Device Selected name is: `, Session.get("deviceName") );
    console.log(`Parameter Selected name is: `, Session.get("parameterName") );
    
    var alarmDev = alarm_device.find(
        {
          $and: [
            {Site: siteSelected[0].name },
            {Device: Session.get("deviceName") },
            {Parameter: Session.get("parameterName") }
          ]
        } 
      ).fetch(); //ha
      return alarmDev;
    },
    deviceSensor: function(){
      
      var sensorbar = site_device_sensor.find(
        { 
          $and: [
            {dev_id: Session.get("deviceId") },
            {sensor_name: Session.get("parameterName") }
          ]
        }
      ).fetch();
      return sensorbar;
    },
});