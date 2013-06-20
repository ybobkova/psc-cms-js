define("ace/mode/tito", ["require", "exports", "module"], function(require, exports, module) {
"use strict";

var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
console.log(TextMode);
var Tokenizer = require("ace/tokenizer").Tokenizer;
var MyNewHighlightRules = require("ace/mode/titorules").MyNewHighlightRules;

var Mode = function() {
  var highlighter = new MyNewHighlightRules();
  this.$tokenizer = new Tokenizer(highlighter.getRules());
};

oop.inherits(Mode, TextMode);

exports.Mode = Mode;
});