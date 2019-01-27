PostSubs = new SubsManager();

Router.route("/", function(){
  this.render('dashboardIndex');
  this.render('header', {to: 'top'});
},{
  name : "dashboardIndex",
  loadingTemplate : "loading",
  onBeforeAction : function(){
    Session.set('currentRoute', 'dashboardIndex');
    this.next();
  },
  waitOn : function(){
    return [
      PostSubs.subscribe("featured-scopes"),
      PostSubs.subscribe("featured-regions")
    ];
  },
  fastRender: true
});

Router.route("/report", function(){
    this.render('reportIndex');
    this.render('header', {to: 'top'});
    this.render('sidebar', {to: 'sidebar-menu'});
    this.render('dashboardNasional', {to: 'content'});
    Session.set('contentReport', 'dashboardNasional');
},{
    name : "reportIndex",
    loadingTemplate : "loading",
    namanyajugangetes : function() {
      return 'reportIndex';
    },
    onBeforeAction: function(){
        Session.set('mySite', 'report');
        Session.set('currentRoute', 'reportIndex');
        this.next();
    },
    waitOn : function(){
        return [
            PostSubs.subscribe("featured-scopes"),
            PostSubs.subscribe("featured-regions"),
            // PostSubs.subscribe("featured-deviceCategory"),
            // PostSubs.subscribe("featured-devices"),
            // PostSubs.subscribe("featured-protocols"),
        ];
    },
    data : function(){
        if(Meteor.isClient) {
          sesData = Session.get("siteId");
        }
        // return site.findOne({ _id : new Mongo.ObjectID( Session.get("siteId") )});
        return site.findOne({ _id : new Mongo.ObjectID( sesData )});
    },
    fastRender: true
});

Router.route("/alarmdetail/:_id/dev_id/:dev_id", function(){
    this.render('alarmdetailIndex');
    this.render('header', {to: 'top'});
    this.render('siteIndex', {to: 'content'});
},{
    name : "alarmdetailIndex",
    loadingTemplate : "loading",
    onBeforeAction: function(){
        Session.set('mySite', 'alarm');
        Session.set('currentRoute', 'alarmdetailIndex');
        Session.set("siteId", this.params._id );
        Session.set("deviceId", parseInt(this.params.dev_id) );
        var parameters = this.params.hash;
        var splitParam = parameters.split('-');
        var devNameIni = splitParam[0].split("_").join(" ");
        Session.set("deviceName", devNameIni );
        var paramNameIni = splitParam[1].split("_").join(" ");
        Session.set("parameterName", paramNameIni );
        this.next();
    },
    fastRender: true
});

Router.route("/userManagement", function(){
    this.render('userManagement');
    this.render('header', {to: 'top'});
//     this.render('sidebaralarm', {to: 'sidebar-menu'});
    this.render('userManagement', {to: 'content'});
},{
    name : "userManagement",
    loadingTemplate : "loading",
    onBeforeAction: function(){
        Session.set('mySite', 'usermanagement');
        Session.set('currentRoute', 'userManagement');
        this.next();
    },
    waitOn : function(){
        return [
            PostSubs.subscribe("featured-scopes"),
            PostSubs.subscribe("featured-regions"),
            // PostSubs.subscribe("featured-sites")
        ];
    },
    fastRender: true
});

Router.route("/stationIndex", function(){
    this.render('stationIndex');
    this.render('header', {to: 'top'});
//     this.render('sidebaralarm', {to: 'sidebar-menu'});
    this.render('stationIndex', {to: 'content'});
},{
    name : "stationIndex",
    loadingTemplate : "loading",
    onBeforeAction: function(){
        Session.set('mySite', 'station');
        Session.set('currentRoute', 'stationIndex');
        this.next();
    },
    waitOn : function(){
        return [
            PostSubs.subscribe("featured-scopes"),
            PostSubs.subscribe("featured-regions"),
            // PostSubs.subscribe("featured-sites"),
        ];
    },
//     data : function(){
//         if(Meteor.isClient) {
//           sesData = Session.get("siteId");
//         }
//         return site.findOne({ _id : new Mongo.ObjectID( sesData )});
//     },
    fastRender: true
});

