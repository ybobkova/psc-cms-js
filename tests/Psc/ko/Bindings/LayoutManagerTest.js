define(['psc-tests-assert', 'knockout', 'Psc/Test/DoublesManager', 'Psc/ko/Bindings/LayoutManager'], function(t, ko) {
  
  module("Psc.ko.Bindings.LayoutManager");

  var setup = function (test) {
    var dm = new Psc.Test.DoublesManager();
    var bindings = new Psc.ko.Bindings.LayoutManager({
      container: dm.getContainer(),
      knockout: ko,
      uploadService: dm.getUploadService()
    });
    
    return t.setup(test, {bindings: bindings, bindingNames: ['singleImage', 'navigationSelect']});
  };
  
  test("injects some bindings into layoutManager", function() {
    var that = setup(this);

    that.bindings.activate();

    for (var i = 0; i<this.bindingNames.length; i++) {
      this.assertNotUndefined(ko.bindingHandlers[ this.bindingNames[i] ], 'binding "'+this.bindingNames[i]+'" is injected');
    }
  });
});