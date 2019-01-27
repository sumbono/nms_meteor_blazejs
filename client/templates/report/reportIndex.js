if(Meteor.isClient){
    Template.reportIndex.onCreated(function reportIndexOnCreated(){
        $("body").removeClass("skin-blue sidebar-collapse").addClass("skin-blue sidebar-mini");
    });

    Template.reportIndex.helpers({
        contentReport : function(){
            return Session.get('contentReport');
        }
    });
}
