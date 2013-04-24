define(['psc-tests-assert', 'text!templates/src/SCE/Widgets/Teaser.json', 'test-files/navigation.comun.flat','Psc/Test/DoublesManager', 'Psc/UI/LayoutManager/Teaser'], function(t, teaserSpec, comunFlat) {
  
  module("Psc.UI.LayoutManager.Teaser");

  var setup = function (test) {
    var dm = new Psc.Test.DoublesManager();
    var container = dm.getContainer();

    container.getNavigationService().setFlat(comunFlat);

    var teaser = new Psc.UI.LayoutManager.TemplateWidget({
      specification: teaserSpec,
      container: container,
      uploadService: dm.getUploadService()
    });
    
    test.selectLinkItem = function (test, item) {
      var comboBox = test.assertHasJooseWidget(Psc.UI.ComboBox, test.teaser.unwrap().find('.psc-cms-ui-combo-box'));
      comboBox.getEventManager().trigger('auto-complete-select', [item]);
    };

    test.changeText = function (test, newText) {
      var $ta = test.assertjQueryLength(1, test.teaser.unwrap().find('textarea.paragraph'));
      $ta.val(newText).trigger('change');
    };
    
    return t.setup(test, {teaser: teaser});
  };

  var setupHTML = function(test) {
    var that = setup(test);
    var $html = that.teaser.create();

    $('#visible-fixture').empty().append($html);

    var d = $.Deferred();

    // nav flat does not work synchron, maybe a widget-ready event here?
    setTimeout(function () {
      d.resolve(that, $html);
    }, 50);


    return d.promise();
  };

  test("parses the spec (sets type)", function () {
    setup(this);

    this.assertEquals("Teaser", this.teaser.getType());
  });
  
  asyncTest("render cms html", function() {
    setupHTML(this).then(function (that, $html) {
      start();

      that.assertjQueryLength(2, $html.find('input:text'));
      that.assertjQueryLength(1, $html.find('textarea'));
      that.assertjQueryLength(1, $html.find('div:contentEquals("Überschrift")'));
      that.assertjQueryLength(1, $html.find('div:contentEquals("Link-Ziel")'));
    });
  });

  asyncTest("teaser changes link value when link is selected", function () {
    setupHTML(this).then(function (that) {
      start();

      that.selectLinkItem(that, {label: "selected / element", value: 7});

      that.assertEquals(
        7,
        that.teaser.getItem('link').value()
      );

    });
  });

  asyncTest("teaser serializes the values set in items", function () {
    setupHTML(this).then(function (that) {
      start();

      var s = {};
      that.selectLinkItem(that, {label: "selected / element", value:8 });
      that.changeText(that, 'something texty');

      that.teaser.serialize(s);

      that.assertEquals({
        headline: 'die Überschrift',
        text: 'something texty',
        link: 8,
        image: ""
      }, s);

    });
  });
});
