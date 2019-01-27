if(Meteor.isClient){
    Template.alarmSiteIndex.onCreated(function alarmSiteIndexOnCreated(){
        $("body").removeClass("skin-blue sidebar-collapse").addClass("skin-blue sidebar-mini");
    });

    Template.alarmSiteIndex.helpers({
        contentAlarm : function(){
            return Session.get('contentAlarm');
        }
    });
}
