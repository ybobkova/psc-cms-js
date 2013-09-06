# loading psc-cms-js in other projects

Lets differentiate two scenarios:

  1. You have a build (maybe a shimney) from psc-cms-js which is standalone. This is used in production envrionments and is not our topic, yet.
  2. You are in dev-mode and you want to wire up psc-cms-js in your project to get fast updates and develope fast without building it.

## the dev scenario

one configuration that works is:

Precautions: lets say /psc-cms-js is rewrite to this repo (the root(!))

### solution 1

the contents of the top html:
```html
  <head>
    <script type="text/javascript" src="/psc-cms-js/lib/config.js"></script>
    <script type="text/javascript" src="/js/require.js" data-main="/js/boot.js"></script>
  </head>
```

`/psc-cms-js/lib/config.js`: 
```javascript
var require = {
  paths: {
    jquery: "../vendor/jquery.1.8.3.min",
    knockout: "../vendor/knockout"

    // etc etc (we dont care its blackbox!)
  }
}
```

`boot.js`:
```javascript
/* global requirejs */
requirejs.config({
  baseUrl: '/psc-cms-js/lib',

  paths: {
    app: '/js'
  },
  
  urlArgs: "bust=" +  (new Date()).getTime()
});

define(['require', 'app/main'], function(require, main) {
  return require('boot-helper'); // wurde durch main geladen
});
```

Notice that the baseUrl is before loading of boot.js `/js` (because of the data-main attribute). It's reconfigured to `/psc-cms-js/lib` directly (but maybe relevant for inline-html-page-scripts).
App is rerouted so we use for everything from the project app/ as a prefix. This was for historical reasons because the psc-cms-js is usually much bigger than the project code base.
The baseUrl is pointing to psc-cms-js to load classes with `require(['Psc/UI/Main'])` for example. This would be cooler if we would load it like: `require(['psc-cms-js/Psc/UI/Main'])` which looks a little clumpsy but would be much more cleaner.

Lets call the config in the boot.js the local-config and lets call the `/psc-cms-js/lib/config.js` the package-config.

The drawback is here, that the config from psc-cms is loaded per global. But thats better then the second working solution:

### solution 2

the contents of the top html:
```html
  <head>
    <script type="text/javascript" src="/js/require.js" data-main="/js/boot.js"></script>
  </head>
```

`/psc-cms-js/lib/config.js`: 
```javascript
requirejs.config({
  paths: {
    jquery: "../vendor/jquery.1.8.3.min",
    knockout: "../vendor/knockout"

    // etc etc (we dont care its blackbox!)
  }
});
```

`boot.js`:
```javascript
/* global requirejs */
requirejs.config({
  baseUrl: '/psc-cms-js/lib',

  paths: {
    app: '/js'
  },
  
  urlArgs: "bust=" +  (new Date()).getTime()
});

define(['require', '/psc-cms-js/lib/config.js'], function(require) {

  require(['app/main']);
});
```

Notice that this is not compatible with the solution above. The main point of failure is here the second asynchronous call in the boot.js. You have now opportunity to load the boot-helper here because in the define you cannot make something like:

```javascript
define(['require', '/psc-cms-js/lib/config.js', 'boot-helper'], function(require, config, boothelper) {
  return boothelper;
});
```
this will just make load errors because `boot-helper` is already part of the psc-cms-js suite and is trying to load jquery or something else. The stage from "loading the config first" stops you from returning the boot-helper right here and you cannot make from inline: 
```javascript
<script type="text/javascript">
  require(['boot'], function(boot) {
    require(['jquery']);  
  });
</script>
```
this will break your code RANDOMLY. James Burke wrote in his docs to requirejs: 

> You may also call require.config from your data-main Entry Point, but be aware that the data-main script is loaded asynchronously. Avoid other entry point scripts which wrongly assume that data-main and its require.config will always execute prior to their script loading.

What will work would be something very ugly like:
```javascript
<script type="text/javascript">
  require(['boot'], function() {
    require(['app/main'], function () {
      require(['jquery'], function ($) {
        // finally go ahead
      });  
    });
  });
</script>
```
which are a lot of calls for a really simple thing.  

What I learned from all this: avoid loading inline javascript (which is unfortunately really cool, when your backend is rendering html + ui code).

### solution 3

I would like to find a way to not set the base url to /psc-cms-js/lib/ instead leave is at /js/. This seems to be a style-requirement but its not. Try to compile one of the abouve solutions with r.js.. it does not work at all. It cannot handle the local-config and package-config. It cannot handle the rewritten base url and it cannot handle files that are "somewhere" and not in the directory you're compiling.


