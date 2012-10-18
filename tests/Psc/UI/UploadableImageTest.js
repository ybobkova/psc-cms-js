use(['Psc.UI.UploadableImage','Psc.Test.DoublesManager','Psc.UI.ResizableImage'], function() {
  
  module("Psc.UI.UploadableImage");
  
  var setup = function () {
    var dm = new Psc.Test.DoublesManager();
    
    var $widget, $widgetEmpty;
    $('#visible-fixture')
      .empty()
      .append($widget = $('<div class="normal"/>'))
      .append($widgetEmpty = $('<div class="empty"/>'));
    
    var uploadService = dm.getUploadService();
    var image = new Psc.UI.UploadableImage({
      uploadService: uploadService,
      url: '/js/fixtures/normalImage.jpg',
      widget: $widget
    });

    var emptyImage = new Psc.UI.UploadableImage({
      uploadService: uploadService,
      url: '',
      widget: $widgetEmpty
    });
    
    return {uploadService: uploadService, image: image, emptyImage: emptyImage};
  };

  test("image with url shows resizable image", function() {
    $.extend(this, setup());
  
    var $html = this.image.unwrap();
    var $img = $html.find('.psc-cms-ui-uploadable-image');
    
    
    assertTrue($img.is('.psc-cms-ui-uploadable-image'));
    
    // noch icht fertig: 
    //assertTrue($img.is('.psc-cms-ui-resizable-image'));
    //resizableImage = Psc.UI.WidgetWrapper.unwrapWidget($img, Psc.UI.ResizableImage);
  });
  
  test("image without url shows placeholder", function () {
    $.extend(this, setup());
    var $html = this.emptyImage.unwrap();
    var $img = $html.find('.psc-cms-ui-uploadable-image');
    
    //assertFalse($img.is('.psc-cms-ui-resizable-image'), 'is not an resizable image');
    assertTrue($img.is('.psc-cms-ui-uploadable-image.placeholder'),'is placeholder');
  });
  
  test("if dbl clicked on div in image (resizable image or placeholder) the uploadService is invoked", function () {
    $.extend(this, setup());
    
    var doTest = function ($html, uploadService, debug) {
      var $image = $html.find('.psc-cms-ui-uploadable-image');
      $image.simulate('dblclick');
      
      var dialog = uploadService.getSingleDialog();
      assertTrue(dialog.isOpen());
      
      dialog.close();
      
      //var request = uploadService.getAjaxService().getRequest();
      //assertNotUndefined(request,'ajax service request has been invoked '+debug);
    };
    
    doTest(this.image.unwrap(), this.uploadService, 'for image');
    doTest(this.emptyImage.unwrap(), this.uploadService, 'for placeholder');
    
  });
});