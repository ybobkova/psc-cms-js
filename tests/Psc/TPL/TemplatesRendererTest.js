define(['psc-tests-assert', 'knockout', 'Psc/TPL/TemplatesRenderer'], function(t, ko) {
  
  module("Psc.TPL.TemplatesRenderer");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var tpl = new Psc.TPL.TemplatesRenderer({
    });
    
    return t.setup(test, {tpl: tpl});
  };
  
  test("widget template can be rendered", function() {
    var that = setup(this);
    
    var html = this.tpl.render(
      'SCE.widget', {
        headline: 'Paragraph',
        content: '<textarea class="my-test"></textarea>'
      }
    );
    
    var $fixture = $('#visible-fixture').empty().append(html);
    
    var $header = this.assertjQueryLength(1, $fixture.find('h3.widget-header'));
    this.assertContains("Paragraph", $header.text());
    this.assertjQueryLength(1, $fixture.find('textarea.my-test'));
    
  });
  
  test("widget  template can be rendered on the fly", function () {
    var that = setup(this);
    
    this.tpl.compile('test.hello', "Hello {{world}}!");
    this.tpl.compile('test.info', "You can haz the {{what}}!");
    
    this.assertEquals(
      'Hello Philipp!',
      this.tpl.render('test.hello', {
        'world': 'Philipp'
      })
    );
    
    this.assertEquals(
      'You can haz the Template Engine!',
      this.tpl.render('test.info', {
        'what': 'Template Engine'
      })
    );
  });

  test("using injected input in non-quoted variable can be knockouted", function() {
    var that = setup(this);
    
    var html = this.tpl.render(
      'SCE.Components.Teaser',
      {
        headline: {
          description: "Überschrift des Teasers",
          input: '<input data-bind="value: headline" name="headline" type="text" value="die Überschrift" />'
        }
      }
    );

    $('#visible-fixture').html(html);

    ko.applyBindings({
      headline: "value for headline"
    });

    var $headlineInput = this.assertjQueryLength(1, $("#visible-fixture input[name=headline]"));

    this.assertEquals("value for headline", $headlineInput.val());
  });
});