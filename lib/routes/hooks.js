checkUserLoggedIn = function(){
    if(!Meteor.loggingIn() && !Meteor.user()){
        Router.go('/login');
    }else{
        this.next();
    }
}

userAuthenticated = function(){
    if(Meteor.loggingIn() && Meteor.user()){
        Router.go("/");
    }else{
        this.next();
    }
}

/* Run Hooks */
Router.onBeforeAction(checkUserLoggedIn, {
    except: [
        'login',
    ]
})

Router.onBeforeAction(userAuthenticated, {
    only : [
        'login',
    ]
})
