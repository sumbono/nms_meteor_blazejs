import {imageServe} from './api/serveImage';

// marker collection
var Markers = new Meteor.Collection('markers');
Meteor.publish("markers", function () {
  return Markers.find();
});

// Listen to incoming HTTP requests, can only be used on the server
WebApp.connectHandlers.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});


// if (Meteor.isServer) {
// }

imageServe();

Meteor.setTimeout(function () {
  let findUser = Meteor.users.find().fetch();
  _.each(findUser, function(userIni) {
    // console.log(userIni);
    Roles.addUsersToRoles(userIni._id, userIni.profile.roles);
  });
}, 30000);
