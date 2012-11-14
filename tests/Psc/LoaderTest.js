/*globals testResult*/
define(['psc-tests-assert','Psc/Loader','text!fixtures/loading.html','jquery'], function(t, loaderClass, html, $) {
  
  module("Psc.Loader");
  
  var setup = function(test) {
    return t.setup(test);
  };
  
  asyncTest("loader with no jobs still returns a promise", function () {
    expect(4);
    var that = setup(this);
    
    var loader = new Psc.Loader();
    
    var promise = loader.finished();
    
    // promises can only be ducktyped
    this.assertNotUndefined(promise.done);
    this.assertNotUndefined(promise.fail);
    this.assertNotUndefined(promise.always);

    promise.done(function (loader, done) {
      that.assertEquals(0, done, 'jobsDone number is 0');
      
      start();
    });
  });

  asyncTest("script tags are all loaded in ANY order (BC change?)", function() {
    var that = setup(this);
    var loader = new Psc.Loader();
    
    window.requireLoad = function (requirements, payload) {
      loader.onRequire(requirements, payload);
    };
    
    // this executes all inline script tags, which require main and then attach to the main.loader
    $('#qunit-fixture').empty().append(html);
      
    /*
     * so this executes all inline-jobs
     * notice: this does NOT call the contents of the script tags
     * the script tags are globalEvaled from jquery, but the script tags do require("main") and in that main.getLoader().onRequire()
     * 
     * the proplem here is, that the inline scripts will return instantly when the require("main") is executed
     * so that the second require for main.getLoader().onRequire gets not executed before we do finished() here
     */
    $.when( loader.finished() ).then(function(loader, jobsDone) {
      that.assertInstanceOf(Psc.Loader, loader, 'resolved argument #1 is a loader');
      that.assertEquals(4, jobsDone, 'all jobs are sent as done from loader');
      that.assertContains('block1', testResult);
      that.assertContains('block2', testResult);
      that.assertContains('block3', testResult);
      that.assertContains('block4', testResult);
      start();
      
    }, function (loader, e) {
      that.fail('queue was rejected');
      start();
    });
    
  });
});