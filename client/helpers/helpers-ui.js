// /*
// * UI Helpers
// * Define UI helpers for common template functionality.
// */
//
// /*
// * Current Route
// * Return an active class if the currentRoute session variable name
// * (set in the appropriate file in /client/routes/) is equal to the name passed
// * to the helper in the template.
// */
//

Template.registerHelper('currentRouteIs', function(route) {
    // return Session.equals('currentRoute', route) ? 'active' : '';
    var menu = Router.current().route;
    if (typeof(menu) !== 'undefined') {
        return menu.getName() === route;
    }
});

Template.registerHelper('currentRoute', function() {
    var menu = Router.current().route;
    if (typeof(menu) !== 'undefined') {
        return menu.getName();
    }
})

Template.registerHelper('equals', function(a, b) {
    return a === b;
});

Template.registerHelper('notEquals', function(a, b) {
    return a !== b;
});
