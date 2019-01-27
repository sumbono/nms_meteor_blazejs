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
                                $("div[id='content-freechart']").each(function(){
                                    if($(this).data("category") == deviceKategori.toUpperCase() && $(this).data("freechart").siteid == siteid &&  $(this).data("freechart").deviceid == deviceid){
                                        fn.freechart(this, arrChartData);
                                        console.log("yg ada");
                                    }
                                });
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
                            fn.getDataChart(chartID, siteid, deviceid, $(this).val());
//                            console.log();
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
        "getDataChart" : function(target, siteid, deviceid, sensorid){

            $.post("../ajax/sidebar.php", {siteid : siteid, deviceid : deviceid, sensorid : sensorid, type : "datavalue"}, function(result){
                
                chartDevice(target, result, getDataLastUpdate);
                
            }, "json");
            
        },
        "freechart" : function(a, data, category){
            
            $("#title-snmp", a).html(data["deviceKategori"] + " - " + data["deviceName"]);
            $(a).attr("data-freechart", '{"siteid" : "'+ data["siteid"] +'", "deviceid" : "'+ data["deviceid"] + '"}');
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
    fn.deviceFreechartClick();
    
    var datalast;
    $("[data-sidebarcontrol]").on("click", function(e){  // LINK SITE

        var siteid = $(this).attr("id");

        if($.find(".selected-site").length > 0)
            $(".selected-site").removeClass("selected-site");
        $(this).addClass("selected-site");

            var datalast = $(".selected-site").parent().data("lastcontentsnmp");

            if($("#content-report").length > 0)
                fn.deviceClick(siteid, datalast);

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
                            if($("[data-chartID]").length > 0){
                                var devid       = $("[data-chartid]").data("chartid").deviceid;
                                var sid         = $("[data-chartid]").data("chartid").siteid;
                                var sensorid    = $("[data-chartid]").data("chartid").sensorid;
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

    }, (150 * 1000)); // 15' end setInterval
//    }, (4000 * 1000)); // 15' end setInterval
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

});


function chartDevice(target, dataChart, loadNewData){
//$(function(){

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
    