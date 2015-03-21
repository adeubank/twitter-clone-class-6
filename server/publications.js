Meteor.publish('myTweets', function() {
  
  // Grab a handle to this publication
  var self = this;

  // save the user cursor in a variable for later use
  userCursor = Users.find({_id: this.userId});

  // start watching changes on the user
  userCursor.observeChanges({
    changed: function (id, fields) {
      console.log("changed", id, fields);

      // check if the followingIds changed
      if (Match.test(fields, Match.ObjectIncluding({ profile: Match.ObjectIncluding({ followingIds: Array }) }))) {

        // a user was followed
        if (fields.profile.followingIds.length) {

          followingIds.push(fields.profile.followingIds[0]);

          // the followed user
          var user = Users.find({ _id: fields.profile.followingIds[0] },{fields: {emails: 0, services: 0}, reactive: false }).fetch()[0];

          // add the user to the users collection
          self.added('users', user._id, user);

          Tweets.find({ userId: fields.profile.followingIds[0] }, { reactive: false }).fetch().forEach(function (tweet) {
            self.added('tweets', tweet._id, tweet);
          });

        // a user was unfollowed
        } else {

          // pick up this user that changed un-reactively
          var changedUser = Users.find({ _id: id }, { reactive: false }).fetch()[0];

          // users follow their own profile
          changedUser.profile.followingIds.push(id);

          // find the followingIds that were removed
          var removedFollowingIds = _(followingIds).difference(changedUser.profile.followingIds);

          _.each(removedFollowingIds, function (userId) {
            self.removed('users', userId);

            // Send that these were removed from the collection
            Tweets.find({ userId: userId }, { reactive: false }).fetch().forEach(function (tweet) {
              self.removed('tweets', tweet._id);
            });
          });

          // update followingIds to not include the user ids that were removed
          followingIds = _(changedUser.profile.followingIds).without(removedFollowingIds);
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
