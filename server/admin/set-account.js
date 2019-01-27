/**
 * Generate set admin accounts
 */

generateTestAccounts = function(){
  // Create an array of user accounts
  var users = [
    { name : 'admin', email : 'admin_nms@nms.scm.co.id', password : 'adminadmin102.', site_id: "fihJ7FSBap8aFkjzF", roles: ['admin'] },
    { name : 'kadiv_scm', email : 'kadiv_scm@nms.scm.co.id', password : 'kadivscm123.', site_id: "fihJ7FSBap8aFkjzF", roles: ['kadiv'] },
    { name : 'kadep_net1', email : 'kadep_net1_nms@nms.scm.co.id', password : 'kadepnet123.', site_id: "5b596c26c6e9371ab5f120a8", roles: ['kadep'] },
    { name : 'kadep_net2', email : 'kadep_net2_nms@nms.scm.co.id', password : 'kadepnet123.', site_id: "5b596c35c6e9371ab5f120a9", roles: ['kadep'] },
    { name : 'guest', email : 'guest_nms@nms.scm.co.id', password : 'guest123456.', site_id: "fihJ7FSBap8aFkjzF", roles: ['guest'] },
    { name : 'installer', email : 'installer_nms@nms.scm.co.id', password : 'installer123.', site_id: "fihJ7FSBap8aFkjzF", roles: ['installer'] },
    { name : 'ms_cudo', email : 'ms_cudo@nms.scm.co.id', password : 'mscudo123.', site_id: "fihJ7FSBap8aFkjzF", roles: ['ms'] },
    { name : 'scm_denpasarivm', email : 'scm@denpasarivm.com', password : 'denpasarivm123', site_id: "5bbb11fd15bcf010d8b5f632", roles: ['kst'] },
    { name : 'scm_denpasarsctv', email : 'scm@denpasarsctv.com', password : 'denpasarsctv123', site_id: "5bbb129215bcf010d8b5f633", roles: ['kst'] },
    { name : 'scm_pacitan', email : 'scm@pacitan.com', password : 'pacitan123', site_id: "5b5994676f97984a0ad8c68b", roles: ['kst'] },
    { name : 'scm_situbondo', email : 'scm@situbondo.com', password : 'situbondo123', site_id: "5b5995336f97984a0ad8c68c", roles: ['kst'] },
    { name : 'scm_surabayaivm', email : 'scm@surabayaivm.com', password : 'surabayaivm123', site_id: "5ba344dd15bcf01387b05171", roles: ['kst'] },
    { name : 'scm_surabayasctv', email : 'scm@surabayasctv.com', password : 'surabayasctv123', site_id: "5ba3450d15bcf01387b05172", roles: ['kst'] },
    { name : 'scm_bandungbackup', email : 'scm@bandungbackup.com', password : 'bandungbackup123', site_id: "5b7a303c06913c74fb028a28", roles: ['kst'] },
    { name : 'scm_bandungmain', email : 'scm@bandungmain.com', password : 'bandungmain123', site_id: "5b59931c6f97984a0ad8c688", roles: ['kst'] },
    { name : 'scm_semarangivm', email : 'scm@semarangivm.com', password : 'semarangivm123', site_id: "5ba32e0815bcf01387b0516c", roles: ['kst'] },
    { name : 'scm_semarangsctv', email : 'scm@semarangsctv.com', password : 'semarangsctv123', site_id: "5ba32e4215bcf01387b0516d", roles: ['kst'] },
    { name : 'scm_yogyakartaivm', email : 'scm@yogyakartaivm.com', password : 'yogyakartaivm', site_id: "5ba3434615bcf01387b0516f", roles: ['kst'] },
    { name : 'scm_yogyakartasctv', email : 'scm@yogyakartasctv.com', password : 'yogyakartasctv123', site_id: "5ba344b115bcf01387b05170", roles: ['kst'] },
    { name : 'scm_bukittinggiivm', email : 'scm@bukittinggiivm.com', password : 'bukittinggiivm123', site_id: "5becf5eb15bcf007c041de52", roles: ['kst'] },
    { name : 'scm_palembangivm', email : 'scm@palembangivm.com', password : 'palembangivm123', site_id: "5c0def31f21d811977e08b73", roles: ['kst'] }
  ];
  
  // loop through array of user accounts
  for(i=0; i<users.length; i++){
    // check if the users already exists in the db
    var userEmail = users[i].email,
        checkUser = Meteor.users.findOne({"emails.address" : userEmail});
    // if an existing user is not found, create the accounts
    if(!checkUser){
      var user = Accounts.createUser({
        username : users[i].name,
        email : userEmail,
        password : users[i].password,
        profile : {
          name : users[i].name,
          site_id: users[i].site_id,
          roles: users[i].roles
        }
      })
    }
  }
  
}