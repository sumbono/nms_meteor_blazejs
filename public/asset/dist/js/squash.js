var chart;
$(function () {
    
    var groupSensorID = new Array();
    var gridChartAktif = new Array();
    var addPointChart;
    
    
    var fn = {
        "scrollSideMenu" : function(){
            
            $(".sidebar").each(function(){
                var target = $(this);
                var s_height = ($(window).height() - $(".main-header").height()) + 'px';
                
                if($(target).is(":visible")){
                    $(target).slimScroll({
                      size: '4px', 
                      width: '100%',
                      height: s_height, 
                      color: '#cddc39', 
                      allowPageScroll: true, 
                      alwaysVisible: true     
                    });
                }
            });
            
            $(".fixed-table-body").slimScroll({
              size: '4px', 
              width: '100%',
              height: $(".fixed-table-body").height() + 'px', 
//              height: '390px', 
              color: '#3498db', 
//              allowPageScroll: true, 
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

//    var time;
//    var times = new Array();
//    var getDataLastUpdate = setInterval(function(){
//
//        $("[data-lastupdate]").each(function(n, target){
//
//            if(!isNaN(times[n]))
//                time = times[n];
//            else
//                time = $(this).data("lastupdate");
//            
//            if(time != ""){
//
//                var siteid = $("a", this).attr("id");
//                
//                /**
//                 * The result of the process
//                 * data is object that consist of value
//                 * - lastUpdate is String
//                 * - lastContent is Array and Object
//                 * - siteid is String
//                 */
//                $.ajax({
//                  type      : "POST",
//                  url       : "../ajax/sidebar.php",
//                  data      : { time : time, siteid : siteid, type : "" },
//                  dataType  : "json",
//                  cache     : false,
//                  success   : function(result){
//                        
//                        /** CHANGE THE STATUS LOCATION/REGION MENU ON SIDEBAR MENU **/
//                        if(typeof result.siteid !== "undefined"){
//                            $("#" + result.siteid).attr("data-status", "on");
//                            $("#" + result.siteid).find("span").css({borderColor: "green"});
//                        }else{
//                            $("#" + siteid).attr("data-status", "off");
//                            $("#" + siteid).find("span").css({borderColor: "gray"});
//                        }
//                        fn.regionAktif();
//                        /** END THE CHANGE **/
//                      
//                        
//                        /** UPDATE
//                         * data-lastupdate
//                         * data-lastcontentsnmp
//                         * box-content
//                         * lasttimeupdate
//                         */
//                        if(jQuery.isEmptyObject(result) === false){
//                            
//                            // update data-lastupdate
//                            $("#" + result.siteid).parent().attr("data-lastupdate", result.lastUpdate);
//                            
//                            // update data-lastcontentsnmp
//                            $("#" + result.siteid).parent().attr("data-lastcontentsnmp", JSON.stringify(result.lastContent));
//                            
//                            // update box-content
//                            if(result.siteid === $(".selected-site").attr("id"))
////                                $("[data-sidebarcontrol].selected-site").trigger("click");  
//                                fn.deviceClick($(".selected-site").attr("id"), result.lastContent);
//                            
//                            // update lasttimeupdate
//                            times[n] = result.lastUpdate;
//                            
////                            JSON.parse(result.lastData).forEach(function(datalast){
////                                JSON.parse(result.sensorID).forEach(function(sensorID){
////                                    if(Object.keys(datalast)[0]  === sensorID){
////                                        groupSensorID.push(Object.values(datalast)[0]);
////                                    }
////                                });
////                            });
//                            
//                            
//                            /**
//                             * UPDATE DATA CHART
//                             * based on siteid, deviceid, sensorid
//                             * value 
//                             * (int) time * 1000
//                             * (int) value
//                             */
//                            var targetBox;
//                            if($("[data-chartID]").length > 0) 
//                                targetBox = "chartid";
//                            else if($("[data-freechart]").length > 0) 
//                                targetBox = "freechart";
//                            else
//                                targetBox = false;
//                            
//                            if(targetBox !== false){
//                                var devid       = $("[data-"+targetBox+"]").data(targetBox).deviceid;
//                                var sid         = $("[data-"+targetBox+"]").data(targetBox).siteid;
//                                var sensorid    = $("[data-"+targetBox+"]").data(targetBox).sensorid;
//                                result.lastContent[devid].forEach(function(res){
//                                    if(res.siteid == sid){
//                                        if(res.sensorid == sensorid){
//                                            chart.series[0].addPoint(eval([(res.time_unix * 1000), (res.value * 1) / 1000]), true, true);
//                                        }
//                                    }
//                                });
//                            }
//                            /** END UPDATE DATA CHART **/
//                            
//                            
//                        }
//                        /** END THE UPDATE **/
//                      
//                      
//                    }
//                });
//
////                    console.log(siteid);
//            }
//        }); // end [data-lastupdate]
//
////    }, (150 * 1000)); // 15' end setInterval
//    }, (4000 * 1000)); // 15' end setInterval
//    //** END UPDATE STATUS ACTIVE ICON REGION **//


if($("#checkbox-total").length > 0){
    var t_value = 0;
    $("input[id='checkbox-total']").on("change", function(){
        if($(this).is(":checked") == true){
            var c_value = $(this).parents(".item").find(".progress-bar:eq(0)").text();
            
            t_value += parseFloat(c_value);
            
        }else{
            
            var c_value = $(this).parents(".item").find(".progress-bar:eq(0)").text();
            
            t_value -= parseFloat(c_value);
        }
        
        $(this).parents(".products-list").find("li:last-child").find(".progress-bar").html(parseFloat(t_value).toFixed(2) + "&nbsp;");
        $(this).parents(".products-list").find("li:last-child").find(".progress-bar").css({width: parseFloat(t_value).toFixed(2)+"%"});
    })
}

if($("#tableAlarm").length > 0){
    
    var $table = $('#tableAlarm');
    $table.bootstrapTable();    
    
    var toolbar = $("#tableAlarm").parents(".bootstrap-table").siblings("#toolbar");
    if($(toolbar).length){
        $(toolbar).appendTo($(".columns", ".fixed-table-toolbar")).show();
        
        $("select[class*='control-site_name']", ".fht-cell").css("width", ($("#tableAlarm th:eq(0)").width() - 4) + "px");
        $("select[class*='control-area']", ".fht-cell").css("width", ($("#tableAlarm th:eq(1)").width() - 4) + "px");
        $("select[class*='control-devices']", ".fht-cell").css("width", ($("#tableAlarm th:eq(2)").width() - 4) + "px");
        $("select[class*='control-devices_detail']", ".fht-cell").css("width", ($("#tableAlarm th:eq(2)").width() - 4) + "px");
    }
}

/** USERLIST **/
if($("#userSetup").length) {
    $("a[id='user_Edit'], button[id='user_Detail']").each(function(){
    $(this).on("click", function(e){

        if($(this).is("#user_Edit")){
            $('input[type=password][name="password"]').parent('.form-group').remove();
        }

        var d_user 	= $(this).parents("tr").data("usercontent");
        var d_client 	= $.parseJSON(d_user.client_id);

        $("#userSetup").modal({
            show : true
        });

        $("#userSetup").on('shown.bs.modal', function(e){

            var button = $(e.relatedTarget);

            // insert input field id
            $("<input type='hidden' value='"+ d_user.id +"' name='id' />").appendTo($(".modal-footer", this)); // user id

            $("input[name='username']", this).val(d_user.username); // username
            $("input[name='realname']", this).val(d_user.realname); // realname

            // is active?
            if(d_user.is_active == 1)
                $("input[name='is_active'][value='1']", this).attr({checked : "checked"});
            else
                $("input[name='is_active'][value='0']", this).attr({checked : "checked"});

            // client
            $.each(d_client, function(key, d_id){
                $("option[value='"+ d_id +"']","select[name='client_id[]']").attr({selected : "selected"});					
            });

            // area
            var d_area = $.parseJSON(d_user.area_id);
            $.each(d_area, function(key, d_id){
                $("option[value='"+ d_id +"']","select[name='area_id[]']").attr({selected : "selected"});					
            });

            // menu id
            var d_menu = $.parseJSON(d_user.menu_id);
            $.each(d_menu, function(key, m_id){
                // submenu
                if($.isPlainObject(m_id)){
                    $.each(m_id, function(menu_id, sub_menu_id){

                        // subsubmenu
                        if($.isPlainObject(sub_menu_id)){
                            $.each(sub_menu_id, function(menu_sub_id, sub_sub_menu_id){
                                $("input[name='menu_id["+key+"]["+menu_id+"]["+sub_sub_menu_id+"]'][value='"+sub_sub_menu_id+"']", e.target).attr({checked : "checked"}).iCheck("check");
                            });
                        }
                        $("input[name='menu_id["+key+"]["+menu_id+"]'][value='"+menu_id+"']", e.target).attr({checked : "checked"}).iCheck("check");
                    });
                }
                $a = $("input[name='menu_id["+key+"]'][value='"+key+"']", e.target).attr({checked : "checked"}).iCheck("check");
            });
        });


    });
        });
    $("#userSetup").on('hide.bs.modal', function(e){
        window.location.href = _this_url_ + "usermanagement/userlist"; 
        $("form", this)[0].reset();
    });
}

if($("#tableThreshold").length > 0){
    var options = {
            filterValues: {
                area: "JAKARTA"
            },
            url: _this_url_ + "threshold/dataThreshold",
            columns: [{
                field: "area",
                title: "Area",
                sortable: true,
                width: "13%",
                align: "left",
                halign: "center",
                filter: {
                    type: "select",
                    data: ["JAKARTA","JAWA TIMUR"]
                }
            }, {
                field: "site_name",
                title: "Site",
                sortable: true,
                width: "13%",
                align: "left",
                halign: "center",
                filter: {
                    type: "select",
                    data: ["Pacitan","Situbondo"]
                }
            }, {
                field: "devices",
                title: "Device",
                sortable: true,
                width: "13%",
                align: "left",
                halign: "center",
                filter: {
                    type: "select",
                    data: []
                }
            }, {
                field: "devices_detail",
                title: "Client Device",
                sortable: false,
                width: "10%",
                align: "left",
                halign: "center",
                filter: {
                    type: "select",
                    data: []
                }
            }, {
                field: "devices_attribute_alias",
                title: "Alias",
                sortable: false,
                width: "3%",
                align: "center",
                halign: "center",
                filter: {
                    type: "select",
                    data: []
                }
            }, {
                field: "value_min",
                title: "Value Min",
                sortable: false,
                width: "3%",
                align: "center",
                halign: "center",
                filter: {
                    type: "input",
                    data: []
                }
            }, {
                field: "value_max",
                title: "Value Max",
                sortable: false,
                width: "3%",
                align: "center",
                halign: "center",
                filter: {
                    type: "input",
                    data: []
                }
            }, {
                field: "limit_min",
                title: "Limit Min",
                sortable: false,
                width: "3%",
                align: "center",
                halign: "center",
                filter: {
                    type: "input",
                    data: []
                }
            }, {
                field: "limit_max",
                title: "Limit Max",
                sortable: false,
                width: "3%",
                align: "center",
                halign: "center",
                filter: {
                    type: "input",
                    data: []
                }
            }, {
                field: "major_min",
                title: "Major Min",
                sortable: false,
                width: "3%",
                align: "center",
                halign: "center",
                filter: {
                    type: "input",
                    data: []
                }
            }, {
                field: "major_max",
                title: "Major Max",
                sortable: false,
                width: "3%",
                align: "center",
                halign: "center",
                filter: {
                    type: "input",
                    data: []
                }
            }, {
                field: "note_alert_min",
                title: "Alert Min",
                sortable: false,
                width: "3%",
                align: "center",
                halign: "center",
                filter: {
                    type: "input",
                    data: []
                }
            }, {
                field: "note_alert_max",
                title: "Alert Max",
                sortable: false,
                width: "3%",
                align: "center",
                halign: "center",
                filter: {
                    type: "input",
                    data: []
                }
            }, {
                field: "description",
                title: "Description",
                sortable: false,
                width: "10%",
                align: "left",
                halign: "center",
                filter: {
                    type: "input"
                }
            }, {
                field: "option",
                title: "Option",
                sortable: false,
                width: "3%",
                align: "center",
                halign: "center"
            }],
            filter: true,
            pagination: true,
            sidePagination: "server",
            pageSize: "10",
            showToggle: false,
            sortName: "area",
            sortOrder: "desc"
        };
    var $table = $('#tableThreshold').bootstrapTable(options);
//    $table.bootstrapTable("setFilterData", "name", ["item 1", "item 2", "item 3"]);
}

//var menu_report_active;
//if($(".report-sidebar-menu").length > 0){
//    var a = $(".report-sidebar-menu > .active").find("#city").text().toLowerCase() + " - " + $(".report-sidebar-menu > .active").find(".active").text().toLowerCase();
//    
//    console.log(a);
//    
//    menu_report_active = (a).replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
//        return $1.toUpperCase();
//    });
//}
//

/*
 * FUNCTION CLICK SIDEBAR REPORT
 * 1. Region
 * 2. Site
 */
$(".report-sidebar-menu > li:eq(0) > a").on("click", function(){
//    $(this).parent().toggleClass("active").siblings().removeClass("active").promise().done(function(){
//        $(this).each(function(){
//            console.log(this); 
//            $(this).find("ul.menu-open").removeClass("menu-open");
//        })
//    });
});

$('.menu-alarm-sidebarcontrol').on("click", function(e){
    
    e.preventDefault();
    
    var btn_click = $(this);
    $(this).addClass("active").promise().done(function(){
//        $(".active", "ul.panel-data").removeClass("active").find("i").removeClass("fa-dot-circle-o").addClass("fa-circle-o");
    });
    
    $("div.content-wrapper").children().remove().promise().done(function(){
        $("div.content-wrapper").load($(btn_click).attr("href"), function(){
    
            var $table = $('#table');

            var data = [
                {
                    "no": 1,
                    "date": "3 August 2017",
                    "time": "18:00",
                    "alarm": "TX A Vision",
                    "value": "5 Kw",
                    "severity": "Critical",
                    "status": "Active"
                },
                {
                    "no": 2,
                    "date": "3 August 2017",
                    "time": "18:15",
                    "alarm": "TX A Vision",
                    "value": "22 Kw",
                    "severity": "Major",
                    "status": "Active"
                },
                {
                    "no": 3,
                    "date": "3 August 2017",
                    "time": "18:25",
                    "alarm": "TX A Vision",
                    "value": "24 Kw",
                    "severity": "Major",
                    "status": "Clear"
                },
                {
                    "no": 4,
                    "date": "3 August 2017",
                    "time": "18:35",
                    "alarm": "TX A Vision",
                    "value": "10 Kw",
                    "severity": "Critical",
                    "status": "Active"
                },
                {
                    "no": 5,
                    "date": "3 August 2017",
                    "time": "18:50",
                    "alarm": "TX A Vision",
                    "value": "18 Kw",
                    "severity": "Major",
                    "status": "Clear"
                },
                {
                    "no": 6,
                    "date": "3 August 2017",
                    "time": "17:00",
                    "alarm": "TX A Vision",
                    "value": "25 Kw",
                    "severity": "Major",
                    "status": "Clear"
                },
                {
                    "no": 7,
                    "date": "3 August 2017",
                    "time": "17:15",
                    "alarm": "TX A Vision",
                    "value": "20 Kw",
                    "severity": "Major",
                    "status": "Active"
                },
                {
                    "no": 8,
                    "date": "3 August 2017",
                    "time": "18:30",
                    "alarm": "TX A Vision",
                    "value": "10 Kw",
                    "severity": "Critical",
                    "status": "Active"
                },
            ];
            $table.bootstrapTable({data: data});

            $table.on('click-row.bs.table', function (e, row, $element) {
        //        console.log(row);
                $('.success').removeClass('success');
                $($element).addClass('success');
            });
        });
    });
});

$(".report-sidebar-menu > li > a").each(function(p,q){ // region
    
    $(this).on("click", function(e){
        
        var m_area_clicked = $(this).text();

        switch(p){
            // untuk nasional
            case 0:
                    var btn_click = $(this);
                    $(this).parent().toggleClass("active").siblings().removeClass("active").promise().done(function(){
                        $(this).each(function(){
                            $(this).find("ul.menu-open").removeClass("menu-open").hide("slow").promise().done(function(){
                                $("aside.control-sidebar, body.sidebar-mini").removeClass("control-sidebar-open").promise().done(function(){
                                    $('.panel-data').children().remove();
                                    $('.panel-alarm').children().remove();
                                });
                            });
                        });
                        
                        $("div.content-wrapper").children().remove().promise().done(function(){
                            $("div.content-wrapper").load($(btn_click).attr("href"), function(){
                            
                            });
                        });
                    });   
                    e.preventDefault();
                break;
            case 1:
                    var btn_click = $(this);
                    $(this).parent().toggleClass("active").siblings().removeClass("active").promise().done(function(){
                        $(this).each(function(){
                            $(this).find("ul.menu-open").removeClass("menu-open").hide("slow").promise().done(function(){
                                $("aside.control-sidebar, body.sidebar-mini").removeClass("control-sidebar-open").promise().done(function(){
                                    $('.panel-data').children().remove();
                                    $('.panel-alarm').children().remove();
                                });
                            });
                        });
                        
                        $("div.content-wrapper").children().remove().promise().done(function(){
                            $("div.content-wrapper").load($(btn_click).attr("href"), function(){
                            
                            });
                        });
                    });   
                    e.preventDefault();
                break;
            case 2:
                    var btn_click = $(this);
                    $(this).parent().toggleClass("active").siblings().removeClass("active").promise().done(function(){
                        $(this).each(function(){
                            $(this).find("ul.menu-open").removeClass("menu-open").hide("slow").promise().done(function(){
                                $("aside.control-sidebar, body.sidebar-mini").removeClass("control-sidebar-open").promise().done(function(){
                                    $('.panel-data').children().remove();
                                    $('.panel-alarm').children().remove();
                                });
                            });
                        });
                        
                        $("div.content-wrapper").children().remove().promise().done(function(){
                            $("div.content-wrapper").load($(btn_click).attr("href"), function(){
                            
                            });
                        });
                    });   
                    e.preventDefault();
                break;
            default:
                
                    var st = $(this).parent(".active").is(":visible");

                    if(st === false){
                        $("aside.control-sidebar, body.sidebar-mini").addClass("control-sidebar-open");

                        var p_data_site = "";

                        $(this).next().children().find("a:eq(0)").each(function(e, x){
                            
                            p_data_site += '<li style="padding-bottom: 4px"><a href="#" onclick="$(\'#site'+ e +'\').trigger(\'click\');" style="color: #444;"><i class="fa fa-circle-o"></i>&nbsp;'+ $(x).text() +'</a></li>';

                            $(x).on("click", function(e){ // sitex ex: jalan panjang
                                
                                var m_site_clicked = $(this).text();
                                var site_status_active = m_area_clicked.toLowerCase() + " - " + m_site_clicked.toLowerCase();

                                var menu_report_active = (site_status_active).replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
                                    return $1.toUpperCase();
                                });
                                
                                var btn_click = $(this);
                                var st_site = $(this).parent(".active").is(":visible");

                                $('.panel-data').children().remove();

                                if(st_site === false){

                                    var p_data_dev  = "";
                                    p_data_dev += '<li style="padding-bottom: 4px"><a href="#" onclick="$(\'.device\').trigger(\'click\');" style="color: #444;"><i class="fa fa-circle-o"></i>&nbsp;All</a></li>';
                                    $(this).next().children().find("a:eq(0)").each(function(e, y){

                                        p_data_dev += '<li style="padding-bottom: 4px"><a href="#" onclick="$(\'.device'+ e +'\').trigger(\'click\');" style="color: #444;"><i class="fa fa-circle-o"></i>&nbsp;'+ $(y).text() +'</a></li>';
                                    });
                                    
                                    $("div.content-wrapper").children().remove().promise().done(function(){
                                        $("div.content-wrapper").load($(btn_click).attr("href"), function(){
                                            
                                            
                                            $('#table').bootstrapTable();
                                            
                                            init_echarts();
                                            init_sparklines();
                                            init_charts();
                                            init_wlightbox();
                                            
                                            // ENGINE AJAX GET DATA
                                            var getDataLastUpdate2 = setInterval(function(){

                                                if($("[data-devid]").length > 0){

                                                    $("[data-devid]").each(function(){

                                                        var d_id        = $(this).data("devid");
                                                        var dev_port    = $(this).data("devport");
                                                        var target      = $(this);

                                                        if(typeof dev_port !== "undefined"){

                                                            dev_port.forEach(function(v, k){

                                                                getData(target, {d_id : d_id, dev_port : '&dev_port=' + v, position : k});

                                                            });

                                                        }else{

                                                            getData(target, {d_id : d_id});
                                                        }             

                                                    });
                                                }

                                            },(10000)); // 1' end setInterval

                                            batteryDetail(menu_report_active);

                                            /** DATA DETAIL REPORT **/
                                            $("button[id='r-detail']").each(function(){

                                                $(this).on("click", function(){
                                                    $(this).parents("li").off("click");
                                                    deviceDetail(this, menu_report_active, getDataLastUpdate2);
                                                })

                                            });
                                            /** END DATA DETAIL REPORT **/

                                            $(".equipment > li").each(function(){

                                                var eq_index = 0;

                                                $(this).on("click", function(e){
                                                    equipment_detail(this,eq_index,getDataLastUpdate2,menu_report_active);
                                                });

                                            });

                                            /**
                                            * CHART 
                                            * on report menu
                                            */

                                           if($("button[data-chart]").length > 0){
                                               $("button[data-chart]").each(function(s, target){

                                                   $(this).on("click", function(){
                                                       $(this).parents("li").off("click");

                                                       var dev_port    = $(this).data("chart");
                                                       reportChart(this, dev_port, getDataLastUpdate2, menu_report_active);
                                                   })
                                               });
                                           }
                                           // END CHART //

                                            $(btn_click).next().children().find("a:eq(0)").each(function(e, z){
                                                
                                                var t = 0;
                                                $(this).on("click", function(){ // device
                                                    
                                                    $('.menu-alarm-sidebarcontrol').removeClass("active");
                                                    $(this).parent().siblings().removeClass("active").end().addClass("active");

                                                    var content_target = $(this).attr("id");
//                                                        console.log(content_target);
                                                    $("div.content-wrapper").find("#"+content_target).show("slow", function(){
                                                        $(this).siblings().hide("slow");
                                                        
                                                        var p_data_dev_det = "";
                                                        p_data_dev_det += '<li style="padding-bottom: 4px"><a href="#" style="color: #444;"><i class="fa fa-circle-o"></i>&nbsp;All</a></li>';
//                                                        $("ul.equipment, ul.products-list, ul.quick-list, ul[class!='']", this).siblings().find(".username").each(function(x, o){
                                                        $(".username",this).each(function(x, o){
                                                            p_data_dev_det += '<li style="padding-bottom: 4px"><a href="#" data-targetid="'+ $(o).text().replace(" ","") +'" style="color: #444;"><i class="fa fa-circle-o"></i>&nbsp;'+ $(o).text() +'</a></li>';
                                                        });

                                                        $(".panel-data").html(p_data_dev_det).find("a").each(function(){
                                                            $(this).on("click", function(){
                                                                    var id = $(this).data("targetid");
//                                                                    console.log($("#"+id).siblings("div"));
//                                                                    console.log($("#"+id).hide("slow"));
                                                                    
//                                                                }
                                                            })
                                                        });
                                                    });

                                                });

                                            });
                                        });
                                    });

                                }else{

                                    p_data_dev = p_data_site;
                                }

                                $(".panel-data").html(p_data_dev).promise().done(function(){
                                    $("li", this).each(function(){
                                        $(this).on("click", function(e){
                                            $(this).parent().find(".active").removeClass("active").find("i").removeClass("fa-dot-circle-o").addClass("fa-circle-o").promise().done(function(){
                                                $(e.target).parent().toggleClass("active");
                                                $("i", e.target).removeClass("fa-circle-o").addClass("fa-dot-circle-o");
                                            });
                                        });
                                    });
                                });

                                e.preventDefault();
                                
                            })

                        });

                        $(".panel-data").html(p_data_site);

                    }else{

                        $("aside.control-sidebar, body.sidebar-mini").removeClass("control-sidebar-open").promise().done(function(){
                            $('.panel-data').children().remove();
                            $('.panel-alarm').children().remove();
                        });
                    }
                break;
        }
    });
})



//$("li:eq(0)", ".equipment").trigger("click");

fn.deviceFreechartClick();

if($("#freechart").length > 0)
    fn.getDataChart("freechart", "bandungsctv01", "1", "PMFWD", "column");    

    

//Initialize Select2 Elements
//$(".select2").select2();
    
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


function batteryDetail(menu_report_active){
    
//                        <i class="fa fa-info-circle"></i> &nbsp; \n\
//                        Battery Detail Information</h4> \n\
                        
    var batteryDetail = '<div class="modal fade" id="battDetail" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> \n\
        <div class="modal-dialog modal-lg" role="document"> \n\
            <div class="modal-content"> \n\
                <div class="modal-header bg-aqua color-palette" style="border:none; padding: 9px;"> \n\
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \n\
                    <h4 class="modal-title" id="myModalLabel"> \n\
                        <i class="fa fa-info-circle"></i> &nbsp; \n\
                        '+ menu_report_active +', <small style="color: white;">Battery Detail Information</small></h4> \n\
                </div> \n\
                <div class="modal-body" style="padding: 0 0px;"></div> \n\
            </div> \n\
        </div> \n\
    </div>';
    
    
    $("button[id='detail-batt']").each(function(){

        $(this).on("click", function(e){
            var devid = $(this).data("deviceid");
            
            $(batteryDetail).modal("show").on("shown.bs.modal", function(){
                
                $(".modal-body", this).load(_this_url_ + "report/batteryDetail/"+devid, function(){
                    
                    var menu_click = $(e.target).parent().find("font").text();
                    var smenu_click = $(e.target).parent().find("small").text();
                    var breadcumb = $("ol.breadcrumb", this);
                    $("li", breadcumb).remove().promise().done(function(){
                        $(breadcumb).append('<li><i class="fa fa-dashboard"></i> '+menu_click+'</li><li>'+smenu_click+'</li>');
                    });
                    
                    var t_battBank = $('#batteryBank', this);
                    var t_battQty = $('#batteryQty', this);
                    var t_totalVolt = $('#totalVolt', this);
                    var t_totalCurrent = $('#totalCurrent', this);
                    var t_bankStatus = $('#bankStatus', this);
                    var t_string1 = $('#string1', this);
                    var $table = $('#tableBattery', this);
                    
                    
                    //** battery detail on first load
                    $.getJSON(_this_url_ + "report/dbattery/" + devid).done(function(output){
                        $table.bootstrapTable({data: output.data});
                        
                        $(".fixed-table-body").slimScroll({
                            size: '4px', 
                            width: '100%',
                            height: $(".fixed-table-body").height() + 'px', 
                            color: '#cddc39', 
                            alwaysVisible: true     
                        });
                        
                        $(t_battBank).val(output.data[0].bank);
                        $(t_battQty).val(output.data.length);
                        $(t_totalVolt).val(output.t_volt.toFixed(2));
                        
                    });
                    
                    //** battery detail on select menu in popup modal
                    $("a[id='menu-batt']", this).each(function(){
                        $(this).on("click", function(e){
                            var n_devid = $(this).data("deviceid");
                            devid = $(this).data("deviceid");
                            $.getJSON(_this_url_ + "report/dbattery/" + n_devid).done(function(output){
                                $table.bootstrapTable('load', output.data);
                                
                                $(t_battBank).val(output.data[0].bank);
                                $(t_battQty).val(output.data.length);
                                $(t_totalVolt).val(output.t_volt.toFixed(2));
                            });
                                var menu_click = $(e.target).parents("li.dropdown").children("a:eq(0)").text();
                                var smenu_click = $(e.target).text();
                                var breadcumb = $(e.target).parents("ul").next();
                                $("li", breadcumb).remove().promise().done(function(){
                                    $(breadcumb).append('<li><i class="fa fa-dashboard"></i> &nbsp;'+menu_click+'</li><li>'+smenu_click+'</li>');
                                })
                        });
                    });
                    var col_clicked = null;
                    var last_clicked = null;
                    $table.on('click-row.bs.table', function (e, row, $element) {
                        $("#btn-showhide").html('Hide');
                        $('.success').removeClass('success');
                        $($element).addClass('success');
                        
                        $.getJSON(_this_url_ + "report/dcell/"+ devid + "/" + row.cell).done(function(output){
                            
                            var chart_title = "Bank: "+row.bank+" | String: "+ row.string + " | Cell: "+ row.cell;
                            var series = [{
                                            name: 'Voltage (V)',
                                            data: $.parseJSON(output.dvolt)
                                        }, {
                                            name: 'Temperature ('+ String.fromCharCode(8451) +')',
                                            data: $.parseJSON(output.dtemp)
                                        }, {
                                            name: 'Resistance (m'+ String.fromCharCode(8486) +')',
                                            data: $.parseJSON(output.dresist)
                                        }];
                            chart_cell_detail(series, output.dtime, chart_title);
                        });
                        col_clicked = row;
                        last_clicked = $(this);
                    });
                    
                    $("button", ".box-body > .btn-group").each(function(){
                        $(this).on("click", function(){
                            $("#btn-showhide").html('Hide');
                            var category = $(this).data("category");
                            var title = $(this).data("title");
                            if(category === "all"){
                                $(last_clicked).trigger("click");
                            }else{
                                var title = $(this).data("title");
                                $.getJSON(_this_url_ + "report/dstring/"+ devid + "/" + category).done(function(output){
                                    var chart_title = title +" | Bank: "+col_clicked.bank+" | String: "+ col_clicked.string;
                                    chart_cell_detail(output.data, output.time, chart_title);
                                });
                            }
                        })
                    });
                    
                    // the button action
                    $button = $('#btn-showhide');
                    $button.click(function() {
                        var series = cellChart.series[0];
                        if (series.visible) {
                            $(cellChart.series).each(function(){
                                //this.hide();
                                this.setVisible(false, false);
                            });
                            cellChart.redraw();
                            $button.html('Show');
                        } else {
                            $(cellChart.series).each(function(){
                                //this.show();
                                this.setVisible(true, false);
                            });
                            cellChart.redraw();
                            $button.html('Hide');
                        }
                    });
                    
                }).end().on("hidden.bs.modal", function(){
                    $(this).remove();
                })
                
            });
        });

    });
}

function chart_cell_detail(d_series, d_time, d_title){
var example = 'spline-plot-bands', theme = 'dark-unica';
var date_start_point = parse_date(d_time);

$(".box-body > .btn-group").show();
$("#btn-showhide").show();

cellChart = new Highcharts.chart("cell-chart", {
    exporting: {
        enabled: false
    },
    chart: {
        height: 350,
        type: 'spline'
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

    


}

function equipment_detail(target_p, eq_idx, getDataLastUpdate2, menu_report_active){
            
            var icon = $(target_p).parents(".row").eq(0).find("i:eq(0)").attr("class").split(" ")[1];
            var title_detail = $(".title", target_p).find("font").text();
            var d_id = $(target_p).data("devid");
            var device_id;
            var eq_index  = 0;
            
            if($(target_p).parents(".row").eq(eq_index).find(".equipment-detail").find("[data-devid='" + d_id + "']").length < 1){
                
                $.ajax({
                    type: "post",
                    url: _this_url_ + "report/detail",
                    data: 'dev_id=' + d_id + '&' + _csrf_name_ + '=' + _csrf_token_,
                    dataType: "json",
                    cache: false,
                    success: function(output){

                    var html_d_equipment = '<div style="display:none;" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 equipment-detail"> \n\
                                            <div class="user-block"> \n\
                                                <h1 class="pull-left" style="margin: 0;padding-left: 14px;padding-right: 14px;margin-top: 3px;"><i class="fa '+icon+' text-blue"></i></h1> \n\
                                                <span class="username">'+ title_detail +'</span> \n\
                                                <span class="description">Detail Information</span> \n\
                                            </div> \n\
                                            <ul class="products-list product-list-in-box">';
                        output.cur_value.forEach(function(res){
                            
                            res.lmn = parseFloat(res.lmn);
                            res.lmx = parseFloat(res.lmx);
                            res.mmn = parseFloat(res.mmn);
                            res.mmx = parseFloat(res.mmx);
                            
                            if(res.s != null) res.s = res.s; else res.s = '';

//                            if(parseFloat(res.vmn) < 0){
//                            
//                                if(res.lmn !== '' && res.v > res.lmn){
//                                    status = "red";
//                                    note = "<font class='text-red'>&nbsp;"+res.nmn+"</font>";
//                                }else if(res.lmn !== '' && res.mmn !== '' && res.lmn > res.v && res.v > res.mmn){
//                                    status = "yellow";
//                                    note = "<font class='text-yellow'>&nbsp;"+res.nmn+"</font>";
//                                }else if(res.lmx !== '' && res.v > res.lmx){
//                                    status = "red";
//                                    note = "<font class='text-red'>&nbsp;"+res.nmx+"</font>";
//                                }else if(res.lmx !== '' && res.mmx !== '' && res.lmx < res.v && res.v  res.mmx){
//                                    status = "yellow";
//                                    note = "<font class='text-yellow'>&nbsp;"+res.nmx+"</font>";
//                                }else{
//                                    var status = "green";
//                                    var note = "";
//                                }
//                                
//                            }else{
                            
                                if(res.lmn !== '' && res.v < res.lmn){
                                    status = "red";
                                    note = "<font class='text-red'>&nbsp;"+res.nmn+"</font>";
                                }else if(res.lmn !== '' && res.mmn !== '' && res.lmn < res.v && res.v < res.mmn){
                                    status = "yellow";
                                    note = "<font class='text-yellow'>&nbsp;"+res.nmn+"</font>";
                                }else if(res.lmx !== '' && res.v > res.lmx){
                                    status = "red";
                                    note = "<font class='text-red'>&nbsp;"+res.nmx+"</font>";
                                }else if(res.lmx !== '' && res.mmx !== '' && res.lmx > res.v && res.v > res.mmx){
                                    status = "yellow";
                                    note = "<font class='text-yellow'>&nbsp;"+res.nmx+"</font>";
                                }else{
                                    var status = "green";
                                    var note = "";
                                }
//                            }

//                            if(res.v > res.lmx){
//                                status = "red";
//                                note = "<font class='text-red'>&nbsp;"+res.nmx+"</font>";
//                            }else if(res.v < res.lmn){
//                                status = "yellow";
//                                note = "<font class='text-yellow'>&nbsp;"+res.nmn+"</font>";
//                            }else{
//                                status = "green";
//                                note = "";
//                            }

                            device_id = output.d_id;

                            switch(output.d_id){
                                case "1":
                                    if($.inArray(res.a, ["B5","B6","B7"]) === -1){
                                        html_d_equipment += '<li class="item" data-devid="'+ d_id +'" data-devport=\'["'+ res.a +'"]\' style="padding-bottom: 0; padding-top:7px; border-bottom: none;"> \n\
                                            <div class="product-img"> \n\
                                                <span style="font-size: 59px;line-height: 0.85;" class="text-'+status+'">&#124;</span> \n\
                                            </div> \n\
                                            <div class="product-info" style="margin-left: 0;"> \n\
                                                <div class="progress-group"> \n\
                                                    <span class="progress-text title"><font>'+ res.d +'</font></span> \n\
                                                    <span class="progress-number"> \n\
                                                        <button id="r-detail" onclick="deviceDetail($(this), \''+menu_report_active+'\', \''+getDataLastUpdate2+'\')" class="btn btn-xs btn-link" style="margin: 0; font-size: 11px; line-height: normal;"><i class="fa fa-info-circle text-blue"></i></button> \n\
                                                        <button class="btn btn-xs btn-link" onclick="reportChart($(this), \''+res.a+'\', \''+getDataLastUpdate2+'\', \''+menu_report_active+'\')" style="margin: 0; border: 0; line-height: normal;"><i class="fa fa-line-chart text-yellow"></i></button> \n\
                                                    </span> \n\
                                                    <div class="progress" style="margin-bottom: 0; background-color: #d0d0d0;"> \n\
                                                        <div class="progress-bar progress-bar-'+status+' text-right" role="progressbar" data-satuan="'+res.s+'" data-limitmin="'+res.lmn+'" data-nmin="'+res.nmn+'" data-nmax="'+res.nmx+'" data-limitmax="'+res.lmx+'" data-majormin="'+res.mmn+'" data-majormax="'+res.mmx+'" aria-valuenow="'+ res.v +'" aria-valuemin="'+res.vmn+'" aria-valuemax="'+res.vmx+'" style="min-width: 0; text-align: right; width: '+ ((res.v / res.vmx) * 100) +'%">'+ res.v +'</div> \n\
                                                    </div> \n\
                                                    <span class="progress-text min-vol" style="font-size: 12px;">'+res.vmn+'</span> \n\
                                                    <span class="progress-number max-vol" style="font-size: 12px;">'+res.vmx+res.s+'</span> \n\
                                                </div> \n\
                                            </div> \n\
                                        </li>';
                                    }

                                    break;
                                default:

                                    html_d_equipment += '<li class="item" data-devid="'+ d_id +'" data-devport=\'["'+ res.a +'"]\' style="padding-bottom: 0; padding-top:7px; border-bottom: none;"> \n\
                                        <div class="product-img"> \n\
                                            <span style="font-size: 59px;line-height: 0.85;" class="text-'+status+'">&#124;</span> \n\
                                        </div> \n\
                                        <div class="product-info" style="margin-left: 0;"> \n\
                                            <div class="progress-group"> \n\
                                                <span class="progress-text title"><font>'+ res.d +'</font></span> \n\
                                                <span class="progress-number"> \n\
                                                    <button id="r-detail" onclick="deviceDetail($(this), \''+menu_report_active+'\', \''+getDataLastUpdate2+'\')" class="btn btn-xs btn-link" style="margin: 0; font-size: 11px; line-height: normal;"><i class="fa fa-info-circle text-blue"></i></button> \n\
                                                    <button class="btn btn-xs btn-link" onclick="reportChart($(this), \''+res.a+'\', \''+getDataLastUpdate2+'\', \''+menu_report_active+'\')" style="margin: 0; border: 0; line-height: normal;"><i class="fa fa-line-chart text-yellow"></i></button> \n\
                                                </span> \n\
                                                <div class="progress" style="margin-bottom: 0; background-color: #d0d0d0;"> \n\
                                                    <div class="progress-bar progress-bar-'+status+' text-right" role="progressbar" data-satuan="'+res.s+'" data-limitmin="'+res.lmn+'" data-nmin="'+res.nmn+'" data-nmax="'+res.nmx+'" data-limitmax="'+res.lmx+'" data-majormin="'+res.mmn+'" data-majormax="'+res.mmx+'" aria-valuenow="'+ res.v +'" aria-valuemin="'+res.vmn+'" aria-valuemax="'+res.vmx+'" style="min-width: 0; text-align: right; width: '+ ((res.v / res.vmx) * 100) +'%">'+ res.v +'</div> \n\
                                                </div> \n\
                                                <span class="progress-text min-vol" style="font-size: 12px;">'+res.vmn+'</span> \n\
                                                <span class="progress-number max-vol" style="font-size: 12px;">'+res.vmx+res.s+'</span> \n\
                                            </div> \n\
                                        </div> \n\
                                    </li>';
                                    break;
                            }

                        });

                        html_d_equipment += '</ul></div>';

                        switch(device_id){
                            case "1":
//                                eq_index = 1;
                                eq_index = 0;
                                break;
                            case "2":
//                                eq_index = 1;
                                eq_index = 0;
                                break;
                            default:
                                eq_index = 0;
                                break;
                        }
                        
                        
                        if($(target_p).parents(".row").eq(eq_index).find(".equipment-detail").length > 0){
                            $(target_p).parents(".row").eq(eq_index).find(".equipment-detail").hide("fade", function(){
                                $(target_p).parents("ul").find("li.active").removeClass("active");
                                $(target_p).parents(".row").eq(eq_index).find(".equipment-detail").remove();
                                $(html_d_equipment).appendTo($(target_p).parents(".row").eq(eq_index)).show("fade", function(){
                                    $(target_p).parents("li").addClass("active");
                                });
                            });
                        }else{
                            $(html_d_equipment).appendTo($(target_p).parents(".row").eq(eq_index)).show("fade", function(){
                                $(target_p).parents("li").addClass("active");
                            });
                        }


                       _csrf_token_ = output.t_csrf;
                    }
                }); // end ajax
            
            }else{
                
                $(target_p).parents(".row").eq(eq_index).find(".equipment-detail").hide("fade", function(){
                    $(target_p).parents("ul").find("li.active").removeClass("active");
                    $(target_p).parents(".row").eq(eq_index).find(".equipment-detail").remove();
                });
            }    
}

function getData(target, option){
    
    var d_id = option.d_id;
    var dev_port, position;
    if(typeof option.dev_port != "undefined") dev_port = option.dev_port; else dev_port="";
    if(typeof option.position != "undefined") position = parseInt(option.position); else position=0;
    
    $.ajax({
        type: "post",
        url: _this_url_ + "report/getData",
        data: 'dev_id=' + d_id + dev_port + '&' + _csrf_name_ + '=' + _csrf_token_,
        dataType: "json",
        cache: false,
        success: function(output){

            if(output.data !== null){

                switch(output.d_id){
                    // dehidrator & door
                    case "6":

                        var real_vol    = parseInt(output.data[output.dev_port]);

                        var nmax        = $(target).data("nmax");
                        var nmin        = $(target).data("nmin");
                        var limitmin    = parseInt($(target).data("limitmin"));
                        var limitmax    = parseInt($(target).data("limitmax"));
                        var majormin    = $(target).data("majormin");
                        var majormax    = $(target).data("majormax");
                        
                        
//                        if($.inArray(output.dev_port, ["DE","DF","DG","DH"]) === -1){
//                            
//                            // untuk dehidrator
//                            if(real_vol > limitmin){ // jika 1
//                                $("span", target).removeClass('label-danger label-success').addClass('label-success');
//                                $("span", target).text(nmin);
//                            }else if(real_vol < limitmax){ // jika 0
//                                $("span", target).removeClass('label-danger label-success').addClass('label-danger');
//                                $("span", target).text(nmax);
//                            }else{
//                                $("span", target).removeClass('label-danger label-success').addClass('label-success');
//                                $("span", target).text(nmin);
//                            }
//                        }else{
//                            
                            // untuk door sensor
                            if(real_vol > limitmin){
                                $("span", target).removeClass('label-danger label-success').addClass('label-danger');
                                $("span", target).text(nmax);
                            }else if(real_vol < limitmax){
                                $("span", target).removeClass('label-danger label-success').addClass('label-success');
                                $("span", target).text(nmin);
                            }else{
                                $("span", target).removeClass('label-danger label-success').addClass('label-success');
                                $("span", target).text(nmin);
                            }
//                        }
                        

                        if($("#chartSite").is(":visible") !== false){
                            if($("#chartSite").data("did") == output.dev_id){
                                var date = parse_date(output.data.T);

//                                chart.series[0].addPoint(eval([date.getTime(), parseInt(output.data[output.dev_port])]), true, true);
                            }
                        }
                        
                        break;
                    case "7":

                        //fuelsensor
                        var max_vol     = parseFloat(output.data.F3.replace(",","."));
                        var real_vol    = parseFloat(output.data.F2.replace(",","."));

                        var per = (parseFloat(real_vol) / max_vol) * 100;

                        $(".progress-bar:eq("+position+")", target).text(real_vol + String.fromCharCode(160));
                        $(".progress-bar:eq("+position+")", target).attr({"aria-valuenow": real_vol});
                        $(".progress-bar:eq("+position+")", target).attr({"aria-valuemax": max_vol});
                        $(".progress-bar:eq("+position+")", target).css({width: per + "%"});
                        $(".min-vol:eq("+position+")", target).text("0");
                        $(".max-vol:eq("+position+")", target).text( max_vol + "kL");

                        var nmax        = $(".progress-bar:eq("+position+")", target).data("nmax");
                        var nmin        = $(".progress-bar:eq("+position+")", target).data("nmin");
                        var limitmin    = parseFloat($(".progress-bar:eq("+position+")", target).data("limitmin"));
                        var limitmax    = parseFloat($(".progress-bar:eq("+position+")", target).data("limitmax"));
                        var majormin    = parseFloat($(".progress-bar:eq("+position+")", target).data("majormin"));
                        var majormax    = parseFloat($(".progress-bar:eq("+position+")", target).data("majormax"));
                        
                        
                        
                        if(!isNaN(limitmin) && real_vol < limitmin){
                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-green progress-bar-yellow').addClass('progress-bar-red');
                            $('.product-img > span', target).removeClass("text-green text-yellow").addClass('text-red');
                            $(".min-vol:eq("+position+")", target).append("<font class='text-red'>&nbsp;"+ nmin +"</font>");
                        }else if(!isNaN(limitmin) && !isNaN(majormin) && limitmin < real_vol && real_vol < majormin){
                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-green progress-bar-red').addClass('progress-bar-yellow');
                            $('.product-img > span', target).removeClass("text-green text-red").addClass('text-yellow');
                            $(".min-vol:eq("+position+")", target).append("<font class='text-yellow'>&nbsp;"+ nmin +"</font>");
                        }else if(!isNaN(limitmax) && real_vol > limitmax){
                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-green progress-bar-yellow').addClass('progress-bar-red');
                            $('.product-img > span', target).removeClass("text-green text-yellow").addClass('text-red');
                            $(".min-vol:eq("+position+")", target).append("<font class='text-red'>&nbsp;"+ nmax +"</font>");
                        }else if(!isNaN(limitmax) && !isNaN(majormax) && limitmax > real_vol && real_vol > majormax){
                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-green progress-bar-red').addClass('progress-bar-yellow');
                            $('.product-img > span', target).removeClass("text-green text-red").addClass('text-yellow');
                            $(".min-vol:eq("+position+")", target).append("<font class='text-yellow'>&nbsp;"+ nmax +"</font>");
                        }else{
                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-red progress-bar-yellow').addClass('progress-bar-green');
                            $('.product-img > span', target).removeClass("text-yellow text-red").addClass('text-green');
                            $(".min-vol:eq("+position+") > font", target).remove();
                        }

//                        if(real_vol > limitmax){
//                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-green progress-bar-yellow').addClass('progress-bar-red');
//                            $('.product-img > span', target).removeClass("text-green text-yellow").addClass('text-red');
//                            $(".min-vol:eq("+position+")", target).append("<font class='text-red'>&nbsp;"+ nmax +"</font>");
//                        }else if(real_vol < limitmin){
//                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-green progress-bar-red').addClass('progress-bar-yellow');
//                            $('.product-img > span', target).removeClass("text-green text-red").addClass('text-yellow');
//                            $(".min-vol:eq("+position+")", target).append("<font class='text-yellow'>&nbsp;"+ nmin +"</font>");
//                        }else{
//                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-red progress-bar-yellow').addClass('progress-bar-green');
//                            $('.product-img > span', target).removeClass("text-yellow text-red").addClass('text-green');
//                            $(".min-vol:eq("+position+") > font", target).remove();
//                        }

                        if($("#chartSite").is(":visible") !== false){
                            if($("#chartSite").data("did") == output.dev_id){
                                var date = parse_date(output.data.T);

//                                chart.series[0].addPoint(eval([date.getTime(), parseFloat(output.data.F2.replace(",","."))]), true, true);
                            }
                        }
                        break;
                    default:

                        var n           = output.data[output.dev_port];
                        var max_vol     = $(".progress-bar:eq("+position+")", target).attr("aria-valuemax");
                        var real_vol    = parseFloat(n.replace(",","."));

                        var per = (parseFloat(real_vol) / max_vol) * 100;

                        $(".progress-bar:eq("+position+")", target).text(real_vol + String.fromCharCode(160));
                        $(".progress-bar:eq("+position+")", target).attr({"aria-valuenow": real_vol});
                        $(".progress-bar:eq("+position+")", target).css({width: per + "%"});

                        var nmax        = $(".progress-bar:eq("+position+")", target).data("nmax");
                        var nmin        = $(".progress-bar:eq("+position+")", target).data("nmin");
                        var limitmin    = parseFloat($(".progress-bar:eq("+position+")", target).data("limitmin"));
                        var limitmax    = parseFloat($(".progress-bar:eq("+position+")", target).data("limitmax"));
                        var majormin    = parseFloat($(".progress-bar:eq("+position+")", target).data("majormin"));
                        var majormax    = parseFloat($(".progress-bar:eq("+position+")", target).data("majormax"));
                        
                        if(!isNaN(limitmin) && real_vol < limitmin){
                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-green progress-bar-yellow').addClass('progress-bar-red');
                            $('.product-img > span', target).removeClass("text-green text-yellow").addClass('text-red');
                            $(".min-vol:eq("+position+") > font", target).remove();
                            $(".min-vol:eq("+position+")", target).append("<font class='text-red'>&nbsp;"+ nmin +"</font>");
                        }else if(!isNaN(limitmin) && !isNaN(majormin) && limitmin < real_vol && real_vol < majormin){
                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-green progress-bar-red').addClass('progress-bar-yellow');
                            $('.product-img > span', target).removeClass("text-green text-red").addClass('text-yellow');
                            $(".min-vol:eq("+position+") > font", target).remove();
                            $(".min-vol:eq("+position+")", target).append("<font class='text-yellow'>&nbsp;"+ nmin +"</font>");
                        }else if(!isNaN(limitmax) && real_vol > limitmax){
                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-green progress-bar-yellow').addClass('progress-bar-red');
                            $('.product-img > span', target).removeClass("text-green text-yellow").addClass('text-red');
                            $(".min-vol:eq("+position+") > font", target).remove();
                            $(".min-vol:eq("+position+")", target).append("<font class='text-red'>&nbsp;"+ nmax +"</font>");
                        }else if(!isNaN(limitmax) && !isNaN(majormax) && limitmax > real_vol && real_vol > majormax){
                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-green progress-bar-red').addClass('progress-bar-yellow');
                            $('.product-img > span', target).removeClass("text-green text-red").addClass('text-yellow');
                            $(".min-vol:eq("+position+") > font", target).remove();
                            $(".min-vol:eq("+position+")", target).append("<font class='text-yellow'>&nbsp;"+ nmax +"</font>");
                        }else{
                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-red progress-bar-yellow').addClass('progress-bar-green');
                            $('.product-img > span', target).removeClass('text-red text-yellow').addClass('text-green');
                            $(".min-vol:eq("+position+") > font", target).remove();
                        }
                        
                        
//                        if(real_vol > limitmax){
//                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-green progress-bar-yellow').addClass('progress-bar-red');
//                            $('.product-img > span', target).removeClass("text-green text-yellow").addClass('text-red');
//                            $(".min-vol:eq("+position+") > font", target).remove();
//                            $(".min-vol:eq("+position+")", target).append("<font class='text-red'>&nbsp;"+ nmax +"</font>");
//                        }else if(real_vol < limitmin){
//                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-green progress-bar-red').addClass('progress-bar-yellow');
//                            $('.product-img > span', target).removeClass("text-green text-red").addClass('text-yellow');
//                            $(".min-vol:eq("+position+") > font", target).remove();
//                            $(".min-vol:eq("+position+")", target).append("<font class='text-yellow'>&nbsp;"+ nmin +"</font>");
//                        }else{
//                            $(".progress-bar:eq("+position+")", target).removeClass('progress-bar-red progress-bar-yellow').addClass('progress-bar-green');
//                            $('.product-img > span', target).removeClass('text-red text-yellow').addClass('text-green');
//                            $(".min-vol:eq("+position+") > font", target).remove();
//                        }
                        
//                        if($("#checkbox-total", target).length > 0){
//                            var t_value = 0;
//                            $("input[id='checkbox-total']", target).each(function(){
//                                if($(this).is(":checked") === true){
//                                    var c_value = $(".progress-bar:eq(0)", target).text();
//                                    t_value += parseFloat(c_value);
////                                }else{
////                                    var c_value = $(".progress-bar:eq(0)", target).text();
////                                    t_value -= parseFloat(c_value);
//                                }
//
//                                $(target).parents(".products-list").find("li:last-child").find(".progress-bar").html(parseFloat(t_value).toFixed(2) + "&nbsp;");
//                                $(target).parents(".products-list").find("li:last-child").find(".progress-bar").css({width: parseFloat(t_value).toFixed(2)+"%"});
//                            })
//                        }
                        

                        if($("#chartSite").is(":visible") !== false){
                            if($("#chartSite").data("did") == output.dev_id){
                                var date = parse_date(output.data.T);

//                                chart.series[0].addPoint(eval([date.getTime(), parseFloat(output.data[output.dev_port].replace(",","."))]), true, true);
                            }
                        }


                }


            } // endif output.data

            _csrf_token_ = output.t_csrf;

        }

    }); // end ajax
}

function deviceDetail(target, menu_report_active, getDataLastUpdate2){
    
    var equipment_details = '<div class="modal fade" id="equipment-detail" role="dialog" tabindex="-1" aria-labelledby="myModal"> \n\
        <div class="modal-dialog" style="width: 700px;"> \n\
            <div class="modal-content"> \n\
                <div class="modal-header bg-aqua color-palette" style="padding: 10px;"> \n\
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button> \n\
                    <h4 class="modal-title"></h4> \n\
                </div> \n\
                <div class="modal-body no-padding"> \n\
                </div> \n\
            </div> \n\
        </div> \n\
    </div>';
    
    var d_id = $(target).parents("li").data("devid");
    var title = $(target).parents("li").find(".title > font").text();
    
    $.ajax({
        type: "post",
        url: _this_url_ + "report/info",
        data: 'dev_id=' + d_id + '&' + _csrf_name_ + '=' + _csrf_token_,
        dataType: "json",
        cache: false,
        success: function(output){

            $(equipment_details).modal("show").on("shown.bs.modal", function(){

                $(".modal-title", this).text(title + ", " + menu_report_active);     


                    var cont_html = '<table class="table device-info" style="font-size: 12px;"><tr> \n\
                        <td width="30%" align="left"><strong>IP Address</strong></td> \n\
                        <td width="30%">' + output.d_profile.ip_address + '</td> \n\
                        <td rowspan="7" width="40%"><img class="img-responsive" src="'+_this_url_+'public/image/'+ output.d_profile.img +'" /></td> \n\
                    </tr>\n\
                    <tr> \n\
                        <td width="30%" align="left"><strong>MAC Address</strong></td> \n\
                        <td width="30%">' + output.d_profile.mac_address + '</td> \n\
                    </tr>\n\
                    <tr> \n\
                        <td width="30%" align="left"><strong>Converter ID</strong></td> \n\
                        <td width="30%">' + output.d_profile.info_detail.converter_id + '</td> \n\
                    </tr>\n\
                    <tr> \n\
                        <td width="30%" align="left"><strong>Equipment Name</strong></td> \n\
                        <td width="30%">' + output.d_profile.info_detail.equipment + '</td> \n\
                    </tr>\n\
                    <tr> \n\
                        <td width="30%" align="left"><strong>Brand</strong></td> \n\
                        <td width="30%">' + output.d_profile.info_detail.brand + '</td> \n\
                    </tr>\n\
                    <tr> \n\
                        <td width="30%" align="left"><strong>Model No</strong></td> \n\
                        <td width="30%">' + output.d_profile.info_detail.model_no + '</td> \n\
                    </tr>\n\
                    <tr> \n\
                        <td width="30%" align="left"><strong>Serial Number</strong></td> \n\
                        <td width="30%">' + output.d_profile.info_detail.serial_number + '</td> \n\
                    </tr></table>';


                $(cont_html, equipment_details).appendTo($(".modal-body", this));
                
                $(target).parents("li").on("click", function(){
                    equipment_detail(this, 0, getDataLastUpdate2, menu_report_active);
                });

            });

            _csrf_token_ = output.t_csrf;
        }
    })
}

function reportChart(target, dev_port, getDataLastUpdate2, menu_report_active){
    
        var d_id        = $(target).parents("li").data("devid");
        var degree      = String.fromCharCode(176); // symbol degree
        var devicename  = $(target).parents("div.progress-group").find(".title > font").text();
        
        var port;
        if(typeof dev_port != "undefined") port = '&dev_port=' + dev_port; else port = "";
        
        $.ajax({
            type: "post",
            url: _this_url_ + "report/getDataChart",
            data: 'dev_id=' + d_id + port +'&' + _csrf_name_ + '=' + _csrf_token_,
            dataType: "json",
            cache: false,
            success: function(output){
                
                
                var f_c = new Array();
                var option = new Array();
                var get_max_n = [];
                output.data.forEach(function(n, k){
                    if(output.d_id !== "6" && output.d_id !== "7"){
                        var _value = parseFloat(n[dev_port].replace(",","."));
                        get_max_n.push(_value);
                    }else if(output.d_id === "7"){
                        var _value = parseFloat(n.F2.replace(",","."));
                        get_max_n.push(_value);
                    }
                })
                
                output.data.forEach(function(n, k){
                    
                    var nilai;
                    switch(output.d_id){
                        case "6":
                        // dehidrator
                            nilai = parseInt(n[dev_port]);
                            option["ylabel"] = [$(target).parents("li").data("nmin"), $(target).parents("li").data("nmax")];
                            devicename = $(target).parents("li").find("font").text();
                            option["title"] = devicename;
                            break;
                        // fuelsensor
                        case "7":
                            nilai = parseFloat(n.F2.replace(",","."));
                            option["satuan"] = $(target).parents("li").find("[data-satuan]").data("satuan");
                            
                            option["minY"] = Math.min.apply(Math,get_max_n);
                            option["maxY"] = Math.max.apply(Math,get_max_n);
//                            option["minY"] = parseFloat($(target).parents("li").find("[aria-valuemin]").attr("aria-valuemin"));
//                            option["maxY"] = parseFloat($(target).parents("li").find("[aria-valuemax]").attr("aria-valuemax")) + 0.5;
                            option["title"] = devicename;
                            
                            break;
                        default:
                            nilai = parseFloat(n[dev_port].replace(",","."));  
                            option["satuan"] = $(target).parents("li").find("[data-satuan]").data("satuan");
                            
                            // jika electrosys parameter vision (E15)
                            if(dev_port === 'E15'){
                                option["minY"] = 0;
                                option["maxY"] = 100;
                            }else{
                                option["minY"] = Math.min.apply(Math,get_max_n) - 3;
                                option["maxY"] = Math.max.apply(Math,get_max_n) + 0.5;
                            }
//                            option["minY"] = parseFloat(output.minY);
//                            option["maxY"] = parseFloat(output.maxY) + 0.5;
//                            option["minY"] = parseFloat($(target).parents("li").find("[aria-valuemin]").attr("aria-valuemin"));
//                            option["maxY"] = parseFloat($(target).parents("li").find("[aria-valuemax]").attr("aria-valuemax")) + 0.5;
                            option["title"] = devicename;
                            break;
                    }

                    var date = parse_date(n.T);

                    f_c.push([date.getTime(), nilai]);
                });

                $("#chartSite").modal("show").on("hidden.bs.modal", function(){
                    $(target).parents("li").on("click", function(){
                        equipment_detail(this, 0, getDataLastUpdate2, menu_report_active);
                    });
                });
                $("#chartSite").attr({"data-did" : d_id});
                $("#chartSite").find(".modal-title").text(devicename.toUpperCase() + ", " + menu_report_active);
                
                
                chartDevice("container", f_c, getDataLastUpdate2, option);
                
                _csrf_token_ = output.t_csrf;
                
            }
       
        });
        
        
//    });    
}

function parse_date(str){
    
    var year = str.substring(0, 4);
    var month = str.substring(4, 6);
    var day = str.substring(6, 8);
    var hour = str.substring(8, 10);
    var minute = str.substring(10, 12);
    var second = str.substring(12, 14);
    
    return new Date(year, month-1, day, hour, minute, second);
}

function chartDevice(target, dataChart, loadNewData, option){
    
    var satuan, typechart, label_yaxis, minY, minRangeY, maxY, title;
    if(typeof option["typechart"] === "undefined") typechart = "";
    if(typeof option["satuan"] === "undefined") satuan = ""; else satuan = option["satuan"];
    if(typeof option["ylabel"] === "undefined") label_yaxis = false; else label_yaxis = option["ylabel"];
    if(typeof option["minY"] === "undefined") minY = null; else minY = option["minY"];
    if(typeof option["minRangeY"] === "undefined") minRangeY = null; else minRangeY = option["minRangeY"];
    if(typeof option["maxY"] === "undefined") maxY = null; else maxY = option["maxY"];
    if(typeof option["title"] === "undefined") title = null; else title = option["title"];
    
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
            enabled: false
        },
        yAxis: {
            min: minY,
            minRange: minRangeY,
            max: maxY,
            opposite: false,
            labels:{
                formatter: function(){
                    if(label_yaxis != false){
                        return label_yaxis[this.value];
                    }
                    return this.value + satuan;
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
//                month: '%Y-%m',
//                year: '%Y'
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
//                month:"%B %Y",
//                year:"%Y"
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
                        enabled: false
                    }
                }
            }]
        },
        rangeSelector: {
            allButtonsEnabled: true,
//            enabled : true,
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
//            },{
//                type : 'month',
//                count: 1,
//                text : 'Month'
//            },{
//                type : 'year',
//                count: 1,
//                text : 'Year'
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
            selected: 1
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

function initMap(){

    if($("#map").length > 0)
        document.getElementById("map").style.height = $(window).height() + "px";
    
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
                '<h3 class="profile-username text-center">INDOSIAR</h3>' +
                '<p class="text-muted text-center">Jl. Panjang, Jakarta</p>' +
                '<ul class="list-group list-group-unbordered">' +
                '<li class="list-group-item"><b>IP</b> <a class="pull-right">0.0.0.0</a></li>' +
                '<li class="list-group-item"><b>Device Number</b> <a class="pull-right"></a></li>' +
                '<li class="list-group-item"><b>LatLng</b> <a class="pull-right">106.7647011, -6.1970979</a></li>' +
                '</ul>' +
              '</div>' +
              '<!-- /.tab-pane -->' +
              '<div class="tab-pane fade in active" id="valuenow">' +
                '<table class="table">' +
                '<tbody><tr>' +
                  '<th></th>' +
                  '<th align="center"><center>Transmitter 1</center></th>' +
                  '<th align="center"><center>Transmitter 2</center></th>' +
                '</tr>' +
                '<tr>' +
                  '<td>Power</td>' +
                  '<td align="center"><span class="badge bg-blue">10.70 kW</span></td>' +
                  '<td align="center"><span class="badge bg-blue">11.78 kW</span></td>' +
                '</tr>' +
                '<tr>' +
                  '<td>Reflected</td>' +
                  '<td align="center"><span class="badge bg-yellow">- W</span></td>' +
                  '<td align="center"><span class="badge bg-yellow">- W</span></td>' +
                '</tr>' +
              '</tbody></table>' +
              '</div>' +
              '<!-- /.tab-pane -->' +
              '<div class="tab-pane fade" id="alarm">' +
                '&nbsp;<br/><br/><br/>' +
              '</div>' +
              '<!-- /.tab-pane -->' +
              '<div class="tab-pane fade" id="equipment">' +
                '&nbsp;<br/><br/><br/>' +
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
    
    // Create an array of alphabetical characters used to label the markers.
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    console.log(locations);
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
        {lat: -6.1970979, lng: 106.7647011},
//        {lat: -5.147665, lng: 119.432732},
//        {lat: 5.051701, lng: 97.318123},
//        {lat: -8.086410, lng: 111.713127},
//        {lat: -7.866688, lng: 111.466614},
//        {lat: 3.750531, lng: 98.470528},
//        {lat: -2.133333, lng: 106.116669},
//        {lat: -5.135399, lng: 119.423790},
//        {lat: -6.347891, lng: 106.741158},
//        {lat: -6.574958, lng: 110.670525},
//        {lat: 1.474830, lng: 124.842079},
        
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
    
// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).load(function () {
        NProgress.done();
    });
}

    
    
/** js function for home menu **/
if($('.active', '.navbar-nav').find('a').text() == "Home"){

    $(function(){
        $('.collapse-link').on('click', function() {
            var $BOX_PANEL = $(this).closest('.x_panel'),
                $ICON = $(this).find('i'),
                $BOX_CONTENT = $BOX_PANEL.find('.x_content');

            // fix for some div with hardcoded fix class
            if ($BOX_PANEL.attr('style')) {
                $BOX_CONTENT.slideToggle(200, function(){
                    $BOX_PANEL.removeAttr('style');
                });
            } else {
                $BOX_CONTENT.slideToggle(200); 
                $BOX_PANEL.css('height', 'auto');  
            }

            $ICON.toggleClass('fa-chevron-up fa-chevron-down');
        });

        $('.close-link').click(function () {
            var $BOX_PANEL = $(this).closest('.x_panel');

            $BOX_PANEL.remove();
        });        
        
        $(".sparkline_one").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6, 8, 9, 10, 2], {
          type: 'bar',
          height: '40',
          barWidth: 9,
          colorMap: {
            '7': '#a1a1a1'
          },
          barSpacing: 2,
          barColor: '#00aeff'
        });

        $(".sparkline_two").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6, 8, 9, 7, 5], {
          type: 'line',
          width: '250',
          height: '40',
          lineColor: '#00aeff',
          fillColor: 'rgba(223, 223, 223, 0.57)',
          lineWidth: 2,
          spotColor: '#26B99A',
          minSpotColor: '#26B99A'
        });
        
        $(".sparkline_three").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6, 8, 9, 10, 2], {
          type: 'bar',
          height: '40',
          barWidth: 9,
          colorMap: {
            '7': '#a1a1a1',
            '3': '#a1a1a1',
            '9': '#a1a1a1'
          },
          barSpacing: 2,
          barColor: '#00aeff'
        });

        $(".sparkline_four").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6, 8, 9, 10, 2], {
          type: 'bar',
          height: '40',
          barWidth: 9,
          colorMap: {
            '2': '#a1a1a1',
            '5': '#a1a1a1'
          },
          barSpacing: 2,
          barColor: '#00aeff'
        });

        
        if ($('#graph_bar_group').length ){
			
            Morris.Bar({
                element: 'graph_bar_group',
                data: [
                    {"city": "Bandung", "forward": 0},
                    {"city": "Banjarmasin", "forward": 0},
                    {"city": "Denpasar", "forward": 0},
                    {"city": "Jakarta", "forward": [10.70, 9.00, 7.01]},
                    {"city": "Makasar", "forward": 0},
                    {"city": "Medan", "forward": 0},
                    {"city": "Pacitan", "forward": 0},
                    {"city": "Palembang", "forward": 0},
                    {"city": "Semarang", "forward": 0},
                    {"city": "Situbondo", "forward": 0},
                    {"city": "Solo", "forward": 0},
                    {"city": "Surabaya", "forward": 0},
                    {"city": "Yogyakarta", "forward": 0}
                ],
                xkey: 'city',
                barColors: ['#3498DB', '#677685', '#ACADAC', '#92d28a'],
                ykeys: ['forward'],
                labels: ['Forward'],
                hideHover: 'auto',
                xLabelAngle: 90,
                resize: true,
                postUnits : 'kW'
            });

        }
        
		var chart_doughnut_settings = {
				type: 'doughnut',
				tooltipFillColor: "rgba(51, 51, 51, 0.55)",
				data: {
					labels: [
						"Indosiar",
						"SCTV"
					],
					datasets: [{
						data: [65, 35],
						backgroundColor: [
//							"#BDC3C7",
//							"#9B59B6",
//							"#E74C3C",
							"#26B99A",
							"#3498DB"
						],
						hoverBackgroundColor: [
//							"#CFD4D8",
//							"#B370CF",
//							"#E95E4F",
							"#36CAAB",
							"#49A9EA"
						]
					}]
				},
				options: { 
					legend: false, 
					responsive: false 
				}
			}
		
			$('.canvasEquipment').each(function(){
				
				var chart_element = $(this);
				var chart_doughnut = new Chart( chart_element, chart_doughnut_settings);
				
			});	
		
			$('.mainFuelTank').each(function(){
				
				var chart_element = $(this);
				var chart_doughnut = new Chart( chart_element, chart_doughnut_settings);
				
			});			
		
        
        if ($('#canvas_line4').length ){
				
				var canvas_line_04 = new Chart(document.getElementById("canvas_line4"), {
				  type: 'line',
				  data: {
					labels: ["January", "February", "March", "April", "May", "June", "July"],
					datasets: [{
					  label: "Bird",
//                        label : false,
					  backgroundColor: "rgba(38, 185, 154, 0.31)",
					  borderColor: "rgba(38, 185, 154, 0.7)",
					  pointBorderColor: "rgba(38, 185, 154, 0.7)",
					  pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
					  pointHoverBackgroundColor: "#fff",
					  pointHoverBorderColor: "rgba(220,220,220,1)",
					  pointBorderWidth: 1,
					  data: [25.2, 26.3, 26.8, 27.3, 27.1, 26.8, 27.9]
					},{
					  label: "Transmission",
//                        label : false,
					  backgroundColor: "rgba(3, 88, 106, 0.3)",
					  borderColor: "rgba(3, 88, 106, 0.70)",
					  pointBorderColor: "rgba(3, 88, 106, 0.70)",
					  pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
					  pointHoverBackgroundColor: "#fff",
					  pointHoverBorderColor: "rgba(151,187,205,1)",
					  pointBorderWidth: 1,
					  data: [26.2, 25.3, 26.8, 25.3, 27.1, 27.8, 26.9]
					}]
				  },
				});		
				
			}
        
//				var canvas_line = ;
		
				var canvas_line = new Chart( document.getElementById("mainfueltank"), {
				  type: 'line',
				  data: {
					labels: ["January", "February", "March", "April", "May", "June", "July"],
					datasets: [{
					  backgroundColor: "rgba(38, 185, 154, 0.31)",
					  borderColor: "rgba(38, 185, 154, 0.7)",
					  pointBorderColor: "rgba(38, 185, 154, 0.7)",
					  pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
					  pointHoverBackgroundColor: "#fff",
					  pointHoverBorderColor: "rgba(220,220,220,1)",
					  pointBorderWidth: 1,
					  data: [31, 74, 6, 30, 20, 85, 9]
					}, {
					  backgroundColor: "rgba(3, 88, 106, 0.3)",
					  borderColor: "rgba(3, 88, 106, 0.70)",
					  pointBorderColor: "rgba(3, 88, 106, 0.70)",
					  pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
					  pointHoverBackgroundColor: "#fff",
					  pointHoverBorderColor: "rgba(151,187,205,1)",
					  pointBorderWidth: 1,
					  data: [62, 23, 44, 9, 33, 4, 2]
					}]
				  },
				});
//				$("canvas[id='canvas_line']").each(function(){
//				
//					var chart_element = $(this);
//					console.log(chart_element);
//				
//				});	
//        	if ($('#canvas_line').length ){
//				
//			}
        
        
        
        
        
        
        
        
        
        
        
        
        
    });
         
        
//        //random data
//        var d1 = [
//          [0, 1],
//          [1, 9],
//          [2, 6],
//          [3, 10],
//          [4, 5],
//          [5, 17],
//          [6, 6],
//          [7, 10],
//          [8, 7],
//          [9, 11],
//          [10, 35],
//          [11, 9],
//          [12, 12],
//          [13, 5],
//          [14, 3],
//          [15, 4],
//          [16, 9]
//        ];
//
//        //flot options
//        var options = {
//          series: {
//            curvedLines: {
//              apply: true,
//              active: true,
//              monotonicFit: true
//            }
//          },
//          colors: ["#26B99A"],
//          grid: {
//            borderWidth: {
//              top: 0,
//              right: 0,
//              bottom: 1,
//              left: 1
//            },
//            borderColor: {
//              bottom: "#7F8790",
//              left: "#7F8790"
//            }
//          }
//        };
//        var plot = $.plot($("#placeholder3xx3"), [{
//          label: "Registrations",
//          data: d1,
//          lines: {
//            fillColor: "rgba(150, 202, 89, 0.12)"
//          }, //#96CA59 rgba(150, 202, 89, 0.42)
//          points: {
//            fillColor: "#fff"
//          }
//        }], options);
//        
//        
//        var cb = function(start, end, label) {
//          console.log(start.toISOString(), end.toISOString(), label);
//          $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
//        };
//
//        var optionSet1 = {
//          startDate: moment().subtract(29, 'days'),
//          endDate: moment(),
//          minDate: '01/01/2012',
//          maxDate: '12/31/2015',
//          dateLimit: {
//            days: 60
//          },
//          showDropdowns: true,
//          showWeekNumbers: true,
//          timePicker: false,
//          timePickerIncrement: 1,
//          timePicker12Hour: true,
//          ranges: {
//            'Today': [moment(), moment()],
//            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
//            'This Month': [moment().startOf('month'), moment().endOf('month')],
//            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//          },
//          opens: 'left',
//          buttonClasses: ['btn btn-default'],
//          applyClass: 'btn-small btn-primary',
//          cancelClass: 'btn-small',
//          format: 'MM/DD/YYYY',
//          separator: ' to ',
//          locale: {
//            applyLabel: 'Submit',
//            cancelLabel: 'Clear',
//            fromLabel: 'From',
//            toLabel: 'To',
//            customRangeLabel: 'Custom',
//            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
//            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
//            firstDay: 1
//          }
//        };
//        $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
//        $('#reportrange').daterangepicker(optionSet1, cb);
//        $('#reportrange').on('show.daterangepicker', function() {
//          console.log("show event fired");
//        });
//        $('#reportrange').on('hide.daterangepicker', function() {
//          console.log("hide event fired");
//        });
//        $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
//          console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
//        });
//        $('#reportrange').on('cancel.daterangepicker', function(ev, picker) {
//          console.log("cancel event fired");
//        });
//        $('#options1').click(function() {
//          $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
//        });
//        $('#options2').click(function() {
//          $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
//        });
//        $('#destroy').click(function() {
//          $('#reportrange').data('daterangepicker').remove();
//        });
//        
//        
//        var options = {
//          legend: false,
//          responsive: false
//        };
//
//        new Chart(document.getElementById("canvas1"), {
//          type: 'doughnut',
//          tooltipFillColor: "rgba(51, 51, 51, 0.55)",
//          data: {
//            labels: [
//              "Symbian",
//              "Blackberry",
//              "Other",
//              "Android",
//              "IOS"
//            ],
//            datasets: [{
//              data: [15, 20, 30, 10, 30],
//              backgroundColor: [
//                "#BDC3C7",
//                "#9B59B6",
//                "#E74C3C",
//                "#26B99A",
//                "#3498DB"
//              ],
//              hoverBackgroundColor: [
//                "#CFD4D8",
//                "#B370CF",
//                "#E95E4F",
//                "#36CAAB",
//                "#49A9EA"
//              ]
//            }]
//          },
//          options: options
//        });
//        
//        
//          var opts = {
//            lines: 12,
//            angle: 0,
//            lineWidth: 0.4,
//            pointer: {
//              length: 0.75,
//              strokeWidth: 0.042,
//              color: '#1D212A'
//            },
//            limitMax: 'false',
//            colorStart: '#00aeff',
//            colorStop: '#00aeff',
//            strokeColor: '#F0F3F3',
//            generateGradient: true
//          };
//          var target = document.getElementById('chart_gauge_01');
//          var gauge = new Gauge(target).setOptions(opts);
//
//          gauge.maxValue = 100;
//          gauge.animationSpeed = 32;
//          gauge.set(80);
//          gauge.setTextField(document.getElementById("gauge-text"));
//        
//        
//        
//      });
//    
//    
//    /* data stolen from http://howmanyleft.co.uk/vehicle/jaguar_'e'_type */
//    var day_data = [
//      {"period": "2012-10-01", "licensed": 3407, "sorned": 660},
//      {"period": "2012-09-30", "licensed": 3351, "sorned": 629},
//      {"period": "2012-09-29", "licensed": 3269, "sorned": 618},
//      {"period": "2012-09-20", "licensed": 3246, "sorned": 661},
//      {"period": "2012-09-19", "licensed": 3257, "sorned": 667},
//      {"period": "2012-09-18", "licensed": 3248, "sorned": 627},
//      {"period": "2012-09-17", "licensed": 3171, "sorned": 660},
//      {"period": "2012-09-16", "licensed": 3171, "sorned": 676},
//      {"period": "2012-09-15", "licensed": 3201, "sorned": 656},
//      {"period": "2012-09-10", "licensed": 3215, "sorned": 622}
//    ];
//    Morris.Bar({
//      element: 'graph_bar',
//      data: day_data,
//      xkey: 'period',
//      ykeys: ['licensed', 'sorned'],
//      labels: ['Licensed', 'SORN'],
//      xLabelAngle: 60
//    });
    
    
    
}
//      var target = document.getElementById('foo2'),
//          gauge = new Gauge(target).setOptions(opts);
//
//      gauge.maxValue = 5000;
//      gauge.animationSpeed = 32;
//      gauge.set(4200);
//      gauge.setTextField(document.getElementById("gauge-text2"));


/** end js function for home menu **/
