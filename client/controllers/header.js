Template.header.events({
    'click #logout' : function(){
        Meteor.logout(function(error){
            if(error){
                Bert.alert(error.reason, 'danger');
            }
            Session.clear();
            // this.next();
        })
    }
})

Template.header.helpers({
  userName: function(){
    return Meteor.user().profile.name;
  },
  userSiteId: function (){
    return Meteor.user().profile.site_id;  
  },
})