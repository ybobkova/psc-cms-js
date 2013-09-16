define(['psc-tests-assert', 'tiptoi/SoundImporterBackend'], function(t) {
  
  module("tiptoi.SoundImporterBackend");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var soundImporterBackend = new tiptoi.SoundImporterBackend({
    });
    
    return t.setup(test, {soundImporterBackend: soundImporterBackend});
  };
  
  test("", function() {
    var that = setup(this);
    this.assertTrue(true, "the test is passed");
  });
});