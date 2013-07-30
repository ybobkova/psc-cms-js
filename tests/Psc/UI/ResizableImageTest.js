define(['psc-tests-assert','Psc/UI/ResizableImage'], function(t) {
  
  module("Psc.UI.ResizableImage");
  
  var setup = function(test) {
    var $widget = $('<div class="right" style="width: 50%"/>');
    $('#visible-fixture').empty().append($widget);
    
    var resizableImage = new Psc.UI.ResizableImage({
      src: "/js/fixtures/normalImage.jpg",
      widget: $widget
    });
    
    return t.setup(test, {resizableImage: resizableImage, $widget: $widget});
  };

  test("after construct has handles init", function () {
    var that = setup(this);

    this.assertNotUndefined(that.resizableImage.getHandles());

  });

});