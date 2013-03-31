define(['jquery', 'joose', 'Psc/UI/WidgetWrapper', 'Psc/Exception', 'jquery-selectrange', 'jquerypp/dom/selection'], function ($, Joose) {
  
  /**
   * Position is defined as the zero index of the char where the caret is standing BEFORE
   *
   * example: | is the caret blinking
   *
   * 01234|5678
   * position of the caret is 5
   * 
   * 012345678|
   * position of the caret is 9
   * 
   * |012345678
   * position of the caret is 0
   *
   * when the caret is at the end of the string, its on the index which equals the text length
   * if the car is at the beginning of string its equal 0
   */
  Joose.Class('Psc.TextEditor', {
    isa: Psc.UI.WidgetWrapper,

    has: {
      //text: { is: 'rw', required: true, isPrivate: true},
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      move: function(caretPosition) {
        this.unwrap().selectRange(caretPosition, caretPosition);
      },
      getCaret: function () {
        // this works in ie. getSelection() does not
        var el = this.unwrap();
        var caret = el.prop("selectionStart");
        
        if (el.prop("selectionStart") !== el.prop("selectionEnd")) {
          return false;
        }
        
        return caret;
      },
      getSelection: function () {
        var selection = this.unwrap().selection();
        
        if (selection.width === 0) {
          throw new Psc.Exception('there is no current selection');
        }
        
        
        return selection;
      },
      select: function (start, end) {
        if (end <= start) {
          throw new Psc.Exception('end should be greater than start for select()');
        }
        
        this.unwrap().selection(start, end);
        return this;
      },
      setSelection: function (start, end) {
        return this.select(start, end);
      },
      hasSelection: function () {
        return this.unwrap().selection().width > 0;
      },
      getSelectionText: function () {
        var selection = this.getSelection();
        
        return this.getText().substring(selection.start, selection.end);
      },
      deleteSelection: function () {
        var selection = this.getSelection();
        
        var text = this.getText();
        
        this.setText(
          text.substring(0, selection.start)+
          text.substr(selection.end)
        );
      },
      insert: function(insertText, position) {
        position = this.expandWithCaret(position);
        
        var text = this.getText(),
            left = position > 0 ? text.substr(0, position) : '',
            right = position < text.length ? text.substr(position) : '';
        
        this.setText(left+insertText+right);
        this.move(left.length+insertText.length);
        
        return this;
      },
      expandWithCaret: function (position) {
        if (position === undefined) {
          if ((position = this.getCaret()) === false) {
            throw new Psc.Exception('there is no current position for caret. move() first or set argument #2');
          }
        }
        return position;
      },
      insertSpaced: function(insertText, position) {
        position = this.expandWithCaret(position);

        // pad left?
        var before = this.lookbehind(position, 1);
        if (insertText.substr(0,1) !== ' ' && position > 0 && before !== ' ' && before !== "\n") {
          insertText = ' '+insertText;
        }
        
        // pad right?
        if (insertText.substr(-1,1) !== ' ' && position < this.getText().length && this.lookahead(position-1, 1) !== ' ') {
          insertText = insertText+' ';
        }
        
        this.insert(insertText, position);

        return {
          text: insertText,
          position: position
        };
      },
      lookbehind: function(position, length) {
        var behind;
        if (position-length >= 0) {
          behind = this.getText().substr(position-length, length);
        }
        return behind;
      },
      lookahead: function(position, length) {
        var text = this.getText(), ahead;
        if (position+1+length < text.length) {
          ahead = text.substr(position+1, length);
        }
        return ahead;
      },
      getText: function () {
        return this.unwrap().val();
      },
      setText: function (text) {
        this.unwrap().val(text);
        return this;
      },
      toString: function () {
        return '[Psc.TextEditor]';
      }
    }
  });
});