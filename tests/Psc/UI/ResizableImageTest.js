define(['psc-tests-assert','Psc/UI/ResizableImage'], function() {
  
  module("Psc.UI.ResizableImage");
  
  var setup = function () {
    var $widget = $('<div class="right" style="width: 50%"/>');
    $('#visible-fixture').empty().append($widget);
    
    var resizableImage = new Psc.UI.ResizableImage({
      src: "/js/fixtures/normalImage.jpg",
      widget: $widget
    });
    
    return {resizableImage: resizableImage, $widget: $widget};
  };

  test("source refreshing", function() {
    expect(0);
    $.extend(this, setup());
    
    var img = this.resizableImage;
  
    setTimeout(function () {
      img.refreshSource('http://cms.comun.laptop.ps-webforge.net/images/a/a07295eea7fc3c00a3b1115a626f316c7714e698.png');
    }, 1100);
    
  });
});