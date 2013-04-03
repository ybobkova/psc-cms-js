define(['psc-tests-assert', 'knockout', 'test-files/navigation.comun.flat', 'Psc/UI/NavigationSelect', 'Psc/Test/DoublesManager', 'Psc/ko/Bindings/LayoutManager'], function(t, ko, comunFlat) {
  
  module("Psc.ko.Bindings.LayoutManager");

  var setup = function (test) {
    var dm = new Psc.Test.DoublesManager();

    dm.getContainer().getNavigationService().setFlat(comunFlat); // better acceptance

    var bindings = new Psc.ko.Bindings.LayoutManager({
      container: dm.getContainer(),
      knockout: ko,
      uploadService: dm.getUploadService()
    });

    bindings.activate();

    return t.setup(test, {
      bindings: bindings, 
      bindingNames: ['singleImage', 'navigationSelect']
    });
  };
  

  test("injects some bindings into layoutManager", function() {
    var that = setup(this);

    for (var i = 0; i<this.bindingNames.length; i++) {
      this.assertNotUndefined(ko.bindingHandlers[ this.bindingNames[i] ], 'binding "'+this.bindingNames[i]+'" is injected');
    }
  });

  test("navigationSelect init creates navigationSelect for element", function () {
    var $element = $('<div />'), that = t.setupBinding(setup(this), 'navigationSelect', $element);

    this.koInit();
    stop();

    // is ko able to notice async initialisiations?
    // should we trigger some finish here, etc?
    // can we bind to k.o. event?
    setTimeout(function () {
      start();
      that.assertHasJooseWidget(Psc.UI.NavigationSelect, $element);

    }, 50);
  });

  test("navigationSelect init sets current nav node with just integer value", function () {
    var $element = $('<div />'), that = t.setupBinding(setup(this), 'navigationSelect', $element);

    this.koInit(15);
    stop();

    // is ko able to notice async initialisiations?
    // should we trigger some finish here, etc?
    // can we bind to k.o. event?
    setTimeout(function () {
      start();
      var navigationSelect = that.assertHasJooseWidget(Psc.UI.NavigationSelect, $element);

      that.assertEquals({
        label: " / Wer ? / Unser Lernnetzwerk",
        value: 15
      }, navigationSelect.getValue());

    }, 50);
  });

  test("is ko working when value is changed with val() (and then trigger())", function () {
    var that = setup(this);
    var $ta;

    $('#visible-fixture').empty().append($ta = $('<textarea data-bind="value: t1.value" />'));

    var model = {
      t1: {
        value: ko.observable("da value")
      }
    };

    ko.applyBindings(model ,$('#visible-fixture')[0]);

    $ta.val('new val').trigger('change'); // trigger is necessary to make it work

    this.assertEquals("new val", ko.utils.unwrapObservable(model.t1.value));
  });

  test("singleImage populates value on image change", function() {
    var $element = $('<div />'), that = t.setupBinding(setup(this), 'singleImage', $element), initValue;

    that.koInit(initValue = {
      url: '/some/url.jpg',
      imageEntity: 7
    });

    var image = this.assertHasJooseWidget(Psc.UI.UploadableImage, $element);

    that.assertEquals(initValue, 
      {
        url: image.getUrl(),
        imageEntity: image.getId()
      }, 
      "image is init with value from ko:Init"
    );

    image.getEventManager().triggerEvent('image-edited', {}, [image, 8, '/new/url.jpg']);

    that.assertEquals({
        url: '/new/url.jpg',
        imageEntity: 8
      }, ko.utils.unwrapObservable(that.getObservable(),
        "ko value is value from changed image"
      )
    );

  });
});