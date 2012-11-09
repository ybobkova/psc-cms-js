define(['psc-tests-assert','Psc/UI/ResizableImage','Psc/UI/SingleImage','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.SingleImage");
  
  var setup = function(test) {
    var dm = new Psc.Test.DoublesManager();
    var uploadService = dm.getUploadService();
    
    var $container = $('<div><input type="hidden" name="im1" value="" /></div>');
    $('#visible-fixture').empty().append($container);
    
    var image = new Psc.UI.SingleImage({
      uploadService: uploadService,
      url: '/js/fixtures/normalImage.jpg',
      widget: $container,
      id: '7',
      formName: 'im1'
    });

    var emptyImage = new Psc.UI.SingleImage({
      uploadService: uploadService,
      url: null,
      widget: $container,
      id: null,
      formName: 'im1'
    });
    
    return t.setup(test, {image: image, emptyImage: emptyImage, $container: $container, uploadService: uploadService});
  };

  test("html is build with image", function() {
    setup(this);
    
    var $widget = this.image.unwrap(), $img;
    
    this.assertEquals(1, ($img = $widget.find('img')).length);
    this.assertEquals('/js/fixtures/normalImage.jpg', $img.attr('src').substring(0, 28));
  });
  
  test("if emtpy url is set a placeholder is used for image", function() {
    setup(this);
    
    var $widget = this.emptyImage.unwrap(), $placeHolder;
    this.assertEquals(1, ($placeHolder = $widget.find('div.placeholder')).length,'placeholder is constructed');
  });
  
  test("hidden field is synchronized on edited", function() {
    setup(this);
    
    var $widget = this.emptyImage.unwrap();
    
    this.emptyImage.getImage().getEventManager().triggerEvent('image-edited', {}, [this.emptyImage.getImage(), 7, '/new/url']);
    
    this.assertEquals('7', $widget.find('input[type="hidden"]').val());
    // das geht natürlich nicht, weil wir ja kein richtiges event haben sondern nur eins faken
    //this.assertEquals('/new/url', $widget.find('img').attr('src'));
    this.assertEquals('/new/url', this.emptyImage.getUrl());
  });
});