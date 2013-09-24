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
      imageEntity: 17
    });

    var resizedImage = new Psc.UI.LayoutManager.Image({
      uploadService: uploadService,
      label: 'Bild',
      url: require.toUrl('fixtures/img/normalImage.jpg'),
      caption: null,
      align: null,
      resize: {width: 300},
      imageEntity: 17
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
    
    return t.setup(test, 
      {
        image: image, emptyImage: emptyImage, resizedImage: resizedImage,
        $container: $container, uploadService: uploadService, 
        setupHTML: setupHTML,
        serialize: function(image) {
          var serialized = {type: 'image'};

          image.cleanup();
          image.serialize(serialized);

          return serialized;
        }
    });
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

  test("html shows a option to change the custom size of the image", function() {
    var that = setup(this);
    
    var $widget = this.setupHTML(this.resizedImage);
    var $left = this.assertjQueryLength(1, $widget.find('.psc-cms-ui-splitpane > .left'));

    var $width = this.assertjQueryLength(1, $left.find('[name=resize-width]'));
    this.assertjQueryLength(1, $left.find('[name=resize-height]'));

    this.assertEquals(300, parseInt($width.val(), 10), 'width is set from image');
  });

  test("if width is an integer it changes the export value", function () {
    var that = setup(this);

    var $widget = this.setupHTML(this.image);

    var $width = $widget.find('[name=resize-width]');

    $width.val('17');
    $width.trigger('change');

    this.assertEquals(17, this.serialize(this.image).resize.width, 'width should be updated in serialize');
  });

  test("if height and width is an integer it changes the export values", function () {
    var that = setup(this);

    var $widget = this.setupHTML(this.image);

    $widget.find('[name=resize-width]').val('200').trigger('change');
    $widget.find('[name=resize-height]').val('400').trigger('change');

    this.assertEquals(200, this.serialize(this.image).resize.width, 'width should be updated in serialize');
    this.assertEquals(400, this.serialize(this.image).resize.height, 'height should be updated in serialize');
  });

  test("serialize does work", function () {
    var that = setup(this), serialized = {type: 'image'};

    this.setupHTML(this.image);

    this.assertEquals({
        type: 'image',
        url: require.toUrl('fixtures/img/normalImage.jpg'),
        caption: null,
        align: null,
        resize: {},
        imageEntity: 17
      },

      this.serialize(this.image)
    );
  });
});