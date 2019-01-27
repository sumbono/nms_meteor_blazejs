import { Tracker } from 'meteor/tracker';

Template.sidebar.onCreated(function(){
  var _self = this;
  // this.subscribe("featured-deviceCategory");
  this.subscribe("featured-protocols");
  this.subscribe("featured-deviceCategory");
  
  this.autorun(() => {
    if ( Meteor.userId() ) {
      let userNat = scope.find({ _id: Meteor.user().profile.site_id }).fetch();
      // console.log(`user national: `, userNat);
      if ( userNat.length>0 ) {
        this.subscribe("featured-sites");
        this.subscribe("featured-sitesDevices");
        this.subscribe("featured-statusLinkAll");
        this.subscribe("featured-alarmDevicesAll");

      } else {
        let userRegion = m_region.find({ _id: new Mongo.ObjectID( Meteor.user().profile.site_id ) }).fetch();
        // console.log(`user Region: `, userRegion);
        if ( userRegion.length>0 ) {
          this.subscribe("featured-sitesRegion", Meteor.user().profile.site_id );
          //use interval before sites was added or sites subscribe is ready:
          var startTime = new Date().getTime();
          var getSite = setInterval( function() {
            let siteListIni = site.find({ region_id : userRegion[0]._id }, { sort: {name: 1} }).fetch();
            var listIdSite = [],
                listNameSite = [], 
                listNumberSite = [];
            if ( siteListIni.length>0 ) {
              _.each(siteListIni, function(site) {
                listIdSite.push(site._id);
                listNumberSite.push(site.site_id);
                listNameSite.push(site.name);
              });
              Meteor.subscribe("featured-sitesDevicesRegion", listIdSite);
              Meteor.subscribe('featured-statusLink', listNumberSite);
              Meteor.subscribe('featured-alarmDevices', listNameSite);
              clearInterval(getSite);
            } else {
              if( (new Date().getTime()) - startTime >= 100000 ){
                clearInterval(getSite);
              }
            }
          }, 5000 );

        } else {
          let idSite = [new Mongo.ObjectID( Meteor.user().profile.site_id )];
          Meteor.subscribe( "featured-sitesId", Meteor.user().profile.site_id );
          var getSiteList = setInterval( function() {
            let userSite = site.find({ _id: new Mongo.ObjectID( Meteor.user().profile.site_id ) }).fetch();
            if ( userSite.length>0) {
              let numberSite = [userSite[0].site_id],
                  nameSite = [userSite[0].name];
              console.log(`list ID site: `, idSite);
              console.log(`list Number site: `, numberSite);
              Meteor.subscribe("featured-sitesDevicesRegion", idSite);
              Meteor.subscribe('featured-statusLink', numberSite);
              Meteor.subscribe('featured-alarmDevices', nameSite);
              clearInterval(getSiteList);
            } else {
              if( (new Date().getTime()) - startTime >= 100000 ){
                clearInterval(getSiteList);
              }
            }
          }, 5000 );

        }
      } 
    }
  });
  
})

var SIDEBAR = {
    scopes : function(){
      return scope.featured();
    },
    regions : function(){
      let userNat = scope.find({ _id: Meteor.user().profile.site_id }).fetch();
      if ( userNat.length>0 ) {
        return m_region.find({});
      } else {
        let userRegIni = m_region.find({ _id: new Mongo.ObjectID( Meteor.user().profile.site_id ) });
        if (userRegIni.fetch().length>0) {
          return userRegIni;
        } else {
          let siteRegion = site.find({ _id: new Mongo.ObjectID( Meteor.user().profile.site_id ) }).fetch();
          if ( siteRegion.length>0 ) {
            // let regId = siteRegion[0].region_id;
            return m_region.find({ _id: siteRegion[0].region_id });
          } else {
           return []; 
          }
        }
      }
    },
    deviceCategories : function(args){ // args => id._str
        if(typeof args === "object"){ args = args._str; }else{ args = args;}
        var siteDev     = site_device.find({site_id : new Mongo.ObjectID(args)});
        var devCategory = m_device_category.find({}, {sort : { position : 1}});

        if(siteDev.count() > 0){
            var data = new Array();
            _.each(devCategory.fetch(), function(category){
                _.each(m_device.find({device_category_id : category._id}).fetch(), function(row){
                    // var g = _.indexBy(site_device.find({site_id : new Mongo.ObjectID(args), device_id : value._id}).fetch(), 'site_id');
                    var g = site_device.find({site_id : new Mongo.ObjectID(args), device_id : row._id}).fetch();
                    if(g.length){
                        data.push(category);
                        var z = _.indexBy(g, 'site_id');
                        _.each(g, function(s){
                        })
                    }
                })
            })
            let result = [];
            for (let index = 0; index < data.length; index++) {
                let el = data[index];
                if (!result.includes(el)) result.push(el);
            }
            return result;
        }
    },
    siteDevices : function(args){
        var siteDev     = site_device.find({site_id : new Mongo.ObjectID(args.site_id)});
        var devCategory = m_device_category.find({_id : new Mongo.ObjectID(args.device_category_id)}, {sort : { position : 1}});

        if(siteDev.count() > 0){
            var data = new Array();
            _.each(devCategory.fetch(), function(category){
                _.each(m_device.find({device_category_id : category._id}).fetch(), function(row){
                    var g = site_device.find({site_id : new Mongo.ObjectID(args.site_id), device_id : row._id}).fetch();
                    if(g.length){
                        data.push(row);
                        var z = _.indexBy(g, 'site_id');
                        _.each(g, function(s){
                        })
                    }
                })
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
//         return site.find({ region_id : args });
        return site.find({ region_id : args }, { sort: {name: 1} });
    },
    criDevSiteNumber: function(){
      var siteSelected = site.find({_id: new Mongo.ObjectID( Session.get("siteId") ) }).fetch();
//     console.log(`Site Selected Name is: `, siteSelected[0].name);
      var criDev_device = alarm_device.find(
        {
          $and: [
            {Site: siteSelected[0].name},
            {Status: { $in: ["CRITICAL_MIN", "CRITICAL_MAX"] }}
          ]
        } 
      ).fetch(); //hasilnya array of alarm device by Site Name
//         console.log(criDev_site);
      let criSiteLength = criDev_device.length;
      return criSiteLength;
    },
   criDevPersenSiteNumber: function(){
      var siteSelected = site.find({_id: new Mongo.ObjectID( Session.get("siteId") ) }).fetch();
//     console.log(`Site Selected Name is: `, siteSelected[0].name);
      var criDevPersen_device = alarm_device.find(
        {
          $and: [
            {Site: siteSelected[0].name},
            {Status: { $in: ["CRITICAL_MIN", "CRITICAL_MAX"] }}
          ]
        } 
      ).fetch(); //hasilnya array of alarm device by Site Name
     
     var totalDev_device = alarm_device.find(
        {
          $and: [
            {Site: siteSelected[0].name},
            {Status: { $in: ["CRITICAL_MIN", "CRITICAL_MAX", "MAJOR_MIN", "MAJOR_MAX"] }}
          ]
        } 
      ).fetch(); //hasilnya array of alarm device by Site Name
      if (totalDev_device.length >0) {
         var percentage_critical = (criDevPersen_device.length / totalDev_device.length) * 100 ;
          let compareAllDev  = `${percentage_critical.toFixed(0)}%` ;
//         console.log(criDev_site);
          return compareAllDev;
      } else {
          return "0%";
      }
     
    },
    majDevSiteNumber: function(){
      var siteSelected = site.find({_id: new Mongo.ObjectID( Session.get("siteId") ) }).fetch();
      // console.log(`Site Selected Name is: `, siteSelected[0].name);
      var majDev_device = alarm_device.find(
        {
          $and: [
            {Site: siteSelected[0].name},
            {Status: { $in: ["MAJOR_MIN", "MAJOR_MAX"] }}
          ]
        } 
      ).fetch(); //hasilnya array of alarm device by Site Name
//       console.log(majDev_site);
      let majSiteLength = majDev_device.length;
      return majSiteLength;
    },
    majDevPersenSiteNumber: function(){
      var siteSelected = site.find({_id: new Mongo.ObjectID( Session.get("siteId") ) }).fetch();
//     console.log(`Site Selected Name is: `, siteSelected[0].name);
      var majDevPersen_device = alarm_device.find(
        {
          $and: [
            {Site: siteSelected[0].name},
            {Status: { $in: ["MAJOR_MIN", "MAJOR_MAX"] }}
          ]
        } 
      ).fetch(); //hasilnya array of alarm device by Site Name
     var totalDev_device = alarm_device.find(
        {
          $and: [
            {Site: siteSelected[0].name},
            {Status: { $in: ["CRITICAL_MIN", "CRITICAL_MAX", "MAJOR_MIN", "MAJOR_MAX"] }}
          ]
        } 
      ).fetch(); //hasilnya array of alarm device by Site Name
      if (totalDev_device.length >0) {
         var percentage_major = (majDevPersen_device.length / totalDev_device.length) * 100 ;
            let compareAllDev  = `${percentage_major.toFixed(0)}%` ;
//         console.log(criDev_site);
//       let criSiteLength = criDevPersen_device.length;
              return compareAllDev;
      } else {
          return "0%";
      }
     
    },
    statusLink : function(args){
      var siteNum = site.find({_id : new Mongo.ObjectID(args.site_id)}).fetch();
      // console.log(`site chosen: `, siteNum);
      
      var numberSite = siteNum[0].site_id;
      var device_devID = args.dev_id;
      
      var status_siteLink = status_link.find(
        {
          $and : [
            {dev_id: device_devID},
            {site: numberSite}
          ]
        }
      ).fetch();
      
      // console.log(`link site: `, status_siteLink);
      if (status_siteLink.length>0) {
        return status_siteLink;
      } else {
        var tahapOne = [1, 2, 3, 4, 5, 6];
        var n = tahapOne.includes( numberSite );
        
        if (n === true) {
          return [];
        } else {
          return [
//             {
//               dev_id: device_devID,
//               site: numberSite,
//               status: "E"
//             }
          ];
        }
      }
    },
//     alarmDataMajor: function(args){
//       var siteSelected = site.find({_id : new Mongo.ObjectID(args.site_id)}).fetch();
//     },
}

Template.sidebar.onDestroyed(function(){
    $('aside.control-sidebar').removeClass("control-sidebar-open");
    $("body").removeClass("control-sidebar-open");
});

Template.sidebar.helpers({
  data_scope : SIDEBAR.scopes,
  data_region : SIDEBAR.regions,
  data_device_category : SIDEBAR.deviceCategories,
  data_site : SIDEBAR.sites,
  data_pernetwork : SIDEBAR.pernetwork,
  data_site_link : SIDEBAR.status_link,
  critical_jumlah : SIDEBAR.criDevSiteNumber,
  major_jumlah : SIDEBAR.majDevSiteNumber,
  // site_dev_status_normal_num : SIDEBAR.normalDevSiteNumber,
  critical_persen : SIDEBAR.criDevPersenSiteNumber,
  major_persen : SIDEBAR.majDevPersenSiteNumber,
  majDev: function(){
    let maj_dev     = site_device.find({ status: { $in: [ "MAJOR"] } }).count();
    let compareMajDev = `${maj_dev.toString()}`;
    return compareMajDev;
  },
  majDevPersen: function(){
    let maj_dev     = site_device.find({ status: { $in: [ "MAJOR"] } }).count();
    let total_dev   = site_device.find({ status: { $nin: [ "NOT_AVAILABLE", "OFFLINE"] } }).count();
    let maj_persen = (maj_dev/total_dev)*100;
    let compareMajDev = `${maj_persen.toFixed(0)}%`;
    return compareMajDev;
  },
  criDev: function(){
    let cri_dev     = site_device.find({ status: { $in: ["CRITICAL"] } }).count();
    let compareCriDev = `${cri_dev.toString()}`;
    return compareCriDev;
  },
  criDevPersen: function(){
    let cri_dev     = site_device.find({ status: { $in: ["CRITICAL"] } }).count();
    let total_dev   = site_device.find({ status: { $nin: [ "NOT_AVAILABLE", "OFFLINE"] } }).count();
    let cri_persen = (cri_dev/total_dev)*100;
    let compareCriDev = `${cri_persen.toFixed(0)}%`;
    return compareCriDev;
  },
})


Template.sidebar.events({
    
    'click a[class="buttonpertama"]': function (e){
      e.preventDefault();
      Session.set("contentReport","dashboardNasional");
    },
    'click a[id="region"]' : function(e, t){
      e.preventDefault();
      var el = e.currentTarget;
      if($(el).attr('data-namanet') == 'NETWORK 1'){
       Session.set("contentReport","dashboardNetwork");
      } else if($(el).attr('data-namanet') == 'NETWORK 2'){
       Session.set("contentReport","dashboardNetwork2");
     }
    },
    'click a[id="site"]' : function(e, t){
        e.preventDefault();
        var el = e.currentTarget;
        Session.set("contentReport","siteIndex");
        Session.set("siteId", $(el).data("siteid"));
        // console.log(`data-siteid: `, $(el).data("siteid") );
        Session.set("nama_tempat_site", e.target.innerHTML);
        $('aside.control-sidebar').addClass("control-sidebar-open");
        $("body").addClass("control-sidebar-open");
        $data = '';
        $dataLoading = '<div>Collecting data... <i class="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom fa-spin" style="font-size:24px;color:blue"></i></div>';
        
        $('.div_device_right').show();
        $('.panel-data').html($dataLoading);
        var startTime = new Date().getTime();

        var getDevCat = setInterval(() => {
          var getDeviceCat = SIDEBAR.deviceCategories($(el).data("siteid"));
            //console.log(getDeviceCat);
          if ( getDeviceCat === undefined ) {
            //console.log(`startTime DevCat: ${startTime}`);
            if( (new Date().getTime()) - startTime >= 30000 ){
              $dataNull = '<span>No Devices.</span>';
              $('.panel-data').html($dataNull);
              clearInterval(getDevCat);
            }
          } else if ( getDeviceCat.length>0 ) {
            _.each(getDeviceCat, function(row){
            // console.log('row', row);
                $data += '<li style="padding-bottom: 4px"><a href="#" id="site_device_category_yellow" parent-menu="'+Session.get("siteId")+'" data-devicecategoryid="'+row._id+'" style="color: #444;"><i class="fa fa-circle-o"></i>&nbsp;'+ row.name +'</a></li>';
            });
            // $('.div_device_right').show();
            $('.panel-data').html($data);
            clearInterval(getDevCat);
          } else {
            //console.log(`startTime DevCat: ${startTime}`);
            if( (new Date().getTime()) - startTime >= 30000 ){
              $dataNull = '<span>No Devices.</span>';
              $('.panel-data').html($dataNull);
              clearInterval(getDevCat);
            }
          }
        }, 1000 );

        //Communication:
        $comm = '';
        $('.communication').html($dataLoading);

        let getCommLink = setInterval(() => {
          var comm = SIDEBAR.statusLink({ site_id: $(el).data("siteid"), dev_id : 1 });  
          // console.log('comm1', comm);
          if (comm.length>0) {
            if (comm[0].status === "A" || comm[0].status === "B") {
              $comm += '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span class="label '+comm[0].status+'">Active</span>';
            } else if (comm[0].status === "C" || comm[0].status === "D") {
              $comm += '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span class="label '+comm[0].status+'">Slow Connection</span>';
            } else if (comm[0].status === "E") {
              $comm += '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span class="label C">Slow Connection</span>';
            } else {
              // $comm += '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span class="label '+comm[0].status+'">Offline</span>';
              comm = SIDEBAR.statusLink({ site_id: $(el).data("siteid") , dev_id : 0 });
              // console.log('comm2', comm);
              if (comm.length>0) {
                if (comm[0].status === "A" || comm[0].status === "B") {
                  $comm += '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span class="label '+comm[0].status+'">Active</span>';
                } else if (comm[0].status === "C" || comm[0].status === "D") {
                  $comm += '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span class="label '+comm[0].status+'">Slow Connection</span>';
                } else if (comm[0].status === "E") {
                  $comm += '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span class="label C">Slow Connection</span>';
                } else {
                  $comm += '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span class="label '+comm[0].status+'">Offline</span>';
                }
                $('.communication').html($comm);
                clearInterval(getCommLink);
              } 
//                   else {
//                     if( (new Date().getTime()) - startTime >= 60000 ){
//                       $dataNull = '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span >No Devices</span>';
//                       $('.communication').html($dataNull);
//                       clearInterval(getCommLink);
//                     }
//                   }
            }
          } else {
            comm = SIDEBAR.statusLink({ site_id: $(el).data("siteid") , dev_id : 0 });
            // console.log('comm3', comm);
            if ( comm.length>0 ) {
              if (comm[0].status === "A" || comm[0].status === "B") {
                $comm += '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span class="label '+comm[0].status+'">Active</span>';
              } else if (comm[0].status === "C" || comm[0].status === "D") {
                $comm += '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span class="label '+comm[0].status+'">Slow Connection</span>';
              } else if (comm[0].status === "E") {
                $comm += '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span class="label C">Slow Connection</span>';
              } else {
                $comm += '<i class="fa fa-circle-o" style="color: "></i>&nbsp;LAN/Cellular <span class="label '+comm[0].status+'">Offline</span>';
              }
              $('.communication').html($comm);
              clearInterval(getCommLink);
            } else {
              //console.log(`startTime Comm: ${startTime}`);
              if( (new Date().getTime()) - startTime >= 60000 ){
                $dataNull = '<i class="fa fa-circle-o" style="color: "></i>No Devices';
                $('.communication').html($dataNull);
                clearInterval(getCommLink);
              }
            }
          }
          // clearInterval(getCommLink);
        }, 1000);

        //Controller Squash [1]:
        $squash = '';
        $('.controller1').html($dataLoading);
        let getSquash = setInterval(() => {
          var squash = SIDEBAR.statusLink({ site_id: $(el).data("siteid"), dev_id : 1 });
          if (squash.length>0) {
              if (squash[0].status === "A" || squash[0].status === "B") {
                $squash += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Squash</a> <span class="label '+squash[0].status+'">Active</span>';
              } else if (squash[0].status === "C" || squash[0].status === "D") {
                $squash += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Squash</a> <span class="label '+squash[0].status+'">Slow Connection</span>';
              } else if (squash[0].status === "E") {
                $squash += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Squash</a> <span class="label C">Slow Connection</span>';
              } else {
                $squash += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Squash</a> <span class="label '+squash[0].status+'">Offline</span>';
              }
              $('.controller1').html($squash);
              clearInterval(getSquash);
          } else {
              squash = SIDEBAR.statusLink({ site_id: $(el).data("siteid") , dev_id : 0 });
              if (squash.length>0) {
                if (squash[0].status === "A" || squash[0].status === "B") {
                  $squash += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Squash</a> <span class="label '+squash[0].status+'">Active</span>';
                } else if (squash[0].status === "C" || squash[0].status === "D") {
                  $squash += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Squash</a> <span class="label '+squash[0].status+'">Slow Connection</span>';
                } else if (squash[0].status === "E") {
                  $squash += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Squash</a> <span class="label C">Slow Connection</span>';
                } else {
                  $squash += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Squash</a> <span class="label '+squash[0].status+'">Offline</span>';
                }
                $('.controller1').html($squash);
                clearInterval(getSquash);
              } else {
                //console.log(`startTime Squash: ${startTime}`);
                if( (new Date().getTime()) - startTime >= 60000 ){
                  $dataNull = '<i class="fa fa-circle-o" style="color: "></i>No Devices';
                  $('.controller1').html($dataNull);
                  clearInterval(getSquash);
                }
              }
          }
        }, 1000);

        //Controller MW [0]:
        $mw = '';
        $('.controller2').html($dataLoading);
        let getMw = setInterval(() => {
          var mw = SIDEBAR.statusLink({ site_id: $(el).data("siteid"), dev_id : 0 });
          if (mw.length>0) {
              if (mw[0].status === "A" || mw[0].status === "B") {
                $mw += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Middleware</a> <span class="label '+mw[0].status+'">Active</span>';
              } else if (mw[0].status === "C" || mw[0].status === "D") {
                $mw += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Middleware</a> <span class="label '+mw[0].status+'">Slow Connection</span>';
              } else if (mw[0].status === "E") {
                $mw += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Middleware</a> <span class="label C">Slow Connection</span>';
              } else {
                $mw += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Middleware</a> <span class="label '+mw[0].status+'">Offline</span>';
              }
              $('.controller2').html($mw);
              clearInterval(getMw);
          } else {
              mw = SIDEBAR.statusLink({ site_id: $(el).data("siteid"), dev_id : 1 });
              if (mw.length>0) {
                if (mw[0].status === "A" || mw[0].status === "B") {
                  $mw += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Middleware</a> <span class="label '+mw[0].status+'">Active</span>';
                } else if (mw[0].status === "C" || mw[0].status === "D") {
                  $mw += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Middleware</a> <span class="label '+mw[0].status+'">Slow Connection</span>';
                }  else if (mw[0].status === "E") {
                  $mw += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Middleware</a> <span class="label C">Slow Connection</span>';
                } else {
                  $mw += '<a href="#" style="color: #444;"><i class="fa fa-circle-o" style="color: "></i>&nbsp;Middleware</a> <span class="label '+mw[0].status+'">Offline</span>';
                }
                $('.controller2').html($mw);
                clearInterval(getMw);
              } else {
                //console.log(`startTime MW: ${startTime}`);
                if( (new Date().getTime()) - startTime >= 60000 ){
                  $dataNull = '<i class="fa fa-circle-o" style="color: "></i>&nbsp;No Devices';
                  $('.controller2').html($dataNull);
                  clearInterval(getMw);
                }
              }
          }
        }, 1000);

        //get dev_id for site_device battery:
        // var startTime = new Date().getTime();
        Tracker.autorun(function() {
          var idBatt = [];
          var getBattData = setInterval( function() {
            var getDataBatt = site_device.find(
              {
                $and: [
                  { site_id : new Mongo.ObjectID( $(el).data("siteid") ) },
                  { device_id: new Mongo.ObjectID("5b59a20ca2e7142d4bcbe4d9") }
                ]
              }
            ).fetch();
            if ( getDataBatt.length>0) {
              _.each(getDataBatt, function(doc){
                idBatt.push( doc.dev_id );
              });
              //console.log(`this battery dev_id is: ${idBatt}`);
//                   Session.set("idBatt", idBatt );
//             Tracker.autorun(function() {
//             });
              Meteor.subscribe("featured-battery-parsed", idBatt );
              clearInterval(getBattData);
            } else {
              //console.log(`startTime battery: ${startTime}`);
              if( (new Date().getTime()) - startTime >= 60000 ){
                // Session.set("idBatt", idBatt );
//             Tracker.autorun(function() {
//             });
                Meteor.subscribe("featured-battery-parsed", idBatt );
                clearInterval(getBattData);
              }
            }
          }, 1000);
        });

        //get dev_id for site_device camera:
        Tracker.autorun(function() {
          var idCam = [];
          var getDataCam = setInterval(() => {
            var siteDevCam = site_device.find(
              {
                $and: [
                  { site_id : new Mongo.ObjectID( $(el).data("siteid") ) },
                  { device_id: new Mongo.ObjectID("5b8023de15bcf0250de68974") }
                ]
              }
            ).fetch();
            if (siteDevCam.length>0) {
              _.each(siteDevCam, function(doc){
                idCam.push( doc.dev_id );
              });
//                   Tracker.autorun(function() {
//                   });
              Meteor.subscribe("featured-listCamera", idCam );
              clearInterval(getDataCam);
            } else {
              //console.log(`startTime camera: ${startTime}`);
              if( (new Date().getTime()) - startTime >= 60000 ){
//                     Tracker.autorun(function() {
//                     });
                Meteor.subscribe("featured-listCamera", idCam );
                clearInterval(getDataCam);
              }
            }

          }, 1000);
        });

        //get dev_id for site_device All:
        Tracker.autorun(function() {
          var devIdAll = [];
          var getDataSensors = setInterval(() => {
            var siteDevAll = site_device.find({ site_id : new Mongo.ObjectID( $(el).data("siteid") ) }).fetch();
            if (siteDevAll.length>0) {
              _.each(siteDevAll, function(doc){
                devIdAll.push( doc.dev_id );
              });
              // Meteor.subscribe("featured-sitesDeviceSensors", devIdAll );
              Session.set("devIdAll", devIdAll );
              clearInterval(getDataSensors);
            } else {
              //console.log(`startTime sensors all: ${startTime}`);
              if( (new Date().getTime()) - startTime >= 60000 ){
                // Meteor.subscribe("featured-sitesDeviceSensors", devIdAll );
                Session.set("devIdAll", devIdAll );
                clearInterval(getDataSensors);
                alert(`This site has no devices yet. Switch to another site.`);
              }
            }
          }, 1000);
          // console.log(`this site all dev_id is: ${Session.get("devIdAll")}`);
        });
    },
    'click a[id="site_device_category"]' : function(e, t){
        e.preventDefault();
        var el = e.currentTarget;
        $('aside.control-sidebar').addClass("control-sidebar-open");
        $("body").addClass("control-sidebar-open");
        Session.set("deviceId", $(el).data("siteid"));
        $('aside.control-sidebar').addClass("control-sidebar-open");
        $data = '';
        var d = SIDEBAR.siteDevices({site_id: Session.get("siteId"), device_category_id : $(el).data("devicecategoryid")});
        
        _.each(d, function(row){
            if(d.length>1) {
                $data += '<li style="padding-bottom: 4px"><a id="submenu_yellow"  href="#" style="color: #444;"><i class="fa fa-circle-o"></i>&nbsp;'+ row.name +'</a></li>';
            }else{
                $data += '<li style="padding-bottom: 4px"><a id="submenu_yellow" href="#" style="color: #444;"><i class="fa fa-circle"></i>&nbsp;'+ row.name +'</a></li>';
            }
        });
        // Router.go('/report');
        var div_id=$(el).attr('data-deviceCategoryID');
        var parent_menu=$(el).attr('parent-menu');
        $('.div_device_right').hide();
        $('.div_device_right#div_'+div_id).show();
        var col=$(el).parents('ul.treeview-menu.treeview-menu-last.menu-open').children('li').removeClass('active')
        $(el).parent('li').addClass('active')
        $('.panel-data').html($data);
    },
    'click a[id="site_device_category_yellow"]' : function(e, t){
        var el=e.currentTarget;
        var id=$(el).attr('data-devicecategoryid');
        var parent_menu=$(el).attr('parent-menu');
        if(!$('#site_menu[region-id="'+parent_menu+'"]').hasClass('active')){
            $('#site_menu[region-id="'+parent_menu+'"]').addClass('active')
            $('#site_menu[region-id="'+parent_menu+'"]').children('ul.treeview-menu.treeview-menu-last').addClass('menu-open')
            $('#site_menu[region-id="'+parent_menu+'"]').children('ul.treeview-menu.treeview-menu-last').show();
        }
        $('#site_menu[region-id="'+parent_menu+'"]').find('#site_device_category[data-devicecategoryid="'+id+'"]').trigger('click')
    },
    'click a[id="region_yellow"]' : function(e, t){
        var el=e.currentTarget;
        var region_id=$(el).attr('region-id');
        var site_id=$(el).attr('site-id');
        console.log($('#region[data-regionid="'+region_id+'"]'), 'region menu')
        if(!$('#region_menu[data-regionid="'+region_id+'"]').hasClass('active')){
            $('#region_menu[data-regionid="'+region_id+'"]').addClass('active')
            $('#region_menu[data-regionid="'+region_id+'"]').children('#sub_region_menu').addClass('menu-open')
            $('#region_menu[data-regionid="'+region_id+'"]').children('#sub_region_menu').show();
        }
        $('#site[data-siteid="'+site_id+'"]').trigger('click')
    },    
    'click a[id="submenu_yellow"]' : function(e, t){
        var el=e.currentTarget;
        $('a#submenu_yellow i').attr('class', 'fa fa-circle-o')
        $(el).children('i').attr('class', 'fa fa-circle')
    },
    'click button[data-toggle="control-sidebar"]' : function(e, t){
        $('aside.control-sidebar').removeClass("control-sidebar-open");
        $("body").removeClass("control-sidebar-open");
    },
    'click #majorgrup' : function(e) {
      var siteSelected = site.find({_id: new Mongo.ObjectID( Session.get("siteId") ) }).fetch();
      // console.log(`Site Selected Name is: `, siteSelected[0].name);
      // console.log(`Site Selected Name is: `, Session.get("siteId") );
      var alarmDev = alarm_device.find(
        {
          $and: [ {Site: siteSelected[0].name}, {Status: { $in: ["MAJOR_MIN", "MAJOR_MAX"] }} ]
        } 
      ).fetch(); //hasilnya array of alarm device by Site Name
      $majorAlarm = '';
      if (alarmDev.length>1) {
        _.each(alarmDev, function(row){
          $majorAlarm += `<tr class="" data-index="0">
                            <td style="text-align: center; width: 15%; " >${row.Date}</td>
                            <td style="text-align: center; width: 8%; " id="sensor" data-parameter="${row.Parameter}">${row.Parameter}</td>
                            <td style=""  id="devsensor" data-device="${row.dev_id}" data-devicename="${row.Device}" >${row.Device}</td>
                            <td style="">${row.Value}</td>
                            <td style=""><span class="btn btn-xs btn-warning label C" id="detailbar">${row.Status}</span></td>
                            <td style="">Active</td>
                          </tr>`;
        });  
      } else {
        $majorAlarm += `<tr class="" data-index="0">
                          <td style="text-align: center; width: 15%; ">-</td>
                          <td style="text-align: center; width: 8%; ">-</td>
                          <td style="">-</td>
                          <td style="">-</td>
                          <td style=""><span class="btn btn-xs btn-warning label C" id="detailbar">-</span></td>
                          <td style="">-</td>
                        </tr>`;
      }
      
      $('.majorData').html($majorAlarm);
      $('.modalmajor').modal('show')
    },
    'click #criticalgrup' : function(e) {
     var siteSelected = site.find({_id: new Mongo.ObjectID( Session.get("siteId") ) }).fetch();
//     console.log(`Site Selected Name is: `, siteSelected[0].name);
      var alarmDev = alarm_device.find(
        {
          $and: [
            {Site: siteSelected[0].name},
            {Status: { $in: ["CRITICAL_MIN", "CRITICAL_MAX"] }}
          ]
        } 
      ).fetch(); //hasilnya array of alarm device by Site Name
      $criticalAlarm = '';
      if (alarmDev.length>1) {
        _.each(alarmDev, function(row){
          $criticalAlarm += `<tr class="" data-index="0">
                            <td style="text-align: center; width: 15%; " >${row.Date}</td>
                            <td style="text-align: center; width: 8%; " id="sensor" data-parameter="${row.Parameter}">${row.Parameter}</td>
                            <td style=""  id="devsensor" data-device="${row.dev_id}" data-devicename="${row.Device}" >${row.Device}</td>
                            <td style="">${row.Value}</td>
                            <td style=""><span class="btn btn-xs btn-danger label E" id="detailbar">${row.Status}</span></td>
                            <td style="">Active</td>
                          </tr>`;
        });  
      } else {
        $criticalAlarm += `<tr class="" data-index="0">
                          <td style="text-align: center; width: 15%; ">-</td>
                          <td style="text-align: center; width: 8%; ">-</td>
                          <td style="">-</td>
                          <td style="">-</td>
                          <td style=""><span class="btn btn-xs btn-danger label E" id="detailbar">-</span></td>
                          <td style="">-</td>
                        </tr>`;
      }
      
      $('.criticalData').html($criticalAlarm);
      
      $('.modalcritical').modal('show')
    },
    'click #alarmhistory' : function(e) {
      $('.modalhistory').modal('show')
    },
     'click #detailbar': function(e) {
      var el = e.currentTarget;
      var target=e.target;
      var deviceId = $(target).parents("tr").find("#devsensor").data("device");
      var deviceName = $(target).parents("tr").find("#devsensor").data("devicename");
      var parameterName = $(target).parents("tr").find("#sensor").data("parameter");
      var devName = deviceName.replace(/\s/g, "_");
      var paramName = parameterName.replace(/\s/g, "_");
      window.open('/alarmdetail/'+Session.get("siteId")+'/dev_id/'+deviceId+'#'+`${devName}-${paramName}`)
    }
})