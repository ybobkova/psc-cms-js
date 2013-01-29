define(['psc-tests-assert','require','Psc/TextEditor', 'Psc/UI/LayoutManager/Paragraph','Psc/Test/DoublesManager'], function(t, require) {
  
  module("Psc.UI.TextEditor");
  
  var setup = function(test) {
    var dm = new Psc.Test.DoublesManager();
    
    var $container = $('<div/>');
    $('#visible-fixture').empty().append($container);
    
    var p = new Psc.UI.LayoutManager.Paragraph({
      label: 'Paragraph',
      content: 'Lorem ipsum dolor sit amet...',
    });
    
    test = t.setup(test, {paragraph: p, $container: $container});
    
    var editor;
    test.editor = function () {
      if (!editor) {
        editor = new Psc.TextEditor({ widget: $container.find('textarea:first')});
      }
      
      return editor;
    };
    
    return test;
  };

  test("paragraph shows a button to add a link", function() {
    setup(this);
    
    var $widget = this.paragraph.create();
    this.$container.append($widget);
    
    this.assertjQueryLength(1, $widget.find('button.add-link'));
  });
  
  test("paragraph inserts a link template, when caret is somewhere in the text", function () {
    var that = setup(this);
    
    var $widget = this.paragraph.create();
    this.$container.append($widget);
    var $button = $widget.find('button.add-link');
    
    this.editor().move(12);
    
    $button.trigger('click');
    
    this.assertEquals(
      "Lorem ipsum [[http://www.|Link-Beschreibung]] dolor sit amet...",
      this.editor().getText(),
      "text template is inserted into textarea on position 4"
    );
  });
  
  test("paragraph replaces marked word with boldl tag", function () {
    var that = setup(this);
    
    
    var $widget = this.paragraph.create();
    this.$container.append($widget);
    var $button = $widget.find('button.bold');
    
    this.editor().unwrap().selection(0,5);
    
    $button.trigger('click');
    
    this.assertEquals(
      "[b]Lorem[/b] ipsum dolor sit amet...",
      this.editor().getText(),
      "lorem is replaced with bold lorem"
    );
  });
});