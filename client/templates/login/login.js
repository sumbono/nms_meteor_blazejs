Template.loginIndex.onCreated(function(){
    $(".body").removeClass();
});

Template.loginIndex.onRendered(function(){
    $("#appLogin").validate({
        rules : {
            username : {
                required : true
            },
            password : {
                required : true
            }
        },
        messages:{
            username : {
                required: "Masukan data user yang valid"
            },
            password : {
                required : "Masukkan data password yang valid"
            }
        },
        errorPlacement : function(error, element){
            var _parent = element.parent();
            _parent.addClass("has-error");
            error.addClass("help-block");
            error.insertAfter(_parent).promise().done(function(){
                _parent.css({marginBottom: '5px'});
            });
        },
        submitHandler: function(){
            user = {
                username : $("[name='username']").val(),
                password : $("[name='password']").val()
            }

            // Log the user in,
            Meteor.loginWithPassword(user.username, user.password, function(error){
                if(error){
                    Bert.alert(error.reason, 'danger');
                }else{
                    Bert.alert('Logged in!', 'success');
                    Router.go("dashboardIndex");
                }
                // this.ready();
                // this.next();
            })
        }
    })
})

Template.loginIndex.events({
    'submit form' : function(e){
        e.preventDefault();
    }
})
