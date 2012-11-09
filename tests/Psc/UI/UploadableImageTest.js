define(['psc-tests-assert','jquery-simulate','Psc/UI/UploadableImage','Psc/Test/DoublesManager','Psc/UI/ResizableImage'], function(t) {
  
  module("Psc.UI.UploadableImage");
  
  var setup = function(test) {
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
    
    return t.setup(test, {uploadService: uploadService, image: image, emptyImage: emptyImage});
  };

  test("image with url shows resizable image", function() {
    setup(this);
  
    var $html = this.image.unwrap();
    var $img = $html.find('.psc-cms-ui-uploadable-image');
    
    
    this.assertTrue($img.is('.psc-cms-ui-uploadable-image'));
    
    // noch icht fertig: 
    //this.assertTrue($img.is('.psc-cms-ui-resizable-image'));
    //resizableImage = Psc.UI.WidgetWrapper.unwrapWidget($img, Psc.UI.ResizableImage);
  });
  
  test("image without url shows placeholder", function () {
    setup(this);
    var $html = this.emptyImage.unwrap();
    var $img = $html.find('.psc-cms-ui-uploadable-image');
    
    //this.assertFalse($img.is('.psc-cms-ui-resizable-image'), 'is not an resizable image');
    this.assertTrue($img.is('.psc-cms-ui-uploadable-image.placeholder'),'is placeholder');
  });
  
  test("if dbl clicked on div in image (resizable image or placeholder) the uploadService is invoked", function () {
    var that = setup(this);
    
    var doTest = function ($html, uploadService, debug) {
      var $image = $html.find('.psc-cms-ui-uploadable-image');
      $image.simulate('dblclick');
      
      var dialog = uploadService.getSingleDialog();
      that.assertTrue(dialog.isOpen());
      
      dialog.close();
      
      //var request = uploadService.getAjaxService().getRequest();
      //this.assertNotUndefined(request,'ajax service request has been invoked '+debug);
    };
    
    doTest(this.image.unwrap(), this.image.getUploadService(), 'for image');
    doTest(this.emptyImage.unwrap(), this.uploadService, 'for placeholder');
    
  });
});