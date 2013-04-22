define(['psc-tests-assert', 'Psc/UI/LayoutManager/ContentStreamWrapper'], function(t) {
  
  module("Psc.UI.LayoutManager.ContentStreamWrapper");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var contentStreamWrapper = new Psc.UI.LayoutManager.ContentStreamWrapper({
      wrapped: {
        locale: "de",
        type: "page-content",
        revision: "default",
        entries: []
      }
    });

    var $container = $('<div/>');
    $('#visible-fixture').empty().append($container);

    $container.append(contentStreamWrapper.create());
    
    return t.setup(test, {contentStreamWrapper: contentStreamWrapper, $container: $container});
  };
  
  test("contentstreamwrapper class wrapper is created", function() {
    var that = setup(this);

    var $widget = this.assertjQueryLength(1, that.$container.find('.contentstreamwrapper.widget'));
  });

  test("inner container is connect morphable and sortable", function () {
    var that = setup(this);

    var $container = this.assertjQueryLength(1, that.$container.find('.contentstreamwrapper.widget .content-stream'));

    this.assertjQueryHasWidget('sortable', $container);
    // connect morphable is only the button
  });

});