var chart;
$(function () {
    
    var groupSensorID = new Array();
    var gridChartAktif = new Array();
    var addPointChart;
    
    var fn = {
        "scrollSideMenu" : function(){
            
            $(".sidebar").slimScroll({
              size: '4px', 
              width: '100%', 
              height: $(window).height()+'px', 
              color: '#3498db', 
              allowPageScroll: true, 
              alwaysVisible: true     
            });
            
        },
        "regionAktif": function(){
            
            $(".treeview").each(function(){
                var status = $(this).find("[data-status='on']");

                if(status.length > 0){
                    $("#city", this).css({borderColor: "#2ecc71"});
                }else{
                    $("#city", this).css({borderColor: "gray"});
                }
            });
        },
        "deviceClick": function(siteid, datalast){
            
            $("[data-iddev]").each(function(){
               
                var deviceName      = $(this).data("name");
                var deviceKategori  = $(this).parents(".panel").find(".panel-title").text();
                var deviceid        = $(this).data("iddev");
                
                $(this).on("click", function(n, x){ //click sidebar device
                   
                    if($.find(".selected-device").length > 0)
                        $(".selected-device").removeClass("selected-device");
                    $(this).addClass("selected-device");
                    
                    // GRID REPORT
                    $("#content-report").show("slow", "swing", function(){
                       
                        $("#title-snmp", this).html(deviceKategori.toUpperCase() + " - " + deviceName.toUpperCase());
                        $("[data-content]").attr("data-content", '{"siteid" : "'+ siteid +'", "deviceid" : "'+ deviceid + '"}');
                        $("[data-content]").attr("data-category", deviceKategori);
                        
                        /**
                         * FIRST UPDATE BOX CONTENT ON CONTENT
                         * REPORT MENU
                         * BASED ON paramter each device
                         * PMFWD
                         * PMRFL
                         * ..etc
                         */
                        if(typeof datalast[deviceid] !== "undefined"){
                            datalast[deviceid].forEach(function(key){
                                var values = key.value;
                                if(key.sensorid == "PMFWD")
                                    values = (key.value / 1000) + " kW";
                                if(key.sensorid == "PMRFL")
                                    values = (key.value / 1000) + " kW";
                                if(key.sensorid == "PMFWDDB")
                                    values = "("+ key.value +" dBm)";
                                if(key.sensorid == "PMRFLDB")
                                    values = "("+ key.value +" dBm)";
                                if(key.sensorid == "PMRTL")
                                    values = key.value +" dBm";
                                
                                $("#" + key.sensorid).text(values);
                            });
                        }else{
                            $("small","[data-content]").each(function(){
                               var c = $(this).attr("id"); 
                                $("#" + c).text("-");
                            });
                        }
                        /** END UPDATE **/
                    });
                    
                }); // endclick sidebar device
                
                if($(".selected-device").is(":visible"))
                    $(".selected-device").trigger("click");   
            });
        
        },
        "deviceFreechartClick" : function(siteid){
            
//            $("[data-iddev]").each(function(){
                
                $("[data-iddev]").on("click", function(e){ //click sidebar device
                    
                    var siteid          = $(".selected-site").attr("id");
                    var deviceName      = $(this).data("name");
                    var deviceKategori  = $(this).parents(".panel").find(".panel-title").text();
                    var deviceid        = $(this).data("iddev");

                    if($.find(".selected-device").length > 0)
                        $(".selected-device").removeClass("selected-device");
                    $(this).addClass("selected-device");
                    
                    var chartID = deviceKategori.toUpperCase()+"#"+siteid+"#"+deviceid;
                    
                    /** CONTENT FREECHART **/
                    var arrChartData = new Array();
                    arrChartData["deviceKategori"]  = deviceKategori.toUpperCase();
                    arrChartData["deviceName"]      = deviceName.toUpperCase();
                    arrChartData["siteid"]          = siteid;
                    arrChartData["deviceid"]        = deviceid;
                    arrChartData["chartID"]         = chartID;
                    if($.isEmptyObject(gridChartAktif)){
                        
                        gridChartAktif.push(chartID);
                        var a = $("#content-freechart:last-child").clone().prependTo($("#content-freechart:last").parent());
                        $(a).show("slow", "swing", function(){
                            fn.freechart(this, arrChartData);
                            console.log("pertama");
                        });
                        
                    }else{
                        
                        if($.inArray(chartID, gridChartAktif) === -1){    // if not found
                            gridChartAktif.push(chartID);
                            var a = $("#content-freechart:last-child").clone().prependTo($("#content-freechart:last").parent());
                            $(a).show("slow", "swing", function(){
                                fn.freechart(this, arrChartData);
                                console.log("clone");
                            });
                            
                        }else{
                            
                            if($("div[id='"+chartID+"']").is(":visible") === true){
                                var parentTarget = $("div[id='"+chartID+"']").parents("#content-freechart");
                                if(parentTarget.data("category") == deviceKategori.toUpperCase() && parentTarget.data("freechart").siteid == siteid &&  parentTarget.data("freechart").deviceid == deviceid){
                                    fn.freechart(parentTarget, arrChartData);
                                    console.log("yg ada");
                                }
                                
                            }else{
                                var a = $("#content-freechart:last-child").clone().prependTo($("#content-freechart:last").parent());
                                $(a).show("slow", "swing", function(){
                                    fn.freechart(this, arrChartData);
                                    console.log("abis remove");
                                });
                            }
                                
                        }
                    } // end if empty object
                    
                    //** SELECT BOX CATEGORY VALUE
                    $("#content-freechart:animated").find("#chart-category").on("change", function(){
                        if($("option", this).is(":selected")){
                            $(this).parents("#content-freechart").attr("data-freechart", '{"siteid" : "'+siteid+'", "deviceid" : "'+deviceid+'", "sensorid" : "'+$(this).val()+'"}');
                            fn.getDataChart(chartID, siteid, deviceid, $(this).val());
                        }
                    });
                    
                e.preventDefault();
                return false;
            }); // endclick sidebar device
                
        },
        "updateTime" : function(){
            
//            var time = Math.floor(Date.now() / 1000);
            var timee = new Array();
            $("[data-lastupdate]").each(function(n, target){
                timee[n] = $(this).data("lastupdate");
            });
            return timee;
            
        },
        "getDataChart" : function(target, siteid, deviceid, sensorid, typechart){

            $.post("../ajax/sidebar.php", {siteid : siteid, deviceid : deviceid, sensorid : sensorid, type : "datavalue"}, function(result){
                
                chartDevice(target, result, getDataLastUpdate, typechart);
                
            }, "json");
            
        },
        "freechart" : function(a, data, category){
            
            var sensorid = $(a).find("option:selected","#chart-category").val();
            
            $("#title-snmp", a).html(data["deviceKategori"] + " - " + data["deviceName"]);
            $(a).attr("data-freechart", '{"siteid" : "'+ data["siteid"] +'", "deviceid" : "'+ data["deviceid"] + '", "sensorid" : "'+sensorid+'"}');
            $(a).attr("data-category", data["deviceKategori"]);
            var x = $(".freechart", a).attr("id", data["chartID"]);
             
            if(typeof category === "undefined"){
                category = $(x).parents("#content-freechart").find("#chart-category option").val();
            }
            
            fn.getDataChart(data["chartID"], data["siteid"], data["deviceid"], category);
            

        }
    } // end fn
    
    /** scroll sidebar **/
    fn.scrollSideMenu();
    $(window).resize(function(){ 
        fn.scrollSideMenu();
    });
    
    fn.regionAktif(); 
    
    var datalast;
    $("[data-sidebarcontrol]").on("click", function(e){  // LINK SITE

        var siteid = $(this).attr("id");

        if($.find(".selected-site").length > 0)
            $(".selected-site").removeClass("selected-site");
        $(this).addClass("selected-site");

        var datalast = $(".selected-site").parent().data("lastcontentsnmp");

        if($("#content-report").length > 0)
            fn.deviceClick(siteid, datalast);
        
        if($(".selected-device").length > 0)
            $(".selected-device").trigger("click");

        e.preventDefault();
        return false;
    });

    var time;
    var times = new Array();
    var getDataLastUpdate = setInterval(function(){

        $("[data-lastupdate]").each(function(n, target){

            if(!isNaN(times[n]))
                time = times[n];
            else
                time = $(this).data("lastupdate");
            
            if(time != ""){

                var siteid = $("a", this).attr("id");
                
                /**
                 * The result of the process
                 * data is object that consist of value
                 * - lastUpdate is String
                 * - lastContent is Array and Object
                 * - siteid is String
                 */
                $.ajax({
                  type      : "POST",
                  url       : "../ajax/sidebar.php",
                  data      : { time : time, siteid : siteid, type : "" },
                  dataType  : "json",
                  cache     : false,
                  success   : function(result){
                        
                        /** CHANGE THE STATUS LOCATION/REGION MENU ON SIDEBAR MENU **/
                        if(typeof result.siteid !== "undefined"){
                            $("#" + result.siteid).attr("data-status", "on");
                            $("#" + result.siteid).find("span").css({borderColor: "green"});
                        }else{
                            $("#" + siteid).attr("data-status", "off");
                            $("#" + siteid).find("span").css({borderColor: "gray"});
                        }
                        fn.regionAktif();
                        /** END THE CHANGE **/
                      
                        
                        /** UPDATE
                         * data-lastupdate
                         * data-lastcontentsnmp
                         * box-content
                         * lasttimeupdate
                         */
                        if(jQuery.isEmptyObject(result) === false){
                            
                            // update data-lastupdate
                            $("#" + result.siteid).parent().attr("data-lastupdate", result.lastUpdate);
                            
                            // update data-lastcontentsnmp
                            $("#" + result.siteid).parent().attr("data-lastcontentsnmp", JSON.stringify(result.lastContent));
                            
                            // update box-content
                            if(result.siteid === $(".selected-site").attr("id"))
//                                $("[data-sidebarcontrol].selected-site").trigger("click");  
                                fn.deviceClick($(".selected-site").attr("id"), result.lastContent);
                            
                            // update lasttimeupdate
                            times[n] = result.lastUpdate;
                            
//                            JSON.parse(result.lastData).forEach(function(datalast){
//                                JSON.parse(result.sensorID).forEach(function(sensorID){
//                                    if(Object.keys(datalast)[0]  === sensorID){
//                                        groupSensorID.push(Object.values(datalast)[0]);
//                                    }
//                                });
//                            });
                            
                            
                            /**
                             * UPDATE DATA CHART
                             * based on siteid, deviceid, sensorid
                             * value 
                             * (int) time * 1000
                             * (int) value
                             */
                            var targetBox;
                            if($("[data-chartID]").length > 0) 
                                targetBox = "chartid";
                            else if($("[data-freechart]").length > 0) 
                                targetBox = "freechart";
                            else
                                targetBox = false;
                            
                            if(targetBox !== false){
                                var devid       = $("[data-"+targetBox+"]").data(targetBox).deviceid;
                                var sid         = $("[data-"+targetBox+"]").data(targetBox).siteid;
                                var sensorid    = $("[data-"+targetBox+"]").data(targetBox).sensorid;
                                result.lastContent[devid].forEach(function(res){
                                    if(res.siteid == sid){
                                        if(res.sensorid == sensorid){
                                            chart.series[0].addPoint(eval([(res.time_unix * 1000), (res.value * 1) / 1000]), true, true);
                                        }
                                    }
                                });
                            }
                            /** END UPDATE DATA CHART **/
                            
                            
                        }
                        /** END THE UPDATE **/
                      
                      
                    }
                });

//                    console.log(siteid);
            }
        }); // end [data-lastupdate]

//    }, (150 * 1000)); // 15' end setInterval
    }, (4000 * 1000)); // 15' end setInterval
    //** END UPDATE STATUS ACTIVE ICON REGION **//

/**
 * CHART 
 * on report menu
 */
$("[data-chart]").each(function(s, target){
    $(this).on("click", function(){

        var siteid      = $(target).parents("#content-report").data("content").siteid;
        var deviceid    = $(target).parents("#content-report").data("content").deviceid;
        var sensorid    = $(this).data("chart");
        var devicename  = $(target).parents("#content-report").find("#title-snmp").text();
        var sensorname  = $(this).siblings("span").text();

        $("#chartSite").modal("show");
        $("#chartSite").attr("data-chartID", '{"siteid" : "'+siteid+'", "deviceid" : "'+deviceid+'", "sensorid" : "'+sensorid+'"}');
        $("#chartSite").find(".modal-title").text(devicename.toUpperCase() + ' - '+ sensorname.toUpperCase());

        fn.getDataChart("container", siteid, deviceid, sensorid);
        
        
    });
});
    // END CHART //
    
fn.deviceFreechartClick();

if($("#freechart").length > 0)
    fn.getDataChart("freechart", "bandungsctv01", "1", "PMFWD", "column");    

    

//Initialize Select2 Elements
$(".select2").select2();
    
$('#user_management').DataTable({
  "paging": true,
  "lengthChange": true,
  "searching": true,
  "ordering": true,
  "info": true,
  "autoWidth": true
});
$('#dashboard_management').DataTable({
  "paging": true,
  "lengthChange": true,
  "searching": true,
  "ordering": true,
  "info": true,
  "autoWidth": true
});
$('#alarm_setting').DataTable({
  "paging": true,
  "lengthChange": true,
  "searching": true,
  "ordering": true,
  "info": true,
  "autoWidth": true
});
$('#equipment_setting').DataTable({
  "paging": true,
  "lengthChange": true,
  "searching": true,
  "ordering": true,
  "info": true,
  "autoWidth": true
});
    
    
    //Flat red color scheme for iCheck
    $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
      checkboxClass: 'icheckbox_flat-green',
      radioClass: 'iradio_flat-green'
    });
    
    

});


function chartDevice(target, dataChart, loadNewData, typechart){
//$(function(){
    if(typeof typechart === "undefined") typechart = "";

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

        rangeSelector: {
            selected: 1
        },
        exporting: {
            enabled: false
        },
        yAxis: {
            opposite: false,
            labels:{
                format: '{value} Kw'
            }
        },
        credits: {
            style: {
                "display" : "none"
            }
        },
        series: [
            {
                name: '',
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
                        enabled: false
                    }
                }
            }]
        },
        rangeSelector: {
            selected: 4,
            enabled : true,
            inputEnabled: false,
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
                style: {
                    fontWeight: 'bold',
                }
            }
        }
    });
}

function removeGrid(target){

    target.slideUp('slow', function(){
        $(this).remove();
    });
}

/**
 * MAP MENU
 * Map Content
 */
var _this_url_ = "http://localhost/scm2/";

document.getElementById("map").style.height = $(window).height() + "px";
    
function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
//      zoom: 4,
//      center: {lat: -28.024, lng: 140.887},
      zoom: 5,
      center: {lat: -0.517, lng: 116.541},
      mapTypeControl: false
    });
    
    
    var contentString = '<!-- Custom Tabs -->' +
          '<div class="nav-tabs-custom" style="margin-bottom: 0">' +
            '<ul class="nav nav-tabs pull-right">' +
              '<li><a class="text-blue tab" href="#siteinfo" data-toggle="tab" aria-expanded="false"><span class="glyphicon glyphicon-info-sign text-blue"></span>&nbsp;&nbsp;Site Info</a></li>' +
              '<li class="active"><a class="text-blue tab" href="#valuenow" data-toggle="tab" aria-expanded="true"><span class="glyphicon glyphicon-cog text-blue"></span>&nbsp;&nbsp;Value Now</a></li>' +
              '<li><a class="text-blue tab" href="#alarm" data-toggle="tab" aria-expanded="false"><span class="glyphicon glyphicon-bell text-blue"></span>&nbsp;&nbsp;Alarm Status</a></li>' +
              '<li><a class="text-blue tab" href="#equipment" data-toggle="tab" aria-expanded="false"><span class="glyphicon glyphicon-wrench text-blue"></span>&nbsp;&nbsp;Equipment List</a></li>' +
            '</ul>' +
            '<div class="tab-content">' +
              '<div class="tab-pane fade" id="siteinfo">' +
                '<h3 class="profile-username text-center">SCTV</h3>' +
                '<p class="text-muted text-center">Bandung, Jawa Barat</p>' +
                '<ul class="list-group list-group-unbordered">' +
                '<li class="list-group-item"><b>IP</b> <a class="pull-right">0.0.0.0</a></li>' +
                '<li class="list-group-item"><b>Device Number</b> <a class="pull-right">234</a></li>' +
                '<li class="list-group-item"><b>LatLng</b> <a class="pull-right">13.993849, -83.38493</a></li>' +
                '</ul>' +
              '</div>' +
              '<!-- /.tab-pane -->' +
              '<div class="tab-pane fade in active" id="valuenow">' +
                '<table class="table">' +
                '<tbody><tr>' +
                  '<th></th>' +
                  '<th align="center"><center>EMS</center></th>' +
                  '<th align="center"><center>SNMP</center></th>' +
                '</tr>' +
                '<tr>' +
                  '<td>Forward</td>' +
                  '<td align="center"><span class="badge bg-blue">1000kW (0.7dBm)</span></td>' +
                  '<td align="center"><span class="badge bg-blue">1500kW (0.89dBm)</span></td>' +
                '</tr>' +
                '<tr>' +
                  '<td>Reflected</td>' +
                  '<td align="center"><span class="badge bg-yellow">2000kW (8.7dBm)</span></td>' +
                  '<td align="center"><span class="badge bg-yellow">2500kW (5.89dBm)</span></td>' +
                '</tr>' +
                '<tr>' +
                  '<td>VSWR</td>' +
                  '<td align="center"><span class="badge bg-red">50</span></td>' +
                  '<td align="center"><span class="badge bg-red">30</span></td>' +
                '</tr>' +
                '<tr>' +
                  '<td>Return Loss</td>' +
                  '<td align="center"><span class="badge bg-red">50dBm</span></td>' +
                  '<td align="center"><span class="badge bg-red">30dBm</span></td>' +
                '</tr>' +
              '</tbody></table>' +
              '</div>' +
              '<!-- /.tab-pane -->' +
              '<div class="tab-pane fade" id="alarm">' +
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
                'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,' +
                'when an unknown printer took a galley of type and scrambled it to make a type specimen book.' +
                'It has survived not only five centuries, but also the leap into electronic typesetting,' +
                'remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset' +
                'sheets containing Lorem Ipsum passages, and more recently with desktop publishing software' +
                'like Aldus PageMaker including versions of Lorem Ipsum.' +
              '</div>' +
              '<!-- /.tab-pane -->' +
              '<div class="tab-pane fade" id="equipment">' +
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
                'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,' +
                'when an unknown printer took a galley of type and scrambled it to make a type specimen book.' +
                'It has survived not only five centuries, but also the leap into electronic typesetting,' +
                'remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset' +
                'sheets containing Lorem Ipsum passages, and more recently with desktop publishing software' +
                'like Aldus PageMaker including versions of Lorem Ipsum.' +
              '</div>' +
              '<!-- /.tab-pane -->' +
            '</div>' +
            '<!-- /.tab-content -->' +
            '<div class="iw-bottom-gradient"></div>' +
          '</div>' +
          '<!-- nav-tabs-custom -->';
    
    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 600,
//        maxHeight: 293,
        height: 300,
//        pixelOffset: ('100', '200')
        disableAutoPan: true
    });
//    console.log(infowindow)
    
    // Create an array of alphabetical characters used to label the markers.
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    var markers = locations.map(function(location, i) {
        
        var marker = new google.maps.Marker({
            position: location,
//            label: labels[i % labels.length],
            animation: google.maps.Animation.DROP,
//            icon: '../asset/wireless_tower.png',
            icon: _this_url_ +'asset/telecom.png',
        });
        
        marker.addListener('click', function() {
            infowindow.open(map, marker);
            
        });

/*
 * The google.maps.event.addListener() event waits for
 * the creation of the infowindow HTML structure 'domready'
 * and before the opening of the infowindow defined styles
 * are applied.
 */
google.maps.event.addListener(infowindow, 'domready', function() {

   // Reference to the DIV which receives the contents of the infowindow using jQuery
   var iwOuter = $('.gm-style-iw');

   /* The DIV we want to change is above the .gm-style-iw DIV.
    * So, we use jQuery and create a iwBackground variable,
    * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
    */
   var iwBackground = iwOuter.prev();
    
   // Remove the background shadow DIV
   iwBackground.children(':nth-child(2)').css({'display' : 'none'});

   // Remove the white background DIV
   iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    
    // Moves the infowindow 115px to the right.
    iwOuter.parent().parent().css({left: '0px'});    
            
    // Moves the shadow of the arrow 76px to the left margin 
    iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 260px !important;'});

    // Moves the arrow 76px to the left margin 
    iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 260px !important;'});

    // Changes the desired color for the tail outline.
    // The outline of the tail is composed of two descendants of div which contains the tail.
    // The .find('div').children() method refers to all the div which are direct descendants of the previous div. 
    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});    

    // Taking advantage of the already established reference to
    // div .gm-style-iw with iwOuter variable.
    // You must set a new variable iwCloseBtn.
    // Using the .next() method of JQuery you reference the following div to .gm-style-iw.
    // Is this div that groups the close button elements.
    var iwCloseBtn = iwOuter.next();

    // Apply the desired effect to the close button
    iwCloseBtn.css({
    //  opacity: '1', // by default the close button has an opacity of 0.7
      width: '13px', height: '13px', // button repositioning
      right: '36px', top: '10px', // button repositioning
    //  border: '7px solid #48b5e9', // increasing button border and new color
    //  'border-radius': '13px', // circular effect
      'box-shadow': '0 0 5px #3990B9' // 3D effect to highlight the button
      });

    // The API automatically applies 0.7 opacity to the button after the mouseout event.
    // This function reverses this event to the desired value.
    iwCloseBtn.mouseout(function(){
      $(this).css({opacity: '1'});
    });
    
});    
    

        
        
        return marker;
        
    });
        // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    }
    
    
    
    var locations = [
        {lat: -5.147665, lng: 119.432732},
        {lat: 5.051701, lng: 97.318123},
        {lat: -8.086410, lng: 111.713127},
        {lat: -7.866688, lng: 111.466614},
        {lat: 3.750531, lng: 98.470528},
        {lat: -2.133333, lng: 106.116669},
        {lat: -5.135399, lng: 119.423790},
        {lat: -6.347891, lng: 106.741158},
        {lat: -6.574958, lng: 110.670525},
        {lat: 1.474830, lng: 124.842079},
        
        {lat: -31.563910, lng: 147.154312},
        {lat: -33.718234, lng: 150.363181},
        {lat: -33.727111, lng: 150.371124},
        {lat: -33.848588, lng: 151.209834},
        {lat: -33.851702, lng: 151.216968},
        {lat: -34.671264, lng: 150.863657},
        {lat: -35.304724, lng: 148.662905},
        {lat: -36.817685, lng: 175.699196},
        {lat: -36.828611, lng: 175.790222},
        {lat: -37.750000, lng: 145.116667},
        {lat: -37.759859, lng: 145.128708},
        {lat: -37.765015, lng: 145.133858},
        {lat: -37.770104, lng: 145.143299},
        {lat: -37.773700, lng: 145.145187},
        {lat: -37.774785, lng: 145.137978},
        {lat: -37.819616, lng: 144.968119},
        {lat: -38.330766, lng: 144.695692},
        {lat: -39.927193, lng: 175.053218},
        {lat: -41.330162, lng: 174.865694},
        {lat: -42.734358, lng: 147.439506},
        {lat: -42.734358, lng: 147.501315},
        {lat: -42.735258, lng: 147.438000},
        {lat: -43.999792, lng: 170.463352}
    ]
    
/** End Map Menu Content Setup **/