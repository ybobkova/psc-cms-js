/*globals ace:true require:true */
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
  isa: 'Psc.UI.WidgetWrapper',
  
  use: [ $.psc.getUsePresence('ace') ]

  //// theme
  //{
  //  type: 'javascript',
  //  token       : '/js/ace/theme-crimson_editor.js',
  //  presence    : function () {
  //    return false;
  //  }
  //},
  //
  //// mode
  //{
  //  type: 'javascript',
  //  token       : '/js/ace/mode-php.js',
  //  presence    : function () {
  //    return true; // php loading
  //  }
  //}

  ],
  
  has: {
    ace: { is : 'rw', required: false, isPrivate: true },
    width: { is: 'rw', required: false, isPrivate: true, init: 450 },
    height: { is: 'rw', required: false, isPrivate: true, init: 560 },
    formName: { is: 'rw', required: false, isPrivate: true, init: 'codeEditor' },
    text: { is: 'rw', required: false, isPrivate: true },
    readonly: { is: 'rw', required: false, isPrivate: true, init: false },
    
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
      
      $editor.css('position','relative');
      //$editor.css('overflow', 'hidden');
      //$editor.css('width',this.$$width+'px');
      $editor.css('width','100%');
      $editor.css('height',this.$$height+'px');
      
      this.$$ace = ace.edit($editor[0]);
      var editor = this.$$ace;
      //editor.setTheme("ace/theme/crimson_editor");
      
      if (this.$$readonly === true) {
        editor.setReadOnly(true); 
      }
      
      //var phpMode = require("ace/mode/php").Mode;
      var Mode = require("ace/mode/javascript").Mode;
      this.$$session = editor.getSession();
      
      this.$$session.setMode(new Mode());
      this.$$session.setTabSize(2);
      this.$$session.setNewLineMode('unix');
      this.$$session.getDocument().setNewLineMode('unix');
      this.$$session.setUseSoftTabs(true);
      this.$$session.setUseWrapMode(true);
      editor.setHighlightActiveLine(false);
      
      this.$$session.setValue(this.$$text);
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