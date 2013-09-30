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

### solution 3 (building it)

I would like to find a way with no setting the base url to /psc-cms-js/lib/ instead leave is at /js/. This seems to be a style-requirement but it's not: Try to compile one of the above solutions with r.js.. it does not work at all. It cannot handle the local-config and package-config. It cannot handle the rewritten base url and it cannot handle files that are "somewhere" and not in the directory you're compiling.

But there is always a solution. Based on solution 1 my approach of running r.js is "let moutain come to the prophet". So I basically build a pre-build directory tree with all dependencies to other modules out of baseUrl are resolved. I used to use this in building shimney-packages as well (it's called sweepout there).

#### sweepout

I use grunt-contrib-copy and grunt-contrib-clean to get a fast and working quick + dirty solution:

`the gruntfile from the project`
```javascript
    clean: {
      build: ["js-prepared"],
    },

    copy: {
      build: {
        files: [
         {expand: true, cwd: "D:\\www\\psc-cms-js", src: ['lib/**', 'vendor/**', 'templates/**', 'img/**'], dest: 'js-prepared/psc-cms-js'}, 
         {expand: true, cwd: "D:\\www\\psc-cms-js\\node_modules", src: ['shimney-*/**'], dest: 'js-prepared/psc-cms-js/node_modules'},
         
         {expand: true, cwd: "Umsetzung/base/htdocs/js", src: ['**'], dest: 'js-prepared'},
         {expand: false, src: ['build-boot.js'], dest: 'js-prepared/boot.js'},
         {expand: false, src: ['js-prepared/psc-cms-js/lib/config.js'], dest: 'js-prepared/config.js'},
       ]
      }
    },
```

`and the requirejs task` (which is basically just a call to r.js)
```javascript
    requirejs: {
      build: {
        options: {
          // include other modules that are not found with include
          dir: "Umsetzung/base/htdocs/js-built",

          appDir: "js-prepared",
          mainConfigFile: "js-prepared/config.js",
          baseUrl: "psc-cms-js/lib",

          paths: {
            app: "../../"
          },

          removeCombined: true,

          modules: [
            {
              name: "app/boot",
              insertRequire: ["app/boot"] // alternativ in die built schreiben
            }
          ],

          //fileExclusionRegExp: /^\./,

          findNestedDependencies: true,

          optimize: "uglify2",
          skipDirOptimize: true,
          optimizeCss: "none"
        }

```
Actually grunt-contrib-copy is really nice to use. The cwd-option allows you to copy paths relative. `D:\\www\\psc-cms-js` points to the cloned github repository (the original source). After copying the structure is in `js-prepared` and would be fully functional as well. The config from psc-cms-js is copied as main config. The paths are the same, because the base url will be still pointing to the lib directory.

```javascript
/* global requirejs */
requirejs.config({
  baseUrl: '/js-built/psc-cms-js/lib',

  paths: {
    'img-files': '../img',
    app: '/js-built'
  },
  
  urlArgs: "bust=" +  (new Date()).getTime()
});

define(['require', 'app/main'], function(require, main) {

  return require('boot-helper'); // wurde durch main geladen
});

```
because r.js does not strip the requirejs.config calls in the created output file the paths need to be adjusted. I'm compiling the whole build-directory to the js-built directory in htdocs and the other boot config reflects that.  
The alternation of the boot.js is not very nice, but its doeable, because the boot.js is so small itself. What I did not get right in the first place is, why I needed to put `insertRequre['app/boot']` into the r.js config (an alternative way would be to write it in the buid-boot.js). Because I thought data-main would be called an executed, however, it does work this way very good.

Some things i learned:
  - r.js does not like changing the baseUrl after loading, when it combines all scripts. Because sometimes that might leed to unambigous script module IDs (which are resolved wrong)
  - the best is to use no baseUrl or mapping or rewriting for modules at all. Just copy everything in place so that it has a natural structue
  - if you don't copy everything "to the place it belongs to", r.js will not magically uglify your scripts. Because it does a really dumb resolving of modules names, after it has copied everything.
