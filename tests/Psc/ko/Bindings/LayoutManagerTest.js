define(['psc-tests-assert', 'knockout', 'Psc/Test/DoublesManager', 'Psc/ko/Bindings/LayoutManager'], function(t, ko) {
  
  module("Psc.ko.Bindings.LayoutManager");

  var setup = function (test) {
    var dm = new Psc.Test.DoublesManager();
    var bindings = new Psc.ko.Bindings.LayoutManager({
      knockout: ko,
      uploadService: dm.getUploadService()
    });
    
    return t.setup(test, {bindings: bindings});
  };
  
  test("injects some bindings into layoutManager", function() {
    var that = setup(this);

    that.bindings.activate();

    var bindings = ['singleImage'];
    for (var i = 0; i<bindings.length; i++) {
      this.assertNotUndefined(ko.bindingHandlers[ bindings[i] ], 'binding '+bindings[i]+' is injected');
    }
  });
});