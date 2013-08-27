# how to use templates

The main class dealing with hogan/mustache templates is the `Psc.TPL.TemplatesRenderer`. Its really easy to use:

```javascript
var templatesRenderer = new Psc.TPL.TemplatesRenderer();

templatesRenderer.compile('test.hello', "Hello {{world}}!");
templatesRenderer.render('test.hello', { 'world': 'Philipp'}); // Hello Philipp!
```

That's the quick and dirty development approach. Of course you won't compile all templates for your application inline and while runtime. Thats why you can use the grunt hogan plugin to do this:

```javascript
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-hogan');

  grunt.initConfig({
    // ...

    hogan: {
      'amd': {
        binderName : "amd",
        templates : "./resources/templates/**/*.mustache",
        output : "www/js/templates-compiled.js",
        nameFunc: function(fileName) {
          var nodepath = require('path');

          fileName = nodepath.normalize(fileName);
          
          var pathParts = fileName.split(nodepath.sep).slice(['resources', 'templates'].length, -1);
          var namespace = pathParts.length > 0 ? pathParts.join('.')+'.' : '';
        
          var templateName = namespace+nodepath.basename(fileName, nodepath.extname(fileName));
          return templateName;
        }
      }
    }
  }
}
```

this creates an amd loadable module `templates-compiled.js` written in vanilla script with your templates in `www/js/`. All templates are read from `templates/src/` and end with `.mustache`.  
the `nameFunc` option is specified to translate the full path of the filename into a name for the template. The name of the template above was `test.hello`. With this nameFunc all templates will become a relative name from their directories relative to `resources/templates` separated with `.`.

If you want to use the compiled templates in the templatesRenderer of your application do:
```javascript
  define(['templates-compiled'], function (templates) {
    templatesRenderer.extendWith(templates);
  });
```

and you're ready to `render()`.
