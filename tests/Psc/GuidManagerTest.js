use(['Psc.GuidManager'], function() {
  
  module("Psc.GuidManager", {
    setup: function () {
      
    }
  });

  test("testBlankCreation does not collide", function() {
    var manager = new Psc.GuidManager({});
    
    var guids = {}, guid;
    for (var i = 0; i<100; i++) {
      guid = manager.create();
      assertTrue(guid.length > 0);

      if (guids[guid]) {
        fail('guid '+guid+' wurde vorher vom manager erzeugt. Schlüsselkollision!');
      } else {
        guids[guid] = true;
      }
    }
  });
});