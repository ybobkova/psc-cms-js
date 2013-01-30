define(['psc-tests-assert', 'Psc/TextEditor', 'jquerypp/dom/selection'], function(t) {
  
  module("Psc.TextEditor");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var initialText = "Lorem ipsum sit amet..";
    var $ta = $('<textarea cols="120" rows="8">'+initialText+'</textarea>');
    
    $('#visible-fixture').empty().append($ta);
    
    var textEditor = new Psc.TextEditor({
      widget: $ta
    });
    
    var assertCaretPosition = function (pos, message) {
      var selection = $ta.selection();
      this.assertEquals(pos, selection.start, message);
      this.assertEquals(pos, selection.end, message);
    };
    
    return t.setup(test, {textEditor: textEditor, $ta: $ta, assertCaretPosition: assertCaretPosition});
  };
  
  test("textEditor can move caret to position", function() {
    var that = setup(this), l = "Lorem ipsum sit amet..".length;

    this.textEditor.move(11);
    this.assertCaretPosition(11, 'caret is moved');
    
    this.textEditor.move(l);
    this.assertCaretPosition(l, 'cat is moved after the last char (to the end)');

    this.textEditor.move(0);
    this.assertCaretPosition(0, 'caret moved to begining');

    this.textEditor.move(l+1);
    this.assertCaretPosition(l, 'cat is moved after the last char (to the end), with overflow');
  });
  
  test("textEditor getCaret reflects position", function () {
    var that = setup(this);
    
    this.textEditor.move(8);
    this.assertEquals(8, this.textEditor.getCaret());
  });
  
  test("getCaret returns false if text is selected", function () {
    var that = setup(this);
    
    this.$ta.selection(0,4);
    this.assertFalse(this.textEditor.getCaret());
  });
  
  test("getSelection throws exception if no selection is given", function () {
    var that = setup(this);
    
    this.textEditor.move(3);
    
    try {
      this.textEditor.getSelection();
      
    } catch (ex) {
      QUnit.ok('exception is thrown');
      return;
    }
    
    this.fail('expected exception is not thrown');
  });
  
  test("hasSelection is true when textarea has selection", function () {
    var that = setup(this);
    
    this.assertFalse(this.textEditor.hasSelection(), 'is false before');
    
    this.$ta.selection(0,4);
    this.assertTrue(this.textEditor.hasSelection(), 'is true for selection');
  });
  
  test("getSelectionText returns the text for current selection", function () {
    var that = setup(this);
    
    this.$ta.selection(0,5);
    
    this.assertEquals("Lorem", this.textEditor.getSelectionText(), 'getSelectionText returns selected substring from ta');
  });
  
  test("textEditor can insert text at given caret position", function() {
    var that = setup(this);
    
    this.textEditor.move(12);
    this.textEditor.insert("dolor ");
    
    this.assertEquals("Lorem ipsum dolor sit amet..", this.$ta.val(), 'text is inserted correctly');
  });

  test("textEditor insert spaced inserts the text at given caret position, but with spaces on each side - pad left", function() {
    var that = setup(this);
    //Lorem ipsum sit amet.
    //           ^ 11

    this.textEditor.move(11);
    this.textEditor.insertSpaced("dolor");
    
    this.assertEquals("Lorem ipsum dolor sit amet..", this.$ta.val(), 'text is inserted with spaces correctly');
  });
    
  test("textEditor insert spaced inserts the text at given caret position, but with spaces on each side - pad right", function() {
    var that = setup(this);
    //Lorem ipsum sit amet.
    //            ^ 12
    
    this.textEditor.move(12);
    this.textEditor.insertSpaced("dolor");
    
    this.assertEquals("Lorem ipsum dolor sit amet..", this.$ta.val(), 'text is inserted with spaces correctly');
  });
  
  test("textEditor (helper): lookbehind returns the chars with length LEFT from position", function () {
    var that = setup(this);
    //Lorem ipsum sit amet.
    //  ^ 2              ^ 19
    this.assertEquals("o", this.textEditor.lookbehind(2, 1));
    this.assertEquals("Lo", this.textEditor.lookbehind(2, 2));
    this.assertEquals(undefined, this.textEditor.lookbehind(2, 3));
    this.assertEquals(undefined, this.textEditor.lookbehind(2, 4));
    
    this.assertEquals("me", this.textEditor.lookbehind(19, 2));
    this.assertEquals("ame", this.textEditor.lookbehind(19, 3));
    this.assertEquals("Lorem ipsum sit ame", this.textEditor.lookbehind(19, 19));
    this.assertEquals(undefined, this.textEditor.lookbehind(19, 20));
    
    this.assertEquals(undefined, this.textEditor.lookbehind(-1, 1));
  });

  test("textEditor (helper): lookahead returns the chars with length RIGHT from position+1", function () {
    var that = setup(this);
    //Lorem ipsum sit amet.
    //  ^ 2              ^ 19
    this.assertEquals("e", this.textEditor.lookahead(2, 1));
    this.assertEquals("em", this.textEditor.lookahead(2, 2));
    this.assertEquals("em ipsum sit amet.", this.textEditor.lookahead(2, 18));
    this.assertEquals(undefined, this.textEditor.lookahead(2, 19));
    
    this.assertEquals(".", this.textEditor.lookahead(19, 1));
    this.assertEquals(undefined, this.textEditor.lookahead(19, 2));
    
    this.assertEquals(undefined, this.textEditor.lookahead(21, 1));
  });
  
  test("textEditor can make a selection", function () {
    setup(this);
    
    this.textEditor.select(0,5);
    
    this.assertEquals({
        width: 5,
        start: 0,
        end: 5
      },
      this.$ta.selection()
    );
    
    this.textEditor.setSelection(0,5);
  });
  
  test("textEditor can delete the selection", function () {
    var that = setup(this);
    
    this.textEditor.select(0,6);
    this.textEditor.deleteSelection();
    
    this.assertEquals(
      "ipsum sit amet..",
      this.$ta.val()
    );
  });
});