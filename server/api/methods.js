import { Random } from 'meteor/random';

Meteor.methods({
  siteNewPost: function (data) {
    check(data, Match.Any);
    let randomID = Random.hexString(24);
    data._id = new Mongo.ObjectID( randomID );
    site.insert(data);
  },
  siteRemove: function (data) {
    check(data, Match.Any);
    thisId = new Mongo.ObjectID( data );
    site.remove(thisId);
    return `This Site (ID: ${data}) removed!`;
  },
  test: function (data) {
    check(data, Match.Any);
    let randomID = Random.hexString(24);
    return randomID;
  },
  
})