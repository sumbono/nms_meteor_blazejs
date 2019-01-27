import { Tracker } from 'meteor/tracker';

Template.dashboardNetwork.onCreated(function(){
  
    $('aside.control-sidebar').removeClass("control-sidebar-open");
    $("body").removeClass("control-sidebar-open");
    
    let regionOne = m_region.find({name: "NETWORK 1"}).fetch();
    let siteOne = site.find( { region_id : regionOne[0]._id } );
    var devIdNetOne = [],
        nameSiteNetOne = [];
    if ( siteOne.count() > 0 ) {
      _.each(siteOne.fetch(), function(site){
        devIdNetOne.push( site._id );
        nameSiteNetOne.push( site.name );
      })
    } else {
      devIdNetOne.push(0);
      nameSiteNetOne.push(0);
    }
    
    // var _self = this;
    // this.subscribe("featured-sitesDevicesRegion", devIdNetOne);
    // this.subscribe("featured-statusLink", nameSiteNetOne);


})

var SIDEBAR = {
    scopes : function(){
        return scope.featured();
    },
    regions : function(){
        return m_region.featured();
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

        if(siteDev.count() > 0) {
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
        return site.find({ region_id : args }, { sort : { status :-1} });
      
    },
    allDevSite : function(){
      let regionNetOne = m_region.find({name: "NETWORK 1"}).fetch();
      let all_site = site.find( { $and: [{ region_id : regionNetOne[0]._id }] } );
     
      if ( all_site.count() > 0 ) {
        var devNetOne = new Array();
        _.each(all_site.fetch(), function(site){
            var dev_site = site_device.find( { $and: [ { site_id : site._id }, { status: { $in: ["NORMAL", "MAJOR", "CRITICAL"] } } ] } );
            if(dev_site.count() > 0 ) {
              _.each(dev_site.fetch(), function(device){
                devNetOne.push(device);
              })
            }
        })
        
        let compareAllDev  = devNetOne.length ;
        return compareAllDev;
      } else {
        return 0;
      }
    },
    normalDevSite: function(){
      let regionNetOne = m_region.find({name: "NETWORK 1"}).fetch();
      let all_site = site.find( { $and: [{ region_id : regionNetOne[0]._id }] } );

      if ( all_site.count() > 0 ) {

        var devNetOne = new Array();
        _.each(all_site.fetch(), function(site){
            var dev_site = site_device.find( { $and: [ { site_id : site._id }, { status: { $in: ["NORMAL"] } } ] } );
            if(dev_site.count() > 0 ) {
              _.each(dev_site.fetch(), function(device){
                devNetOne.push(device);
              })
            }
        })

        let compareNormDev   = devNetOne.length ;
        return compareNormDev;

      } else {
        return 0;
      }
    },
    majDevSite: function(){
      let regionNetOne = m_region.find({name: "NETWORK 1"}).fetch();
      let all_site = site.find( { $and: [{ region_id : regionNetOne[0]._id }] } );

      if ( all_site.count() > 0 ) {

        var devNetOne = new Array();
        _.each(all_site.fetch(), function(site){
            var dev_site = site_device.find( { $and: [ { site_id : site._id }, { status: { $in: ["MAJOR"] } } ] } );
            if(dev_site.count() > 0 ) {
              _.each(dev_site.fetch(), function(device){
                devNetOne.push(device);
              })
            }
        })

        let compareMajDev   = devNetOne.length ;
        return compareMajDev;

      } else {
        return 0;
      }
    },
    criDevSite: function(){
      let regionNetOne = m_region.find({name: "NETWORK 1"}).fetch();
      let all_site = site.find( { $and: [{ region_id : regionNetOne[0]._id }] } );

      if ( all_site.count() > 0 ) {

        var devNetOne = new Array();
        _.each(all_site.fetch(), function(site){
            var dev_site = site_device.find( { $and: [ { site_id : site._id }, { status: { $in: ["CRITICAL"] } } ] } );
            if(dev_site.count() > 0 ) {
              _.each(dev_site.fetch(), function(device){
                devNetOne.push(device);
              })
            }
        })

        let compareNormDev   = devNetOne.length ;
        return compareNormDev;

      } else {
        return 0;
      }
    },
    normalDevPersen: function(){
      let regionNetOne = m_region.find({name: "NETWORK 1"}).fetch();
      let all_site = site.find( { $and: [{ region_id : regionNetOne[0]._id }] } );
     
      if ( all_site.count() > 0 ) {
        
        var allDevNetOne = new Array();
        _.each(all_site.fetch(), function(site){
            let all_dev_site = site_device.find( { $and: [ { site_id : site._id }, { status: { $in: ["NORMAL", "MAJOR", "CRITICAL"] } } ] } );
            if(all_dev_site.count() > 0 ) {
              _.each(all_dev_site.fetch(), function(device){
                allDevNetOne.push(device);
              })
            }
        })
        
        var normalDevNetOne = new Array();
        _.each(all_site.fetch(), function(site){
            let normal_dev_site = site_device.find( { $and: [ { site_id : site._id }, { status: { $in: ["NORMAL"] } } ] } );
            if(normal_dev_site.count() > 0 ) {
              _.each(normal_dev_site.fetch(), function(device){
                normalDevNetOne.push(device);
              })
            }
        })
        // Math.round((sensorValueNow[key] + 0.00001)*100) / 100
        
//         let comDev = Math.round(((normalDevNetOne.length/allDevNetOne.length)+0.00001)*100);
        let comDev = (normalDevNetOne.length/allDevNetOne.length)*100;
        let compareAllDev  = `${comDev.toFixed(0)}%` ;
        return compareAllDev;
        
      } else {
        return 0;
      }
    },
    majDevPersen: function(){
      let regionNetOne = m_region.find({name: "NETWORK 1"}).fetch();
      let all_site = site.find( { $and: [{ region_id : regionNetOne[0]._id }] } );
     
      if ( all_site.count() > 0 ) {
        
        var allDevNetOne = new Array();
        _.each(all_site.fetch(), function(site){
            let all_dev_site = site_device.find( { $and: [ { site_id : site._id }, { status: { $in: ["NORMAL", "MAJOR", "CRITICAL"] } } ] } );
            if(all_dev_site.count() > 0 ) {
              _.each(all_dev_site.fetch(), function(device){
                allDevNetOne.push(device);
              })
            }
        })
        
        var majorDevNetOne = new Array();
        _.each(all_site.fetch(), function(site){
            let major_dev_site = site_device.find( { $and: [ { site_id : site._id }, { status: { $in: ["MAJOR"] } } ] } );
            if(major_dev_site.count() > 0 ) {
              _.each(major_dev_site.fetch(), function(device){
                majorDevNetOne.push(device);
              })
            }
        })
        
//         let comDev = Math.round(((majorDevNetOne.length/allDevNetOne.length)+0.00001)*100);
        let comDev = (majorDevNetOne.length/allDevNetOne.length)*100;
        let compareAllDev  = `${comDev.toFixed(0)}%` ;
        return compareAllDev;
        
      } else {
        return 0;
      }
    },
    criDevPersen: function(){
      let regionNetOne = m_region.find({name: "NETWORK 1"}).fetch();
      let all_site = site.find( { $and: [{ region_id : regionNetOne[0]._id }] } );
     
      if ( all_site.count() > 0 ) {
        
        var allDevNetOne = new Array();
        _.each(all_site.fetch(), function(site){
            let all_dev_site = site_device.find( { $and: [ { site_id : site._id }, { status: { $in: ["NORMAL", "MAJOR", "CRITICAL"] } } ] } );
            if(all_dev_site.count() > 0 ) {
              _.each(all_dev_site.fetch(), function(device){
                allDevNetOne.push(device);
              })
            }
        })
        
        var criDevNetOne = new Array();
        _.each(all_site.fetch(), function(site){
            let cri_dev_site = site_device.find( { $and: [ { site_id : site._id }, { status: { $in: ["CRITICAL"] } } ] } );
            if(cri_dev_site.count() > 0 ) {
              _.each(cri_dev_site.fetch(), function(device){
                criDevNetOne.push(device);
              })
            }
        })
        
//         let comDev = Math.round(((criDevNetOne.length/allDevNetOne.length)+0.00001)*100);
        let comDev = (criDevNetOne.length/allDevNetOne.length)*100;
        let compareAllDev  = `${comDev.toFixed(0)}%` ;
        return compareAllDev;
        
      } else {
        return 0;
      }
    },
    statusLink : function(args){
//       if(typeof args.site_id === "object"){ args.site_id = args.site_id._str; }else{ args.site_id = args.site_id;}
//       console.log(`siteid args: `, args.site_id);
      
      var siteNum = site.find({_id : new Mongo.ObjectID(args.site_id)}).fetch();
      // var siteNum = site.findOne({_id : new Mongo.ObjectID("5b598cc36f97984a0ad8c686")});
      // console.log(`site chosen: `, siteNum)
      
      var numberSite = siteNum[0].site_id;
      var device_devID = args.dev_id;
      
      // console.log(`Device Controller: `, device_devID);
      
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
            {
              dev_id: device_devID,
              site: numberSite,
              status: "E"
            }
          ];
        }
      }
    },
    
}

Template.dashboardNetwork.helpers({
    data_scope : SIDEBAR.scopes,
    data_region : SIDEBAR.regions,
    data_device_category : SIDEBAR.deviceCategories,
    data_site : SIDEBAR.sites,
    allDev: SIDEBAR.allDevSite,
    normalDev: SIDEBAR.normalDevSite,
    majDev: SIDEBAR.majDevSite,
    criDev: SIDEBAR.criDevSite,
    normalPersen: SIDEBAR.normalDevPersen,
    majorPersen: SIDEBAR.majDevPersen,
    criPersen: SIDEBAR.criDevPersen,
    data_site_link : SIDEBAR.status_link,
    
//     network: function (){
//       return "Network 1";
//     },
    // reportContent : function(){
    //     if(Session.get("r_content")) return Session.get("r_content");
    //     return "report";
    // }
   allSite: function(){
      let regionNetOne = m_region.find({name: "NETWORK 1"}).fetch();
      let tot_site    = site.find({ region_id : regionNetOne[0]._id }).count();
      return tot_site;
    },  
    normalSite: function(){
        let regionNetOne = m_region.find({name: "NETWORK 1"}).fetch();
        
        let normal_site = site.find(
          {
            $and: [
              { region_id : regionNetOne[0]._id }, 
              {status: { $nin: [ "red", "orange"] }}
            ]
          }
        ).count();
        return normal_site;
    },
    majSite: function(){
      let regionNetOne = m_region.find({name: "NETWORK 1"}).fetch();  
      let major_site = site.find(
        {
          $and: [
            { region_id : regionNetOne[0]._id }, 
            {status: { $in: ["orange"] } }
          ]
        }
      ).count();
      return major_site;
    },
    criSite: function(){
      let regionNetOne = m_region.find({name: "NETWORK 1"}).fetch();  
      let critical_site = site.find(
        {
          $and: [
            { region_id : regionNetOne[0]._id }, 
            {status: { $in: ["red"] } }
          ]
        }
      ).count();
      return critical_site;
    },
    
})

Template.dashboardNetwork.events({
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
