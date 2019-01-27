import { Tracker } from 'meteor/tracker';

Template.dashboardNasional.onCreated(function(){
//     $("body").removeClass("skin-blue sidebar-mini").addClass("skin-blue sidebar-collapse");
//     $('aside.control-sidebar').removeClass("control-sidebar-open");
  $('aside.control-sidebar').removeClass("control-sidebar-open");
  $("body").removeClass("control-sidebar-open");
  // this.subscribe("featured-deviceCategory");
  
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
              // console.log(`list ID site: `, listIdSite);
              // console.log(`list Number site: `, listNumberSite);
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
          // console.log(`user Site: `, idSite);
          Meteor.subscribe( "featured-sitesId", Meteor.user().profile.site_id );

          //use interval before sites was added or sites subscribe is ready:
          // var startMs = new Date().getTime();
          var getSiteList = setInterval( function() {
            let userSite = site.find({ _id: new Mongo.ObjectID( Meteor.user().profile.site_id ) }).fetch();
            if ( userSite.length>0) {
              let numberSite = [userSite[0].site_id],
                  nameSite = [userSite[0].name];
              // console.log(`list ID site: `, idSite);
              // console.log(`list Number site: `, numberSite);
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
        return m_region.featured();
    },
    deviceCategories : function(args){ // args => id._str
        // console.log(`args for SIDEBAR.deviceCategories is: `, args);
        // console.log(`args type for SIDEBAR.deviceCategories is: `, typeof args);
        if(typeof args === "object"){ args = args._str; }else{ args = args;}
        var siteDev     = site_device.find({site_id : new Mongo.ObjectID(args)});
        // console.log(`siteDev result of SIDEBAR.deviceCategories args: `, siteDev);
        var devCategory = m_device_category.find({}, {sort : { position : 1}});
        // console.log(`devCategory: `, devCategory);

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
        // return site.find({ region_id : args }, { sort : { status :-1} });
        return site.find({}, { sort : { status :-1} });
    },
    statusLink : function(args){
//       if(typeof args.site_id === "object"){ args.site_id = args.site_id._str; }else{ args.site_id = args.site_id;}
      // console.log(`siteid args: `, args.site_id);
      
      var siteNum = site.find({_id : new Mongo.ObjectID(args.site_id)}).fetch();
      // var siteNum = site.findOne({_id : new Mongo.ObjectID("5b598cc36f97984a0ad8c686")});
      // console.log(`site chosen: `, siteNum)
      
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
//               status: "F"
//             }
          ];
        }
      }
    },
    
}

Template.dashboardNasional.helpers({
    data_scope : SIDEBAR.scopes,
    data_region : SIDEBAR.regions,
    data_device_category : SIDEBAR.deviceCategories,
    data_site : SIDEBAR.sites,
    data_site_link : SIDEBAR.status_link,
    // reportContent : function(){
    //     if(Session.get("r_content")) return Session.get("r_content");
    //     return "report";
    // }
    allSite: function(){
        let tot_site    = site.find().count();
//         let compareSite = `${tot_site.toString()}`;
        return tot_site;
    },
    normalSite: function(){
        let normal_site = site.find({status: { $nin: [ "red", "orange"] }}).count();
        return normal_site;
    },
    majSite: function(){
        let major_site = site.find({status: { $in: ["orange"] }}).count();
        return major_site;
    },
    criSite: function(){
        let critical_site = site.find({status: { $in: ["red"] }}).count();
        return critical_site;
    },
    allDev: function(){
        let total_dev   = site_device.find({ status: { $nin: ["NOT_AVAILABLE", "OFFLINE"] } }).count();
      let compareNormDev  = `${total_dev.toString()}`;
      return compareNormDev;
    },
    normalDev: function(){
      let normal_dev  = site_device.find({ status: { $in: [ "NORMAL"] } }).count();
//         let total_dev   = site_device.find({ status: { $nin: [ "NOT_AVAILABLE"] } }).count();
//         let online_dev  = total_dev - offline_dev;
      let compareNormDev  = `${normal_dev.toString()}`;
      return compareNormDev;
    },
    normalDevPersen: function(){
      let normal_dev  = site_device.find({ status: { $in: [ "NORMAL"] } }).count();
      let total_dev   = site_device.find({ status: { $nin: [ "NOT_AVAILABLE", "OFFLINE"] } }).count();
      let normal_persen = (normal_dev/total_dev)*100;
      let compareNormDev  = `${normal_persen.toFixed(0)}%`;
      return compareNormDev;
    },
    criDev: function(){
      let cri_dev     = site_device.find({ status: { $in: ["CRITICAL"] } }).count();
//         let offline_dev  = site_device.find({ status: { $in: [ "OFFLINE"] } }).count();
//         let total_dev   = site_device.find({ status: { $nin: [ "NOT_AVAILABLE"] } }).count();
//         let online_dev  = total_dev - offline_dev;
//         let compareCriDev = `${cri_dev.toString()} / ${online_dev.toString()}`;
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
    majDev: function(){
      let maj_dev     = site_device.find({ status: { $in: [ "MAJOR"] } }).count();
//         let offline_dev  = site_device.find({ status: { $in: [ "OFFLINE"] } }).count();
//         let total_dev   = site_device.find({ status: { $nin: [ "NOT_AVAILABLE"] } }).count();
//         let online_dev  = total_dev - offline_dev;
//         let compareMajDev = `${maj_dev.toString()} / ${online_dev.toString()}`;
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
})

 Template.dashboardNasional.events({
//         'click #tabledetail': function(e) {
//           window.open('/reportdetail', '_blank');
//         },
        'click a[id="site"]' : function(e, t){
            e.preventDefault();
            var el = e.currentTarget;
            Session.set("contentReport","siteIndex");
            Session.set("siteId", $(el).data("siteid"));
            Session.set("nama_tempat_site", e.target.innerHTML);
//             window.open('/report', '_blank');
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
    })
