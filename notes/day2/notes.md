
# Reactive joins

publish composite

# git add -p

interactively view code changes to be added

# Spacebars handles attributes

```handlebars
<template name="templateName">
    {{!-- attributes should be valid HTML attributes  --}}
    <input type="text" {{attributes}} />
</template>
```

```javascript
Templates.templateName.helpers({
    attributes: attributes
});
```

# Cordova plugins

cordova.js is reserved filename when using cordova plugins

# Deploying to Modulus

Specify correct node version with package.json