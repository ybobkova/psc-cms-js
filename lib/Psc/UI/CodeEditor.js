define(['joose', 'ace/ace', 'ace/mode/javascript', 'ace/mode/tito', 'ace/theme/crimson_editor', 'ace/theme/vibrant_ink', 'Psc/UI/WidgetWrapper'], function(Joose, ace, aceJavascript, aceTito, aceCrimson, aceVibrant) {
  /**
   * Stellt ein Div als Code-Editor da
   *
   * momentan nur PHP und CrimsonEditor theme
   * siehe: http://ajaxorg.github.com/ace
   *
   * Licence: MPL
   *
   * @TODO theme + mode müssen als unter dependency in eine eigene klasse (weil sonst das asynchrone laden machmal nicht geht)
   */
  Joose.Class('Psc.UI.CodeEditor', {
    isa: Psc.UI.WidgetWrapper,
    
    has: {
      ace: { is : 'rw', required: false, isPrivate: true },
      width: { is: 'rw', required: false, isPrivate: true, init: 450 },
      height: { is: 'rw', required: false, isPrivate: true, init: 560 },
      formName: { is: 'rw', required: false, isPrivate: true, init: 'codeEditor' },
      text: { is: 'rw', required: false, isPrivate: true },
      readonly: { is: 'rw', required: false, isPrivate: true, init: false },

      mode: { is: 'rw', required: false, isPrivate: true, init: "javascript" },
      
      session: { is: 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function () {
        this.initWidget();
      }
    },
  
    methods: {
      initWidget: function() {
        var $editor = this.unwrap();
        var text = $editor.text();
        
        $editor.css('position','relative');
        //$editor.css('overflow', 'hidden');
        //$editor.css('width',this.$$width+'px');
        $editor.css('width','100%');
        $editor.css('height',this.$$height+'px');
        
        this.$$ace = ace.edit($editor[0]);
        var editor = this.$$ace;
        
        
        if (this.$$readonly === true) {
          editor.setReadOnly(true); 
        }

        this.$$session = editor.getSession();
        
        var Mode;
        if (this.$$mode === 'tito') {
          Mode = aceTito.Mode;
          editor.setTheme("ace/theme/vibrant_ink");
        } else {
          Mode = aceJavascript.Mode;
          editor.setTheme("ace/theme/crimson_editor");
        }
        this.$$session.setMode(new Mode());
        this.$$session.setTabSize(2);
        this.$$session.setNewLineMode('unix');
        this.$$session.getDocument().setNewLineMode('unix');
        this.$$session.setUseSoftTabs(true);
        this.$$session.setUseWrapMode(true);
        editor.setHighlightActiveLine(false);
        
        this.$$session.setValue(this.$$text || text);
        this.linkWidget();
      },
      getText: function () {
        return this.$$session.getValue();
      },
      setText: function (value) {
        return this.$$session.setValue(value);
      },
      toString: function() {
        return "[Psc.UI.CodeEditor]";
      },
      serialize: function (data) {
        data[this.$$formName] = this.$$ace.getSession().getValue();
        return data;
      }
    }
  });
});