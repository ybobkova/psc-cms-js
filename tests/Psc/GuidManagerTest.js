define(['psc-tests-assert','Psc/GuidManager'], function(t) {
  
  module("Psc.GuidManager");
  
  var setup = function(test) {
    return t.setup(test);
  };

  test("testBlankCreation does not collide", function() {
    var that = setup(this);
    var manager = new Psc.GuidManager({});
    
    var guids = {}, guid;
    for (var i = 0; i<100; i++) {
      guid = manager.create();
      this.assertTrue(guid.length > 0);

      if (guids[guid]) {
        that.fail('guid '+guid+' wurde vorher vom manager erzeugt. Schlüsselkollision!');
      } else {
        guids[guid] = true;
      }
    }
  });
});