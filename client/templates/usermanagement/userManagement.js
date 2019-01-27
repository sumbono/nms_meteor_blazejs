Users = new Mongo.Collection('nms_users');

Template.userManagement.onCreated(function userManagementOnCreated(){
  $("body").removeClass("skin-blue sidebar-collapse").addClass("skin-blue sidebar-mini");
  var _self = this;
  this.autorun(() => {
    this.subscribe("userData");
    this.subscribe("featured-sites");
  });
});
  
Template.userManagement.events({
  'click #btnadduser' : function(e) {
    $('.modaladduser').modal('show')
  },
  'click #btnedit' : function(e) {
    $('.modalusermanagement').modal('show')
  },
  'click #btnpass' : function(e) {
    $('.modaluserpass').modal('show')
  },
  'click #btnread' : function(e) {
    $('.modaluserread').modal('show')
  },
//   "click #site_ini": function (e) {
//     e.preventDefault();
//     var selected = e.target.value;
//     var el = e.currentTarget,
//         scopeUserIni = $(el).data("siteid");
//     // console.log("selected site name: " + selected);
//     console.log("selected site ID: " + scopeUserIni);
//     Session.set("selectedSite", scopeUserIni);
//   },
  'change select': function(e) {
    e.preventDefault();
    var selected = e.target.value;
    var scopeUserIni = $('#site_id option:selected').data("siteid");
    console.log(selected);
    console.log(scopeUserIni);
    Session.set("selectedSite", scopeUserIni);
  },
  'submit form': function(event) {
    event.preventDefault();
    var userName = event.target.username.value,
        emailVar = event.target.email.value,
        passwordVar = event.target.password.value,
        checkUserEmail = Users.find({email : emailVar}).fetch(),
        checkUserName = Users.find({username : userName}).fetch();
    
    // if an existing user is not found, create the accounts
    if(checkUserEmail.length<1){
      if (checkUserName.length<1) {
        var user = Accounts.createUser({
          username : userName,
          email : emailVar,
          password : passwordVar,
          profile : {
            name : userName,
            site_id: Session.get("selectedSite"),
            roles: ["kst"]
          }
        });
        event.target.username.value = "";
        event.target.email.value = "";
        event.target.password.value = "";
        alert("This username added successfull!");
        $('.modaladduser').modal('hide');
        // console.log("This username added successfull!");
        return false;
      } else {
        alert("This username exist!");
        // console.log("This username exist!");
      }
    } else {
      alert("This email address exist!");
      // console.log("This email address exist!");
    }
    return false;
  },
  
});

Template.changePswd.events({
  'submit #pswd_ganti': function(event) {
    event.preventDefault();
    var el = event.currentTarget,
        target = event.target,
        currentPswd = event.target.current_password.value,
        newPswd = event.target.new_password.value,
        newPswdConfirm = event.target.new_password_confirm.value;
        // scopeUserIni = $(target).parents('form').find("#site_ini").data("siteid"),
    
    if ( newPswd !== newPswdConfirm ) {
      // template.find('#form-messages').html("The new passwords don't match!");
      alert("The new passwords don't match!");
      // return false;
    } else {
      Accounts.changePassword(currentPswd, newPswd, function(error) {
        if (error) {
          message = 'There was an issue: ' + error.reason;
          console.log("failed changing password", error);
          alert(message);
        } else {
          message = 'Success changed your password!';
          console.log("success changed password");
          event.target.current_password.value = "";
          event.target.new_password.value = "";
          event.target.new_password_confirm.value = "";
          alert(message);
          $('.modaluserpass').modal('hide');
        }
      });
      return false;
    }
  },
  
});

Template.userManagement.helpers({
  userName: function(){
    return Meteor.user().profile.name;
  },
  userList: function(){
      return Users.find();
  },
  siteList: function(){
    return site.find();
  },
})