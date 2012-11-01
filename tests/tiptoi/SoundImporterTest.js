define(['psc-tests-assert','tiptoi/SoundImporter','Psc/Test/DoublesManager'], function(t) {
  
  module("tiptoi.SoundImporter");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var soundImporter = new tiptoi.SoundImporter({ });
    
    t.setup(test, {soundImporter: soundImporter});
  };

  test("acceptance", function() {
    setup(this);
  
    // this.soundImporter.doSomething();
  });
});