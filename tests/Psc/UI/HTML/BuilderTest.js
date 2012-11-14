define(['psc-tests-assert','Psc/UI/HTML/Builder','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.HTML.Builder");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var builder = new Psc.UI.HTML.Builder({ });
    
    t.setup(test, {builder: builder});
  };

  test("buildStyle for CSS Properties inline", function() {
    setup(this);
    
    var style = this.builder.buildStyle({
      'font-family': 'Verdana',
      width: '100px'
    });
    
    var div = '<div style="'+style+'"></div>';
    
    var $div = $(div);
    this.assertEquals('Verdana', $div.css('font-family'), style);
    this.assertEquals('100px', $div.css('width'), style);
  });
});