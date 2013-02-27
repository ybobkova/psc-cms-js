define(['psc-tests-assert', 'Psc/UI/LayoutManager/Teaser'], function(t) {
  
  module("Psc.UI.LayoutManager.Teaser");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var teaser = new Psc.UI.LayoutManager.Teaser({
      
    });
    
    $('#visible-fixture').empty().append(teaser.create());
    
    return t.setup(test, {teaser: teaser});
  };
  
  test("render html", function() {
    var that = setup(this);
    
    expect(0);
    
  });
});