import { Tracker } from 'meteor/tracker';

Template.stationIndex.onCreated(function stationIndexOnCreated(){
  $("body").removeClass("skin-blue sidebar-collapse").addClass("skin-blue sidebar-mini");
  
  Session.setDefault("skipNumber", 0);
  Session.setDefault("removeSite", 0);
  Session.setDefault("removeSiteName", "");
  Session.setDefault("detailSite", 0);
  Session.setDefault("detailSiteName", "");
  Session.setDefault("detailSiteRegionName", "");
  
  this.autorun(() => {
    if ( Meteor.userId() ) {
      let userNat = scope.find({ _id: Meteor.user().profile.site_id }).fetch();
      // console.log(`user national: `, userNat);
      if ( userNat.length>0 ) {
        Meteor.subscribe("featured-sites-setting", 'all', Session.get("skipNumber") );
      } else {
        // console.log(`user site: `, Meteor.user().profile.site_id);
        Meteor.subscribe("featured-sites-setting", Meteor.user().profile.site_id, Session.get("skipNumber") );
      } 
    }
  });
  
});

Template.stationIndex.events({
  'click #btnaddsite' : function(e) {
    $('.modaladduser').modal('show')
  },
  'click #btnstationloc' : function(e) {
    $('.modalstationloc').modal('show')
  },
  'click #btndetail' : function(e) {
    var el = e.currentTarget;
    var target = e.target;
    var site_id = $(target).parents("tr").data("index");
    var site_name = $(target).parents("tr").data("sitename");
    Session.set("detailSite", site_id);
    Session.set("detailSiteName", site_name);
    console.log(`ID Site ini: `, Session.get("detailSite"));
    $data = '';
    $dataLoading = '<div>Collecting data... <i class="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom fa-spin" style="font-size:24px;color:blue"></i></div>';
    $('#detailSiteIni').html($dataLoading);
    $('.modaldetail').modal('show');
    var startTime = new Date().getTime();
    
    var getSiteDetail = setInterval(() => {
      var getDetailSiteIni = site.find({ _id: new Mongo.ObjectID( Session.get("detailSite") ) }).fetch();
        //console.log(getDetailSiteIni);
      if ( getDetailSiteIni === undefined ) {
        if( (new Date().getTime()) - startTime >= 10000 ){
          $dataNull = '<span>No Site Detail.</span>';
          $('#detailSiteIni').html($dataNull);
          clearInterval(getSiteDetail);
        }
      } else if ( getDetailSiteIni.length>0 ) {
        // console.log(`site detail ini: ${getDetailSiteIni}`);
        let regionName = "";
        let getRegionIni = m_region.find({ _id: getDetailSiteIni[0].region_id }).fetch();
        // console.log(`site detail ini: ${getRegionIni}`);
        if (getRegionIni.length>0) {
          regionName = getRegionIni[0].name;
          Session.set("detailSiteRegionName", regionName);
          console.log(`region detail ini: ${Session.get("detailSiteRegionName")}`);
          $data +=  `<table class="table table-bordered table-striped table-condensed table-responsive table-sm"><tbody>` + 
                    `<tr><td>Station Name</td><td>${getDetailSiteIni[0].name}</td></tr>` +
                    `<tr><td>Region</td><td>${regionName}</td></tr>` +
                    `<tr><td>KST</td><td>${getDetailSiteIni[0].kst_name}</td></tr>` + 
                    `<tr><td>Address</td><td>${getDetailSiteIni[0].address}</td></tr>` +
                    `<tr><td>latitude-Longtitude</td><td>${getDetailSiteIni[0].latlng}</td></tr>`;

          if (getDetailSiteIni[0].status === '#2ecc71') {
            $data +=  `<tr><td>Link Status</td><td style="color: green; "><i class="fa flaticon-parabolic-antenna-1 fa-lg text-green"></i></td></tr>`;
          } else if (getDetailSiteIni[0].status === 'orange') {
            $data +=  `<tr><td>Link Status</td><td style="color: orange; "><i class="fa flaticon-parabolic-antenna-1 fa-lg text-orange"></i></td></tr>`;
          } else {
            $data +=  `<tr><td>Link Status</td><td style="color: red; "><i class="fa flaticon-parabolic-antenna-1 fa-lg text-red blink"></i></td></tr>`;
          }
          $data +=  `<tr><td>Last Updated</td><td>${getDetailSiteIni[0].last_updated}</td></tr>` +
                    `</tbody></table>`;
          $('#detailSiteIni').html($data);
          clearInterval(getSiteDetail);
          
        } else {
          if( (new Date().getTime()) - startTime >= 30000 ){
            regionName = "-";
            Session.set("detailSiteRegionName", regionName);
            console.log(`region detail ini: ${Session.get("detailSiteRegionName")}`);
            $data +=  `<table class="table table-bordered table-striped table-condensed table-responsive table-sm"><tbody>` + 
                      `<tr><td>Station Name</td><td>${getDetailSiteIni[0].name}</td></tr>` +
                      `<tr><td>Region</td><td>${regionName}</td></tr>` +
                      `<tr><td>KST</td><td>${getDetailSiteIni[0].kst_name}</td></tr>` + 
                      `<tr><td>Address</td><td>${getDetailSiteIni[0].address}</td></tr>` +
                      `<tr><td>latitude-Longtitude</td><td>${getDetailSiteIni[0].latlng}</td></tr>`;

            if (getDetailSiteIni[0].status === '#2ecc71') {
              $data +=  `<tr><td>Link Status</td><td style="color: green; "><i class="fa flaticon-parabolic-antenna-1 fa-lg text-green"></i></td></tr>`;
            } else if (getDetailSiteIni[0].status === 'orange') {
              $data +=  `<tr><td>Link Status</td><td style="color: orange; "><i class="fa flaticon-parabolic-antenna-1 fa-lg text-orange"></i></td></tr>`;
            } else {
              $data +=  `<tr><td>Link Status</td><td style="color: red; "><i class="fa flaticon-parabolic-antenna-1 fa-lg text-red blink"></i></td></tr>`;
            }
            $data +=  `<tr><td>Last Updated</td><td>${getDetailSiteIni[0].last_updated}</td></tr>` +
                      `</tbody></table>`;
            
            $('#detailSiteIni').html($data);
            clearInterval(getSiteDetail);
          }
        }
      } else {
        //console.log(`startTime DevCat: ${startTime}`);
        if( (new Date().getTime()) - startTime >= 30000 ){
          $dataNull = '<span>No Devices.</span>';
          $('#detailSiteIni').html($dataNull);
          clearInterval(getSiteDetail);
        }
      }
    }, 1000 );
    
  },
  'click #btneditdetail' : function(e) {
    var el = e.currentTarget;
    var target = e.target;
    console.log(`ID Site ini (edit): `, Session.get("detailSite"));
    console.log(`region detail ini (edit): ${Session.get("detailSiteRegionName")}`);
    $('.modaleditdetail').modal('show')
  },
  'click #btnRemoveSite' : function(e) {
    var el = e.currentTarget;
    var target = e.target;
    var site_id = $(target).parents("tr").data("index");
    var site_name = $(target).parents("tr").data("sitename");
    Session.set("removeSite", site_id);
    Session.set("removeSiteName", site_name);
    // console.log(`ID Site ini: `, Session.get("removeSite"));
    console.log(`Name Site ini: `, Session.get("removeSiteName"));
    $('.modalremovesite').modal('show')
  },
  'click #removesiteini' : function(e) {
    var el = e.currentTarget;
    var target = e.target;
    console.log(`Name Site Removed: `, Session.get("removeSiteName"));
    // console.log(`ID Site Removed-new: `, Session.get("removeSite"));
    Meteor.call('siteRemove', Session.get("removeSite"), function(err, result) {
      if (err) {
        console.log(`error`);
      } else {
        console.log(result);
        alert(`Site ${Session.get("removeSiteName")} removed!`);
      }
    });
    $('.modalremovesite').modal('hide');
  },
  'click a[id="prev"]' : function(){
      Session.set("skipNumber", Session.get("skipNumber")-10 );
      //     if ( Session.get("skipNumber") > 5 ) {
      //     }
  },
  'click a[id="next"]' : function(){
    Session.set("skipNumber", Session.get("skipNumber")+10 );
  },
  'change select': function(e) {
    e.preventDefault();
    var selected = e.target.value,
        regionSiteIni = $('#region_id option:selected').data("regionid");
    console.log(selected);
    console.log(regionSiteIni);
    Session.set("selectedRegion", regionSiteIni);
  },
  'submit form': function(event) {
    event.preventDefault();
    var dataSite = {},
        siteName = event.target.site_name.value,
        siteNow = site.find({}, {sort: {site_id: -1}}).fetch(),
        kstName = event.target.kst_name.value,
        siteAddress = event.target.address.value,
        latLong = event.target.latlong.value,
        checkSiteName = site.find({name : siteName}).fetch(),
        alarmDate = new Date().toLocaleString(),
        siteIdLast = siteNow[0].site_id;
    
    if (checkSiteName.length<1) {
      dataSite = {
        region_id : new Mongo.ObjectID( Session.get("selectedRegion") ),
        name : siteName,
        kst_name : kstName,
        address : siteAddress,
        latlng: latLong,
        last_updated: alarmDate,
        site_id: siteIdLast+1,
        status: 'red',
        status_code: 'F',
        status_device: 'CRITICAL'
      };
      Meteor.call('siteNewPost', dataSite);
      event.target.site_name.value = "";
      event.target.kst_name.value = "";
      event.target.address.value = "";
      event.target.latlong.value = "";
      alert("This Site added successfull!");
      $('.modaladduser').modal('hide');
      return false;
    } else {
      alert("This Site name exist!");
    }
    return false;
  },
  
});

Template.stationIndex.helpers({
  userName: function(){
    return Meteor.user().profile.name;
  },
  siteRemoved: function(){
    var siteRm = site.find({ _id: new Mongo.ObjectID( Session.get("removeSite") ) }).fetch();
    return siteRm[0];
  },
  siteDetailed: function(){
    if ( Session.get("detailSite") === 0 ) {
      return [];
    } else {
      var siteDet = site.find({ _id: new Mongo.ObjectID( Session.get("detailSite") ) }).fetch();
      console.log(siteDet);
      return siteDet[0];
    }
  },
  siteList: function(){
    var siteList = site.find({}).fetch();
    return siteList;
  },
  regionList: function(){
    let userRegion = m_region.find({}).fetch();
    return userRegion;
  },
  regionSiteDetailNow: () => {
    return Session.get("detailSiteRegionName");
  },
//   regionInDetail: function(args){
//     console.log(`This site region ID: ${args._str}`);
//     let userRegion = m_region.find({ _id: args }).fetch();
//     return userRegion[0];
//   },
  
});


// }