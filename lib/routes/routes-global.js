// ApplicationController = RouteController.extend({
//   layoutTemplate: 'defaultTemplate',
//   onBeforeAction: function () {
//       // do some login checks or other custom logic
//     if (!Meteor.userId()) {
//         this.render('loginIndex');
//     } else {
//         this.next();
//     }
//   }
// });

Router.configure({
    loadingTemplate: 'loading',
    notFoundTemplate : 'notFound',
    layoutTemplate: 'defaultTemplate'
})
