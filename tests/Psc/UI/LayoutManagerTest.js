define(['psc-tests-assert','Psc/UI/LayoutManager','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.LayoutManager");
  
  var setup = function (test, params) {
    var dbm = new Psc.Test.DoublesManager();
    var $fixture = $('#visible-fixture').empty();
    var $html = $('<div class="psc-cms-ui-splitpane psc-cms-ui-serializable psc-cms-ui-layout-manager">'+
                        '<div class="left"><fieldset class="psc-cms-ui-group"><legend>Layout Test</legend><div class="content"></div></fieldset></div>'+
                        '<div class="right"><div class="psc-cms-ui-accordion"></div></div>'+
                      '</div>'
                    );
    
    $fixture.append($html);
/*
<fieldset class="ui-corner-all ui-widget-content psc-cms-ui-group magic-helper"><legend>Magic Box</legend>
  <div class="content"><textarea style="height: 200px; width: 100%" name="magic" id="" class="textarea ui-widget-content ui-corner-all magic-box"></textarea>
<button class="psc-cms-ui-button psc-guid-5017deab7f428 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false"><span class="ui-button-text">umwandeln</span></button>
<small class="hint">in die Magic Box kann ein gesamter Text eingefügt werden. Der Text wird dann analysiert und automatisch in Abschnitte und Elemente unterteilt</small>
</div></fieldset>
*/

    var layoutManager = new Psc.UI.LayoutManager($.extend({
      widget: $html,
      uploadService: dbm.getUploadService()
    }, params || []));
    
    return t.setup(test, {
      assertWidget: function (assert, $widget) {
        var m = function (msg) {
          return '[widget: '+assert.type+'] '+msg;
        };
        
        this.assertTrue($widget.hasClass('widget'), m('has class widget'));
        this.assertTrue($widget.hasClass(assert.type), m('has class for type'));
        this.assertEquals(1, $widget.find('h3.widget-header').length, m('has a header'));
        this.assertEquals(1, $widget.find('h3.widget-header span.ui-icon-close').length, m('has a close button'));
        this.assertEquals(1, $widget.find('div.widget-content').length, 'has a content div');
      },
      uploadService: layoutManager.getUploadService(),
      '$fixture': $fixture,
      layoutManager: layoutManager
    });
  };

  test("create List without content creates a widget with an empty textarea", function() {
    setup(this);
  
    var list = this.layoutManager.createWidget('li');
    var $list = list.unwrap(), $ta;
    
    this.assertWidget({type:'li'}, $list);
    
    $ta = $list.find('div.widget-content textarea');
    this.assertEquals(1, $ta.length, 'textarea muss in der liste sein');
    this.assertEquals("", $ta.val());
  });

  test("paragraph creates a widget with an empty textarea", function() {
    setup(this);
  
    var widget = this.layoutManager.createWidget('paragraph');
    var $widget = widget.unwrap(), ta;
    
    this.assertWidget({type:'paragraph'}, $widget);
    
    var $ta = $widget.find('div.widget-content textarea');
    this.assertEquals(1, $ta.length, 'textarea muss im paragraph sein');
    this.assertEquals("", $ta.val());
  });

  test("createWidget sends content parameter to subclass", function() {
    setup(this);
  
    var widget = this.layoutManager.createWidget('paragraph', 'mycontent');
    
    this.assertEquals("mycontent", widget.unwrap().find('div.widget-content textarea').val());
  });

  test("headline creates a widget with an empty input", function() {
    setup(this);
    var type = "headline";
  
    var widget = this.layoutManager.createWidget(type);
    var $widget = widget.unwrap();
    
    this.assertWidget({type:type}, $widget);
    
    var $input = $widget.find('div.widget-content input');
    this.assertEquals(1, $input.length, 'input muss in der '+type+' sein');
    this.assertEquals("", $input.val());
  });
  
  test("creates an image with the upload service as dpi", function() {
    setup(this);
    
    var type = "image";
    
    var widget = this.layoutManager.createWidget(type);
    this.assertSame(widget.getUploadService(), this.layoutManager.getUploadService());
    
    var $widget = widget.unwrap();
    
    this.assertWidget({type:type}, $widget);
  });
  
  test("appendWidget appends to the layout from the layoutManager", function () {
    setup(this);
    
    this.layoutManager.appendWidget(this.layoutManager.createWidget('headline', 'the headline'));
    this.layoutManager.appendWidget(this.layoutManager.createWidget('sub-headline', 'the second headline'));
    
    this.assertEquals(2,this.layoutManager.getWidgets().length);
    
  });
  
  test("layoutManager serializes all appended widgets", function () {
    setup(this);
    
    this.layoutManager.appendWidget(this.layoutManager.createWidget('headline', 'the headline'));
    this.layoutManager.appendWidget(this.layoutManager.createWidget('paragraph', 'content of paragraph 1'));
    this.layoutManager.appendWidget(this.layoutManager.createWidget('list', ['list1', 'list2']));
    this.layoutManager.appendWidget(this.layoutManager.createWidget('paragraph', 'content of paragraph 2'));
    
    var expectedData = {
      layoutManager: [
        {type: 'headline', label: "Überschrift", content:"the headline", level: 1},
        {type: 'paragraph', label: "Absatz", content:"content of paragraph 1"},
        {type: 'li', label: "Aufzählung", content:["list1", "list2"]},
        {type: 'paragraph', label: "Absatz", content:"content of paragraph 2"}
      ]
    };
    
    var data = {};
    this.layoutManager.serialize(data);
    
    this.assertEquals(expectedData, data, 'layoutManager is serializing correct');
  });
  
  test("layoutManager unserializes widgets structure", function () {
    setup(this);
    
    var serialized = {
      layoutManager: [
      {type: 'headline', label: "Überschrift", content:"the headline", level: 2},
      {type: 'paragraph', label: "Absatz", content:"content of paragraph 1"},
      {type: 'image', label: "Bild", content:""},
      {type: 'li', label: "Aufzählung", content:["list1", "list2"]},
      {type: 'paragraph', label: "Absatz", content:"content of paragraph 2"}
      ]
    };
    
    this.layoutManager.unserialize(serialized);
    this.assertEquals(5, this.layoutManager.getWidgets().length);
    
    var headline = this.layoutManager.getLinkedWidget(this.layoutManager.getLayout().find('div.widget').first());
    this.assertEquals('headline', headline.getType());
    this.assertEquals('Überschrift', headline.getLabel());
    this.assertEquals(2, headline.getLevel());
    
  });
  
  test("layoutManager unserializes widgets on init", function () {
    setup(this, {
      serializedWidgets: [
        {type: 'headline', label: "Überschrift", content:"the headline", level: 2},
        {type: 'paragraph', label: "Absatz", content:"content of paragraph 1"},
        {type: 'image', label: "Bild", content:""},
        {type: 'li', label: "Aufzählung", content:["list1", "list2"]},
        {type: 'paragraph', label: "Absatz", content:"content of paragraph 2"}
      ]
    });
    
    this.assertEquals(5, this.layoutManager.getWidgets().length);
  });


  test("creates Downloalist", function() {
    setup(this);
    var type = 'downloadslist';
    
    var widget = this.layoutManager.createWidget(type);
    this.assertSame(widget.getUploadService(), this.layoutManager.getUploadService());
    
    var $widget = widget.unwrap();
    this.assertWidget({type:type}, $widget);
    
    this.uploadService.setApiUrl('/upload-manager/api/pages');
    this.uploadService.setUiUrl('/upload-manager/pages');
    this.layoutManager.appendWidget(widget);
  });
});