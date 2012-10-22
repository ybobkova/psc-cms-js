define(['Psc/UI/HTML/Builder','Psc/Test/DoublesManager'], function() {
  
  module("Psc.UI.HTML.Builder");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var builder = new Psc.UI.HTML.Builder({ });
    
    $.extend(test, {builder: builder});
  };

  test("buildStyle for CSS Properties inline", function() {
    setup(this);
    
    var style = this.builder.buildStyle({
      'background-color': 'red',
      color: '#000001',
      width: '100px'
    });
    
    var div = '<div style="'+style+'"></div>';
    
    var $div = $(div);
    assertEquals('rgb(255, 0, 0)', $div.css('background-color'), 'style is '+style);
    assertEquals('rgb(0, 0, 1)', $div.css('color'), style);
    assertEquals('100px', $div.css('width'), style);
  });
});