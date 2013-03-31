define(['psc-tests-assert', 'Psc/UI/LayoutManager/Control'], function(t) {
  
  module("Psc.UI.LayoutManager.Control");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var control = new Psc.UI.LayoutManager.Control({
      type: 'Headline',
      label: 'Zwischenüberschrift',
      params: {level: 1}
    });
    
    return t.setup(test, {control: control});
  };
  
  test("returns full fqn", function() {
    var that = setup(this);

    this.assertEquals('Psc.UI.LayoutManager.Headline', that.control.getComponentClass());
  });
});