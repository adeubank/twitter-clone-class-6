Meteor.publish('myTweets', function() {
  
  // Grab a handle to this publication
  var self = this;

  // save the user cursor in a variable for later use
  userCursor = Users.find({_id: this.userId});


  // start watching changes on the user id
  userCursor.observeChanges({
    changed: function (id, fields) {
      console.log("changed", id, fields);

      // check if the followingIds changed
      if (Match.test(fields, Match.ObjectIncluding({ profile: Match.ObjectIncluding({ followingIds: Array }) }))) {

        // a user was followed
        if (fields.profile.followingIds.length) {

          followingIds.push(fields.profile.followingIds[0]);

          Tweets.find({ userId: fields.profile.followingIds[0] }, { reactive: false }).fetch().forEach(function (tweet) {
            self.added('tweets', tweet._id, tweet);
          });

        // a user was unfollowed
        } else {

          // pick up this user that changed un-reactively
          var user = Users.find({ _id: id }, { reactive: false }).fetch()[0];

          // users follow their own profile
          user.profile.followingIds.push(id);

          // find the followingIds that were removed
          var removedFollowingIds = _(followingIds).difference(user.profile.followingIds);

          // Send that these were removed from the collection
          Tweets.find({ userId: { $in: removedFollowingIds } }, { reactive: false }).fetch().forEach(function (tweet) {
            self.removed('tweets', tweet._id);
          });

          // update followingIds to not include the user ids that were removed
          followingIds = _(user.profile.followingIds).without(followingIds);
        }
      }
    }
  });

  user = userCursor.fetch()[0];

  followingIds = [];
  followingIds.push(user.profile.followingIds);
  followingIds.push(user._id);
  followingIds = _(followingIds).flatten();



  users = Users.find({_id: {$in: followingIds}}, {fields: {emails: 0, services: 0}});
  tweets = Tweets.find({userId: {$in: followingIds}});
  return [users, tweets];
});

Meteor.publish('profile', function(username) {
  user = Meteor.users.find({username: username}, {fields: {emails: 0, services: 0}});
  return user;
});

Meteor.publish('profileTweets', function(username) {
  user = Meteor.users.findOne({username: username}, {fields: {emails: 0, services: 0}});
  return Tweets.find({userId: user._id});
});
