define(['psc-tests-assert','require','Psc/UI/LayoutManager/Image','Psc/UI/ResizableImage','Psc/Test/DoublesManager'], function(t, require) {
  
  module("Psc.UI.LayoutManager.Image");
  
  var setup = function(test) {
    var dm = new Psc.Test.DoublesManager();
    var uploadService = dm.getUploadService();
    
    var $container = $('<div/>');
    $('#visible-fixture').empty().append($container);
    
    var image = new Psc.UI.LayoutManager.Image({
      uploadService: uploadService,
      label: 'Bild',
      url: require.toUrl('fixtures/img/normalImage.jpg'),
      caption: null,
      align: null,
      imageId: 17
    });

    var emptyImage = new Psc.UI.LayoutManager.Image({
      uploadService: uploadService,
      label: 'Bild',
      url: null,
      caption: null,
      align: null
    });

    var setupHTML = function (component) {
      var $widget;
      $container.append($widget = component.create());

      return $widget;
    };
    
    return t.setup(test, {image: image, emptyImage: emptyImage, $container: $container, uploadService: uploadService, setupHTML: setupHTML});
  };

  test("html is build with image", function() {
    setup(this);
    
    var $widget = this.setupHTML(this.image);
    var $splitPane, $imageContainer, $img;
    
    this.assertEquals(1, ($splitPane = $widget.find('div.psc-cms-ui-splitpane')).length);
    this.assertEquals(1, ($imageContainer = $splitPane.find('> div.right')).length);
    this.assertEquals(1, ($img = $imageContainer.find('img')).length, 'img can be found');
  });
  
  test("if emtpy url is set a placeholder is used for image", function() {
    setup(this);
    
    var $widget = this.emptyImage.create(), $placeHolder;
    
    this.assertEquals(1, ($placeHolder = $widget.find('div.placeholder')).length,'placeholder is constructed');
    
  });


  test("isEmpty reflects if image has an uploaded image", function () {
    var that = setup(this);

    this.setupHTML(this.image);
    this.setupHTML(this.emptyImage);

    this.assertTrue(this.emptyImage.isEmpty());
    this.assertFalse(this.image.isEmpty());
  });

  test("serialize does work", function () {
    var that = setup(this), s = {type: 'image'};

    this.setupHTML(this.image);

    this.image.cleanup();
    this.image.serialize(s);

    this.assertEquals({
        type: 'image',
        url: require.toUrl('fixtures/img/normalImage.jpg'),
        caption: null,
        align: null,
        imageId: 17
      },
      s
    );

  });
});