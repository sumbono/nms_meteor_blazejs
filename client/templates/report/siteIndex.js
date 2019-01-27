var Highcharts = require('highcharts/highstock');
import { Tracker } from 'meteor/tracker';

Template.siteIndex.onCreated(function(){
  var _self = this;
  this.autorun(() => {
    // console.log(`this site id is: ${Session.get("siteId")}`);
    // console.log(`this site all dev_id is: ${Session.get("devIdAll")}`);
    // console.log(`this battery dev_id is: ${Session.get("idBatt")}`);
    this.subscribe( "featured-sitesId", Session.get("siteId") );
    this.subscribe("featured-sitesDeviceSensors", Session.get("devIdAll") );
    this.subscribe("featured-devices");
  });

})

//Session & Subscribing for Sitelog data trend:
Session.setDefault('sitelog', false);

Tracker.autorun(function() {
  if (Session.get('sitelog')) {
    var logHandle = Meteor.subscribe('featured-sitelog', Session.get('sitelog'));
    Session.set('loading-data', ! logHandle.ready());
  }
});

//place SITE here..
var SITE = {
    deviceCategories : function(args){
      return m_device_category.find({ _id : new Mongo.ObjectID(args) }, { sort : { _id : 1}});
    },
    protocol : function(args){
        return m_protocol.find({_id : args});
    },
    siteDevices : function(args){
        args = args.hash;
        args.site_id = new Mongo.ObjectID(Session.get("siteId"));
        var siteDev     = site_device.find({site_id : args.site_id});
        var devCategory = m_device_category.find({_id : args.device_category_id}, {sort : {_id: 1}});

        if(siteDev.count() > 0){
            var data = new Array();
            _.each(devCategory.fetch(), function(category){
                _.each(m_device.find({device_category_id : category._id},{sort : {position: 1}}).fetch(), function(row){
//                     var g = site_device.find({site_id : args.site_id, device_id : row._id}, {sort : {_id: 1}}).fetch();
                  var g = site_device.find({site_id : args.site_id, device_id : row._id}, {sort : {position: 1}}).fetch();
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
            ////console.log(result, 'RESULT')
            return result;
        }

    },
    siteDeviceCategory : function(args){
      // console.log(`this is args on SITE.siteDeviceCategory: `, args);
      if(typeof args === "object"){ args = args._str; }else{ args = args;}
//         var c = site_device.find({site_id : new Mongo.ObjectID(args)},{sort : {device_category_id: 1}});
      var c = site_device.find({site_id : new Mongo.ObjectID(args)},{sort : {position: 1}});
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
    devices : function(args){
      if(typeof args !== "undefined"){
          return m_device.find({ _id : new Mongo.ObjectID(args) }, { sort : { position : 1 }});
      }
    },
    siteDevicesSensor : function(args) {
      if(typeof args !== "undefined"){
//             ////console.log( site_device_sensor.find(args.hash).fetch(), 'SITEDEVSENSOR' )
          return site_device_sensor.find(args.hash);
      }
    },
    siteDeviceAll : function(args){
      args.hash.site_id = new Mongo.ObjectID(Session.get("siteId"));
//         return site_device.find(args.hash);
      return site_device.find(args.hash, { sort : { position : 1 }});
    },
  
// ===============================================================================================================================//
// BATTERY: Start //
    showgaugechart : function(args){
//         if ($('#echart_gauge').length ){ 
          
            $("div[id='echart_gauge']").each(function(){
                                    
                  var echartGauge = echarts.init(this);
                  var category = $(this).data("cat");
                  devID=$(this).attr('data-deviceid');
                //   console.log(devID, 'devID')
                  
                  var devSensorBatt = site_device_sensor.find({ dev_id: parseInt(devID), sensor_name: category }).fetch();
                  
                //   console.log(devSensorBatt, 'Battery')
                  
                  var value_now = devSensorBatt[0].valueNow ;
                  var limit_min = devSensorBatt[0].limit_min ;
                  var limit_max = devSensorBatt[0].limit_max ;
                  var major_min = devSensorBatt[0].major_min ;
                  var major_max = devSensorBatt[0].major_max ;
                  var nmin = devSensorBatt[0].value_min ;
                  var nmax = devSensorBatt[0].value_max ;
                  var satuan = devSensorBatt[0].unit ;
                
                // echartGauge: properties.
                  echartGauge.setOption({
                        tooltip: {
                          formatter: "{b}: {c}" + satuan
                        },
                        toolbox: {
                          show: false,
                          feature: {
                                restore: {
                                  show: true,
                                  title: "Restore"
                                },
                                saveAsImage: {
                                  show: true,
                                  title: "Save Image"
                                }
                          }
                        },
                        series: [{
                          name: category,
                          type: 'gauge',
                          center: ['50%', '50%'],
                          startAngle: 210,
                          endAngle: -30,
                          min: nmin,
                          max: nmax,
                          precision: 0,
                          splitNumber: 10,
                          axisLine: {
                                show: true,
                                lineStyle: {
                                  color: [
                                        [(limit_min/nmax), '#ff4500'], // nilai limit min
                                        [(major_min/nmax), 'orange'], // nilai major min
                                        [(major_max/nmax), 'green'], // nilai major max
                                        [(limit_max/nmax), 'orange'], // nilai limit max 
                                        [(nmax/nmax), '#ff4500'] // nilai max
                                  ],
                                  width: 20
                                }
                          },
                          axisTick: {
                                show: true,
                                splitNumber: 5,
                                length: 8,
                                lineStyle: {
                                  color: '#eee',
                                  width: 1,
                                  type: 'solid'
                                }
                          },
                          axisLabel: {
                                show: true,
                                formatter: function(v) {
                                  switch (v + '') {
                                        case '10':
                                          return '';
                                        case '30':
                                          return '';
                                        case '60':
                                          return '';
                                        case '90':
                                          return '';
                                        default:
                                          return '';
                                    }
                                },
                                textStyle: {
                                  color: '#333'
                                }
                          },
                          splitLine: {
                                show: true,
                                length: 20,
                                lineStyle: {
                                  color: '#eee',
                                  width: 2,
                                  type: 'solid'
                                }
                          },
                          pointer: {
                                length: '80%',
                                width: 8,
                                color: 'auto'
                          },
                          title: {
                                show: true,
                                offsetCenter: ['-0%', 70],
                                textStyle: {
                                  color: '#333',
                                  fontSize: 15
                                }
                          },
                          detail: {
                                show: true,
                                backgroundColor: 'rgba(0,0,0,0)',
                                borderWidth: 0,
                                borderColor: '#ccc',
                                width: 80,
                                height: 40,
                                offsetCenter: ['-0%', 35],
                                formatter: '{value}'+satuan,
                                textStyle: {
                                  color: 'auto',
                                  fontSize: 18,
                                  fontWeight: 'bold'
                                }
                          },
                          data: [{
                                value: value_now,
                                name: category
                          }]
                        }]
                  });
                  // echartGauge: properties.
            })
                      
//         }         
    },
    
    showmybarchart : function(){
                            
      $("canvas[id='mybarChart']").each(function(){
        var ctx = $(this);
        devid=$(this).attr('data-deviceid');
        // Meteor.subscribe("featured-battery-parsed", devid );
        var d_volt = [];
        var d_cell = [];
        var d_color = [];
        // data dari nms_battery_parsed:
        var parsedBatt = battery_parsed.find({ dev_id: parseInt(devid) }).fetch();
        // console.log(`data battery parsed: `, parsedBatt);
        d_volt = parsedBatt[0].num_volt;
        d_cell = parsedBatt[0].num_cell;
        d_color = parsedBatt[0].num_volt_color;
        ctx.attr("height",150);
        var mybarChart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: d_cell,
                datasets: [{
                      label: 'Volt',
                      backgroundColor: d_color,
                      data: d_volt,
                      borderSkipped: 'top'
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                      yAxes: [{
                        ticks: {
                              beginAtZero: true
                        }
                      }]
                }
              }
        });
      
      });      
      
    },
    
//cellChart....:START???????    
    chart_cell_detail : function(d_series, d_time, d_title){
        var example = 'spline-plot-bands', theme = 'dark-unica';
        ////console.log(d_time, 'TIMEEEEE')
        var date_start_point = SITE.parse_date(d_time);
        ////console.log(date_start_point, 'POINTTTT')
        $(".box-body > .btn-group").show();
        $("#btn-showhide").show();

        cellChart = new Highcharts.chart("cell-chart", {
            exporting: {
                enabled: true
            },
            chart: {
                height: 350,
                type: 'spline',
                backgroundColor: '#eeeee',
            },
            title: {
                text: 'The Cell Last Update Value'
            },
            subtitle: {
                text: d_title
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    overflow: 'justify'
                }
            },
            yAxis: {
                title: {
                    text: 'Cell Value'
                },
                minorGridLineWidth: 0,
                gridLineWidth: 0,
                alternateGridColor: null,
            },
            tooltip: {
                valueSuffix: ''
            },
            plotOptions: {
                spline: {
                    lineWidth: 4,
                    states: {
                        hover: {
                            lineWidth: 5
                        }
                    },
                    marker: {
                        enabled: false
                    },
                    pointInterval: 5 * 60 * 1000, // 5 minutes
                    pointStart: date_start_point.getTime()
                }
            },
            series: d_series,
            navigation: {
                menuItemStyle: {
                    fontSize: '10px'
                }
            }
        });

    },
        parse_date : function(str){
    
            var year = str.substring(0, 4);
            var month = str.substring(4, 6);
            var day = str.substring(6, 8);
            var hour = str.substring(8, 10);
            var minute = str.substring(10, 12);
            var second = str.substring(12, 14);
            
            return new Date(year, month-1, day, hour, minute, second);
        },
        
        dd_detail : function(target, dev_port, getDataLastUpdate2, nama_device_pop){
                var d_id            = $(target).parents("li").data("devid");
                var protocol_init   = $(target).parents("div").data("protocol");
                var unit            = $(target).parents("div").data("unit");
                var degree      = String.fromCharCode(176); // symbol degree
                var devicename  = nama_device_pop;
                var dataSetChart = Sitelog.find({dev_id: d_id, param: protocol_init}, { sort: { _id : 1 } }).fetch();
                var f_c = new Array();
                var option = new Array();
                var get_max_value = [];
                var dataIni = dataSetChart[0].data;
                for (var i = 0; i < dataIni.length; i++) {
                  var n = dataIni[i];
                  get_max_value.push(n[dev_port]);
                  f_c.push([ n.T, n[dev_port] ]);
                }
          
                option.minY = Math.min.apply(Math,get_max_value);
                option.maxY = Math.max.apply(Math,get_max_value);
                option.satuan = unit;
                option.title = devicename;
                
                SITE.chartDevice("container", f_c, getDataLastUpdate2, option);
        },
        
        chartDevice : function(target, dataChart, loadNewData, option){
            
            var satuan, typechart, label_yaxis, minY, minRangeY, maxY, title;
            if(typeof option.typechart === "undefined") typechart = "spline";
            if(typeof option.satuan === "undefined") satuan = ""; else satuan = option.satuan;
            if(typeof option.ylabel === "undefined") label_yaxis = false; else label_yaxis = option.ylabel;
            if(typeof option.minY === "undefined") minY = null; else minY = option.minY;
            if(typeof option.minRangeY === "undefined") minRangeY = null; else minRangeY = option.minRangeY;
            if(typeof option.maxY === "undefined") maxY = null; else maxY = option.maxY;
            if(typeof option.title === "undefined") title = null; else title = option.title;
            
          setTimeout(function() {
            // Create the chart
            chart = new Highcharts.setOptions({
                lang: {
                    rangeSelectorZoom: ''
                },
                global: {
                    useUTC: false
                }
            });
            
            chart = new Highcharts.stockChart(target, {
                exporting: {
                    enabled: true,
                    buttons: {
                      contextButton: {
                        className: "highcharts-contextbutton",
                        enabled: true,
                        menuClassName: "highcharts-contextmenu",
                        menuItems: ["printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG"],
                        symbol: "menu",
                        symbolFill: "#666666",
                        symbolStroke: "#666666",
                        symbolStrokeWidth: 3,
                        titleKey: "contextButtonTitle",
                        x: -10,
                        y: 0
                      },
                    },
                    csv: {
                      dateFormat: "%Y-%m-%d %H:%M:%S",
                    },
                },
                navigation: {
                  // bindingsClassName: "highcharts-bindings-wrapper",
                  buttonOptions: {
                    enabled: true,
                    symbolFill: "#666666",
                    symbolStroke: "#666666",
                    symbolStrokeWidth: 3,
                  },
                },
                yAxis: {
                    min: minY,
                    minRange: minRangeY,
                    max: maxY,
                    opposite: false,
                    labels:{
                        formatter: function(){
                            if(label_yaxis !== false){
                                return label_yaxis[this.value];
                            }
                            return ` ${this.value} ${satuan}`;
                        }
                    }
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        second: '%S',
        //                second: '%Y-%m-%d<br/>%H:%M:%S',
                        minute: '%M:%S',
        //                minute: '%Y-%m-%d<br/>%H:%M:%S',
                        hour: '%H:%M',
        //                hour: '%Y-%m-%d<br/>%H:%M',
        //                day: '%Y-%m-%d',
                        day: '%m-%d',
        //                week: '%Y-%m-%d',
                        week: '%m-%d',
                        month: '%Y-%m',
                        year: '%Y'
                    }
                },
                plotOptions : {
                  area: {
                    tooltip: {
                        millisecond:"%A, %b %e, %H:%M:%S.%L",
                        second:"%A, %b %e, %H:%M:%S",
                        minute:"%A, %b %e, %H:%M",
                        hour:"%A, %b %e, %H:%M",
                        day:"%A, %b %e, %Y",
                        week:"Week from %A, %b %e, %Y",
                        month:"%B %Y",
                        year:"%Y"
                        }
                  }
                },
                credits: {
                    style: {
                        "display" : "none"
                    }
                },
                series: [
                    {
                        name: title,
                        type: typechart,
                        data: dataChart,
                        step: true,
                        tooltip: {
                            valueDecimals: 2
                        }
                    }],
                chart: {
                    events: {
                        load: function(){
                            loadNewData
                        }
                    },
                    height: 400,
        //                width: 870,
                    maxWidth: 767,
                    minWidth: 768
                },
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 767,
                            minWidth: 768,
                            maxHeight: 399,
                            minHeight: 400
                        },
                        chartOptions: {
                            chart: {
                                height: 390,
                                width: 767
                            },
                            subtitle: {
                                text: null
                            },
                            navigator: {
                                enabled: true
                            }
                        }
                    }]
                },
                rangeSelector: {
                    allButtonsEnabled: true,
                    enabled : true,
                    buttons: [{
                        type : 'hour',
                        count: 1,
                        text : 'Hour'
                    },{
                        type : 'day',
                        count: 1,
                        text : 'Day'
                    },{
                        type : 'week',
                        count: 1,
                        text : 'Week'
                   },{
                       type : 'month',
                       count: 1,
                       text : 'Month'
                   },{
                       type : 'year',
                       count: 1,
                       text : 'Year'
                    }],
        //                buttonPosition: {
        ////                    x : 480
        //                },
                    buttonSpacing: 5,
                    buttonTheme : {
                        width: 60,
                        fill: 'black',
                        style: {
                            fontWeight: 'bold',
                            color: 'white'
                        },
                        states: {
                            hover: {
                                
                            },
                            select: {
                                fill: '#039',
                                style: {
                                    color: 'white'
                                }
                            }
                        }
                    },
                    inputBoxBorderColor: "#cccccc",
                    inputDateFormat: "%b %e, %Y",
                    inputEditDateFormat: "%Y-%m-%d",
                    inputEnabled: true,
                    // selected: 1
                }
            });
              
          }, 1000);
            
        },
// BATTERY: Finish. //
}

//Template onRendered moved here:
Template.siteIndex.onRendered(function(){
    var _self = this;
        // console.log(this.$('#mybarChart'), 'this')
    _self.autorun(() => {
        //console.log('autorun')
        var data_devID = new Array();
        site_device.find({site_id : new Mongo.ObjectID(Session.get("siteId"))}).forEach(function(row){
            data_devID.push(row.dev_id);
        })
    })
    
    import "../../../public/plugins/bootstrap-table-develop/bootstrap-table.min.css";
    import "../../../public/plugins/bootstrap-table-develop/bootstrap-table.min.js";
    // import "../../../public/plugins/bootstrap-table-develop/dark-unica.js";
    import "../../../public/plugins/bootstrap-table-develop/extensions/filter-control/bootstrap-table-filter-control.js";
    import "../../../public/plugins/slimScroll/jquery.slimscroll.min.js";
    import "../../../public/plugins/highchart/highcharts.js";
    import "../../../public/plugins/highchart/highstock.js";
    import "../../../public/plugins/highchart/exporting.js";
    // import "../../../public/fonts/fontawesome/font-awesome.min.css";
    // import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
})
//........

Template.siteIndex.events({
    
    'click button[id="btn-addDevice"]' : function(e){
        $("#equipment-detail").modal("show");
    },
    'click #targetelement' : function(e){
        var el = e.currentTarget;
        var target=e.target;
        var nama_device_pop=$(target).parents('#group_nama_device').find("#nama_device").html();
        target_id=$(target).attr("id");
        if(target_id!='dd_detail') {
            $("div [id='targetelement']").removeClass("active");
            $(el).addClass("active");
            if($("div [id*='detailPower'][data-devid='"+ $(el).data("devid") +"']").is(":visible")){
                $("div [id*='detailPower'][data-devid='"+ $(el).data("devid") +"']").hide("slow");
                $("div [id='targetelement']").removeClass("active");
            }else{
                $("div [id*='detailPower'][data-devid!='"+ $(el).data("devid") +"']").hide("slow", function(){
                    $("div [id*='detailPower'][data-devid='"+ $(el).data("devid") +"']").show("slow");
                })
            }          
        }else {
          var datachart={"d_id":"4","data":[{"PA":"219.24","T":"20180919205246"},{"PA":"218.89","T":"20180919213900"},{"PA":"218.68","T":"20180919223346"},{"PA":"218.68","T":"20180919232837"},{"PA":"219.04","T":"20180920002651"},{"PA":"218.94","T":"20180920012205"},{"PA":"218.68","T":"20180920021432"},{"PA":"219.04","T":"20180920030700"},{"PA":"218.84","T":"20180920040139"},{"PA":"218.99","T":"20180920045524"},{"PA":"218.63","T":"20180920054837"},{"PA":"219.04","T":"20180920063931"},{"PA":"218.99","T":"20180920073343"},{"PA":"218.99","T":"20180920082741"},{"PA":"219.29","T":"20180920092623"},{"PA":"218.89","T":"20180920102129"},{"PA":"218.99","T":"20180920111536"},{"PA":"218.94","T":"20180920120817"},{"PA":"219.45","T":"20180920130420"},{"PA":"218.89","T":"20180920135803"},{"PA":"218.84","T":"20180920144819"},{"PA":"219.14","T":"20180920160811"},{"PA":"218.94","T":"20180920165833"},{"PA":"218.79","T":"20180920175130"},{"PA":"218.48","T":"20180920184028"},{"PA":"219.24","T":"20180920193535"},{"PA":"219.24","T":"20180920202508"},{"PA":"218.79","T":"20180920211928"},{"PA":"218.99","T":"20180920220938"},{"PA":"218.99","T":"20180920230355"},{"PA":"219.14","T":"20180920235425"},{"PA":"218.79","T":"20180921004600"},{"PA":"218.79","T":"20180921013724"},{"PA":"218.89","T":"20180921023141"},{"PA":"218.99","T":"20180921032554"},{"PA":"218.73","T":"20180921041638"},{"PA":"219.09","T":"20180921050723"},{"PA":"218.58","T":"20180921062800"},{"PA":"218.84","T":"20180921072209"},{"PA":"218.94","T":"20180921081411"},{"PA":"218.84","T":"20180921090535"},{"PA":"218.84","T":"20180921100027"},{"PA":"218.63","T":"20180921105321"},{"PA":"218.94","T":"20180921114709"},{"PA":"219.24","T":"20180921123634"},{"PA":"219.19","T":"20180921132717"},{"PA":"218.79","T":"20180921141336"},{"PA":"218.94","T":"20180921150348"},{"PA":"219.09","T":"20180921155712"},{"PA":"218.84","T":"20180921165013"},{"PA":"219.29","T":"20180921174222"},{"PA":"219.19","T":"20180921183150"},{"PA":"219.14","T":"20180921192356"},{"PA":"219.29","T":"20180921201708"},{"PA":"219.29","T":"20180921210614"}],"minY":"198","maxY":"242","t_csrf":null};
          var dataParams = {
            devId : $(target).parents("li").data("devid"),
            protocol: $(target).parents("div").data("protocol")
          };
          // console.log(dataParams);
          if ( dataParams ) {
            Session.set('sitelog', dataParams);
            Meteor.subscribe('featured-sitelog', dataParams);
          }
          var unit = $(target).parents("div").data("unit");
          $("#chartSite").modal("show").on("hidden.bs.modal", function(){
            $(target).parents("li").on("click", function(){
                // equipment_detail(this, 0, getDataLastUpdate2, menu_report_active);
            });
          });
          $("#chartSite").attr({ "data-did" : dataParams.devId });
          let siteName = site.findOne({ _id : new Mongo.ObjectID(Session.get("siteId"))});
          if (unit === undefined) {
            $("#chartSite").find(".modal-title").text(nama_device_pop + ", " + siteName.name  );
          } else {
           $("#chartSite").find(".modal-title").text(nama_device_pop + " (" + unit + ")"+ ", " + siteName.name  ); 
          }
          $sitelogLoading = '<div>Collecting data need a few minutes. Please wait... <i class="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom fa-spin" style="font-size:24px;color:blue"></i></div>';
          // $("#chartSite").find("#container").text(`&nbsp;Collecting data need a few minutes. Please wait...`);
          $("#chartSite").find("#container").html($sitelogLoading);
          var startTime = new Date().getTime();
          var getSitelog = setInterval( function() {
            var getSitelogData = Sitelog.find({dev_id: dataParams.devId }).fetch();
            console.log(getSitelogData);
            if ( getSitelogData.length>0) {
              SITE.dd_detail($(target), dataParams.protocol, datachart, nama_device_pop);
              clearInterval(getSitelog);
            } else {
              if( (new Date().getTime()) - startTime >= 15000 ){
                $("#chartSite").find("#container").text(`This parameter's values has not history yet. Close this popup.`);
                clearInterval(getSitelog);
              }
            }
          }, 5000 );
        }

    }
});

Template.siteIndex.helpers({
    data_device_category      : SITE.deviceCategories,
    data_site_device_category : SITE.siteDeviceCategory,
    data_site_devices         : SITE.siteDevices,
    data_site_devicesAll      : SITE.siteDeviceAll,
    data_protocol             : SITE.protocol,
    data_site_device_sensor   : SITE.siteDevicesSensor,

    counterStatus : function(args){
        args = args.hash;
        var c = new Array();
        site_device.find(args).fetch().forEach(function(row){
            var size = _.size(_.indexBy(site_device_sensor.find({dev_id : row.dev_id}).fetch(), 'protocol_id'));
            var numShow = _.size( _.indexBy(site_device_sensor.find({dev_id : row.dev_id, is_show : true}).fetch(), 'protocol_id'));
            c.push({
                deviceID : row.device_id,
                size : size,
                numShow : numShow,
                statusLink : (size > numShow) ?  'link' : 'unlink',
                colSize : (numShow * 4)
            })
        });

        return [_.indexBy(c, 'deviceID')[args.device_id]];
    },
    listCamera : function(args){
        
        if(typeof args !== "undefined"){
              return list_camera.find( args.hash, { sort: {file: -1}, limit: 10 } );
          }

        // console.log('listCamera: ', args.hash ) 
    },
    sensorsLoading: () => {
      var sensorsAll = [];
      var siteDevAll = site_device.find({ site_id : new Mongo.ObjectID( Session.get("siteId") ) }).fetch();
      _.each(siteDevAll, function(doc){
        sensorsAll.push( doc.dev_id );
      });
      return site_device_sensor.find({dev_id: { $in: sensorsAll }}).count();
    },
    createChart: function () {
      Meteor.defer(function () {
        SITE.showmybarchart();
      });
    },
    showgaugechart: () => {
      Meteor.defer(function () {
        SITE.showgaugechart();
      });
    },
    batteryLoading: () => {
      var dataBatt = [];
      var getDataBatt = site_device.find(
        {
          $and: [
            { site_id : new Mongo.ObjectID( Session.get("siteId") ) },
            { device_id: new Mongo.ObjectID("5b59a20ca2e7142d4bcbe4d9") }
          ]
        }
      ).fetch();
      _.each(getDataBatt, function(doc){
        dataBatt.push( doc.dev_id );
      });
      return battery_parsed.find({ dev_id: { $in: dataBatt } }).fetch();
    },
})