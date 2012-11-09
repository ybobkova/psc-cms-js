define(['Psc/Loader'], function () {
  var loader = new Psc.Loader();
  
  var main = {
    getLoader: function() {
      return loader;
    }
  };
  
  window.requireLoad = function(requirements, payload) {
    requirements.unshift('js/main'); // this is actually this file
    main.getLoader().onRequire(requirements, payload);
  };
  
  return main;
});
