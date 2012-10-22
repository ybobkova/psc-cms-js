define(['psc-tests-assert','Psc/UI/LayoutManager/Image','Psc/UI/ResizableImage','Psc/Test/DoublesManager'], function() {
  
  module("Psc.UI.ResizableImage");
  
  var setup = function () {
    var dm = new Psc.Test.DoublesManager();
    var uploadService = dm.getUploadService();
    
    var $container = $('<div/>');
    $('#visible-fixture').empty().append($container);
    
    var image = new Psc.UI.LayoutManager.Image({
      uploadService: uploadService,
      label: 'Bild',
      url: '/js/fixtures/normalImage.jpg',
      caption: null,
      align: null
    });

    var emptyImage = new Psc.UI.LayoutManager.Image({
      uploadService: uploadService,
      label: 'Bild',
      url: null,
      caption: null,
      align: null
    });
    
    return {image: image, emptyImage: emptyImage, $container: $container, uploadService: uploadService};
  };

  test("html is build with image", function() {
    $.extend(this, setup());
    
    var $widget = this.image.create(), $splitPane, $imageContainer, $img;
    this.$container.append($widget);
    
    this.assertEquals(1, ($splitPane = $widget.find('div.psc-cms-ui-splitpane')).length);
    this.assertEquals(1, ($imageContainer = $splitPane.find('> div.right')).length);
    this.assertEquals(1, ($img = $imageContainer.find('img')).length, 'img can be found');
  });
  
  test("if emtpy url is set a placeholder is used for image", function() {
    $.extend(this, setup());
    
    var $widget = this.emptyImage.create(), $placeHolder;
    
    this.assertEquals(1, ($placeHolder = $widget.find('div.placeholder')).length,'placeholder is constructed');
    
  });
});