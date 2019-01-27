import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Chart from '../../../node_modules/chart.js/src/chart.js';
import { Tracker } from 'meteor/tracker';

if(Meteor.isClient){
  //Meteor is Client: Start
    Template.dashboardIndex.onCreated(function dashboardIndexOnCreated(){
      $("body").removeClass("skin-blue sidebar-mini").addClass("skin-blue sidebar-collapse");

      // console.log(`The id of this user is :`, Meteor.userId() );
      // console.log(`The name of this user is :`, Meteor.user().username );
      // console.log(`The site number of this user is :`, Meteor.user().profile.site_id );
      // console.log(`The role of this user is :`, Meteor.user().profile.roles[0] );
      
      this.autorun(() => {
        if ( Meteor.userId() ) {
          let userNat = scope.find({ _id: Meteor.user().profile.site_id }).fetch();
          if ( userNat.length>0 ) {
            this.subscribe("featured-sites");
            this.subscribe("featured-sitesDevices");
            this.subscribe('featured-dashboardTxGraph');
            this.subscribe('featured-dashboardRxGraph');

          } else {
            let userRegion = m_region.find({ _id: new Mongo.ObjectID( Meteor.user().profile.site_id ) }).fetch();

            if ( userRegion.length>0 ) {
              this.subscribe("featured-sitesRegion", Meteor.user().profile.site_id );
              //use interval before sites was added or sites subscribe is ready:
              var startTime = new Date().getTime();
              var getSite = setInterval( function() {
                let siteListIni = site.find({ region_id : userRegion[0]._id }, { sort: {name: 1} }).fetch();
                var listIdSite = [], 
                    listNumberSite = [];
                if ( siteListIni.length>0 ) {
                  _.each(siteListIni, function(site) {
                    listIdSite.push(site._id);
                    listNumberSite.push(site.site_id);
                  });
                  // console.log(`list ID site: `, listIdSite);
                  // console.log(`list Number site: `, listNumberSite);
                  Meteor.subscribe("featured-sitesDevicesRegion", listIdSite);
                  Meteor.subscribe('featured-dashboardTxGraph-Reg-Site', listNumberSite);
                  Meteor.subscribe('featured-dashboardRxGraph-Reg-Site', listNumberSite);
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

              //use interval before sites was added or sites subscribe is ready:
              // var startMs = new Date().getTime();
              var getSiteList = setInterval( function() {
                let userSite = site.find({ _id: new Mongo.ObjectID( Meteor.user().profile.site_id ) }).fetch();
                if ( userSite.length>0) {
                  let numberSite = [userSite[0].site_id];
                  // console.log(`list ID site: `, idSite);
                  // console.log(`list Number site: `, numberSite);
                  Meteor.subscribe("featured-sitesDevicesRegion", idSite);
                  Meteor.subscribe('featured-dashboardTxGraph-Reg-Site', numberSite);
                  Meteor.subscribe('featured-dashboardRxGraph-Reg-Site', numberSite);
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
    
// ++++++++++++++++++++++++++++++++++++++++++++++++++=TX-GRAPH=++++++++++++++++++++++++++++++++++++++++++++++++++++//
  
    //Template onRendered: Start
    Template.dashboardIndex.onRendered(function(){
// ++++++++++++++++++++++++++++++++++++++++++++++++++=TX-GRAPH=++++++++++++++++++++++++++++++++++++++++++++++++++++//
      //Fordward Power Graph: Start
      let fordwardGraph = function(label, value, axisRotation) {
        var f = document.getElementById("mybarChart2");             
        new Chart(f, {
                type: "bar",
                data: {
                        labels: label,
                        datasets: [{
                                label: "# Forward Power (Watt)",
                                backgroundColor: "#26B99A",
                                data: value
                        }]
                },
                options: {
                        scales: {
                                xAxes: [{
                                      ticks: {
                                          autoSkip: false,
                                          maxRotation: axisRotation,
                                          minRotation: axisRotation
                                      }
                                  }],
                                yAxes: [{
                                        ticks: {
                                                beginAtZero: !0
                                        }
                                }]
                        }
                }
        });
      };
      //Fordward Power Graph: Finish.  
      
      //rendering TX graph: Start
      Tracker.autorun(() => {
        var txData = dashboard_tx_graph.find({}, {sort: {site: 1}}).fetch();
        var value=[], label=[], axisRotation;
        txData.forEach(function(option) {
            value.push(option.fordward);
            label.push(option.site)
        });
        // console.log(value);
        if ( txData.length>=5 ) {
          axisRotation = 90;
        } else {
          axisRotation = 0;
        }
        fordwardGraph(label, value, axisRotation);
      });
      //rendering TX graph: Finish.
      
      //Reflected Power: Start
      let reverseGraph = (label, value, axisRotation) => {
        var d = document.getElementById("reflected");
		    new Chart(d, {
		            type: "bar",
		            data: {
		                    labels: label,
		                    datasets: [{
		                            label: "# Reflected Power  (Watt)",
		                            backgroundColor: "#03586A",
		                            data: value
		                    }]
		            },
		            options: {
		                    scales: {
                                xAxes: [{
                                    ticks: {
                                        autoSkip: false,
                                        maxRotation: axisRotation,
                                        minRotation: axisRotation
                                    }
                                }],
		                            yAxes: [{
		                                    ticks: {
		                                            beginAtZero: !0
		                                    }
		                            }]
		                    }
		            }
		    });
      };
      //Reflected Power: Finish.
      
      //rendering TX graph: Start
      Tracker.autorun(() => {
        var txData = dashboard_tx_graph.find({}, {sort: {site: 1}}).fetch();
        var value=[], label=[], axisRotation;
        txData.forEach(function(option) {
            value.push(option.reverse);
            label.push(option.site)
        });
        if ( txData.length>=5 ) {
          axisRotation = 90;
        } else {
          axisRotation = 0;
        }
        reverseGraph(label, value, axisRotation);
      });
      //rendering TX graph: Finish.
      
// ++++++++++++++++++++++++++++++++++++++++++++++++++=TX-GRAPH=++++++++++++++++++++++++++++++++++++++++++++++++++++//
      
// ++++++++++++++++++++++++++++++++++++++++++++++++++=RX-GRAPH=++++++++++++++++++++++++++++++++++++++++++++++++++++//
      //Link Graph: Start
      let linkGraph = function(label, value, axisRotation) {
        var f = document.getElementById("link");             
        new Chart(f, {
                type: "bar",
                data: {
                        labels: label,
                        datasets: [{
                                label: "# Link Margin (dB)",
                                backgroundColor: "#26B99A",
                                data: value
                        }]
                },
                options: {
                        scales: {
                                xAxes: [{
                                      ticks: {
                                          autoSkip: false,
                                          maxRotation: axisRotation,
                                          minRotation: axisRotation
                                      }
                                  }],
                                yAxes: [{
                                        ticks: {
                                                beginAtZero: !0
                                        }
                                }]
                        }
                }
        });
      };
      //Link Graph: Finish.  
      
      //rendering RX graph: Start
      Tracker.autorun(() => {
        var rxData = dashboard_rx_graph.find({}, {sort: {site: 1}}).fetch();
        var value=[], label=[], axisRotation;
        rxData.forEach(function(option) {
            value.push(option.link);
            label.push(option.site)
        });
        if ( rxData.length>=5 ) {
          axisRotation = 90;
        } else {
          axisRotation = 0;
        }
        linkGraph(label, value, axisRotation);
      });
      //rendering RX graph: Finish.
      
      //Signal Strength: Start
      let signalGraph = (label, value, axisRotation) => {
        var d = document.getElementById("signal-strength");
		    new Chart(d, {
		            type: "bar",
		            data: {
		                    labels: label,
		                    datasets: [{
		                            label: "# Signal Strength (dB)",
		                            backgroundColor: "#03586A",
		                            data: value
		                    }]
		            },
		            options: {
		                    scales: {
                                xAxes: [{
                                    ticks: {
                                        autoSkip: false,
                                        maxRotation: axisRotation,
                                        minRotation: axisRotation
                                    }
                                }],
		                            yAxes: [{
		                                    ticks: {
		                                            beginAtZero: !0
		                                    }
		                            }]
		                    }
		            }
		    });
      };
      //Signal Strength: Finish.
      
      //rendering RX graph: Start
      Tracker.autorun(() => {
        var rxData = dashboard_rx_graph.find({}, {sort: {site: 1}}).fetch();
        var value=[], label=[], axisRotation;
        rxData.forEach(function(option) {
            value.push(option.signal_strength);
            label.push(option.site)
        });
        if ( rxData.length>=5 ) {
          axisRotation = 90;
        } else {
          axisRotation = 0;
        }
        signalGraph(label, value, axisRotation);
      });
      //rendering RX graph: Finish.

// ++++++++++++++++++++++++++++++++++++++++++++++++++=RX-GRAPH=++++++++++++++++++++++++++++++++++++++++++++++++++++//
    })
  //Template onRendered: Finish.

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//  
//   Template helper: Start
  
  //Devices Status
    Template.dashboardIndex.helpers({
      olSite: function(){
          let tot_site    = site.find().count();
          let offline_site = site.find({status: "red"}).count();
          let online_site = tot_site - offline_site;
          let compareSite = `${online_site.toString()} / ${tot_site.toString()}`;
          return compareSite;
      },
      olDev: function(){
        // let online_dev  = site_device.find({ status: { $in: [ "NORMAL", "MAJOR", "CRITICAL"] } }).count();
        let offline_dev  = site_device.find({ status: { $in: [ "OFFLINE"] } }).count();
        let total_dev   = site_device.find({ status: { $nin: [ "NOT_AVAILABLE"] } }).count();
        let online_dev  = total_dev - offline_dev;
        let compareDev  = `${online_dev.toString()} / ${total_dev.toString()}`;
        return compareDev;
      },
      criDev: function(){
        let cri_dev     = site_device.find({ status: { $in: ["CRITICAL"] } }).count();
        let offline_dev  = site_device.find({ status: { $in: [ "OFFLINE"] } }).count();
        let total_dev   = site_device.find({ status: { $nin: [ "NOT_AVAILABLE"] } }).count();
        let online_dev  = total_dev - offline_dev;
        // let compareCriDev = `${cri_dev.toString()} / ${online_dev.toString()}`;
        let compareCriDev = `${cri_dev.toString()}`;
        return compareCriDev;
      },
      majDev: function(){
        let maj_dev     = site_device.find({ status: { $in: [ "MAJOR"] } }).count();
        let offline_dev  = site_device.find({ status: { $in: [ "OFFLINE"] } }).count();
        let total_dev   = site_device.find({ status: { $nin: [ "NOT_AVAILABLE"] } }).count();
        let online_dev  = total_dev - offline_dev;
        // let compareMajDev = `${maj_dev.toString()} / ${online_dev.toString()}`;
        let compareMajDev = `${maj_dev.toString()}`;
        return compareMajDev;
      },
      
    })  
//   Template helper: Finish.
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  
//Meteor is Client: Finish
}