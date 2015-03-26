

# helpful packages

dburles:collection-helpers
matb33:collection-hooks
momentjs:moment

# Security bugs

Mitigated with collection hooks

    check if doc.userId === userId when inserting or doing other document manipulation


# Collection Hooks

Use before/after? insert/update/remove? methods for collection hooks

```javascript

CollectionName.before.insert(function (userId, doc) {

    // manipulate document here before inserting
    doc.field = value;
    doc.createdAt = new Date();
    doc.userId = userId;

});
```

# Collection Helpers

https://github.com/dburles/meteor-collection-helpers

```js
CollectionName.helpers({

    // reactive
    user: function () {
        return Meteor.users.findOne({ _id: this.userId });
    },

    // reactive because it's dependency on user
    fullName: function () {
        if (this.user() && this.user().profile)
            return this.user().profile.name;
    }
});
```

# Template form events

```js
Template.tempalteName.events({
    'submit form' : function (event, template) {

        // submit logic

        // template.$('.scoped-to-template') unpack values
        // update collections here
        // reset form?

    }
});
```

# Publish / Subscribe

Be careful to not publish extra data ESPECIALLY USER DATA

```js
// blacklist
Meteor.users.find({ username: username }, { fields: { emails: 0, services: 0 } })

// white list
Meteor.users.find({ username: username }, { fields: { profile: 1 } })
```

# Underscore

Chaining ???
```js
_([1,2,3]).contains(someVal)
_(val).chain()
    .map(func)
```

# Meteor method update

```js
// Adds an id to an array
Users.update(this.userId, { $push: { "profile.followingIds": followId } })
// Removes an id to an array
Users.update(this.userId, { $pull: { "profile.followingIds": followId } })
```

# Client side reactive meteor methods

wait on no meteor methods on the client

https://github.com/stubailo/meteor-reactive-method



# Homework

observeChanges and watch the user for the followingIds and when it changes to figure out what changed

push what was added or removed over the DDP

watch user cursor for changes
use underscore and some math
find those users that were added/removed


this.added
this.removed


# Golden Path

The demoable path is what you priority test