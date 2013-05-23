define(function(require, exports, module) {
  "use strict";
  
  var TextMode = require("./text").Mode;
  var oop = require("../lib/oop");
  var Tokenizer = require("../tokenizer").Tokenizer;
  var TitoHighlightRules = require("./tito_highlight_rules").TitoHighlightRules;
  
  var Mode = function() {
    var highlighter = new TitoHighlightRules();
    this.$tokenizer = new Tokenizer(highlighter.getRules());
  };
  
  oop.inherits(Mode, TextMode);
  
  exports.Mode = Mode;
});