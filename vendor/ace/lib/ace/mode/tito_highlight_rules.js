define(function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

  var TitoHighlightRules = function() {
    var identifier = "[a-zA-ZöäüÖÄÜ]";
    var soundOperator = "\\s*\\>\\s*|\\s*\\*\\s*\\>";
    var gotoOperator = "^\\s*\\=\\s*\\>";
    var ifElse = "Oder|Wenn|Ansonsten";
    var soundType = "\\[|\\]|\\(|\\)";
    var preposition = "(?:aus|zu|zum|zur|in|jedes|für)";
    var equals = "\\s*\\:\\=\\s*";
    var operator = "\\<|\\>|\\=\\=|\\>\\=|\\<\\=";

    var tokenMap = {
      "variable": "support.function",
      "functions": "string",
      "sound": "comment",
      "gotofunction": "constant.language.boolean",
      "plaintext": "text",
      "comment": "constant.numeric",
      "control": "keyword"
    };

    this.$rules = {
      "start": [{
        token: tokenMap.control,
        regex: "Spiel:\\s*"
      }, {
        token: tokenMap.variable, // Variablendeklaration, keine Tabelle
        regex: identifier + "+(?=" + equals + "\\d+)"
      }, {
        token: tokenMap.variable, // Wenn nach := eine variable steht
        regex: identifier + "+(?!" + equals + "\\d+)(?=" + equals + ")",
        next: "variable"
      }, {
        token: tokenMap.comment, // Wenn nach := eine variable steht
        regex: "\\#",
        next: "comment"
      }, {
        token: tokenMap.plaintext,
        regex: "\\s*\\:",
        next: "declaration"
      }, {
        token: tokenMap.functions, // Anfang einer Funktiondeklaration
        regex: "^.*\\:\\s*$"
      }, {
        token: tokenMap.control, //Kontrollesymbole
        regex: ifElse
      }, {
        token: tokenMap.control, //"Für jedes"
        regex: "für jedes\\s*",
        next: "variableImText"
      }, {
        token: tokenMap.control, //Goto
        regex: gotoOperator,
        next: "gotoFunction"
      }, {
        token: tokenMap.sound, // Soundsymbole
        regex: soundOperator,
        next: "sound"
      }, {
        token: tokenMap.variable, // Variablen mit < oder > oder ==
        regex: identifier + "+\\s*(?=" + operator + "\\s*)",
        next: "variable"
      }, {
        token: tokenMap.variable, // Variablen mit < oder > oder == einer Value
        regex: identifier + "+(?=\\s*(?:" + operator + ")\\s*\\d+)"
      }, {
        token: tokenMap.plaintext,
        regex: "^\\s*Füge\\s*",
        next: "fuegeEinen"
      }, {
        token: tokenMap.plaintext,
        regex: "(?:Wähle|auf)\\s*",
        next: "waehle"
      }, {
        token: tokenMap.plaintext,
        regex: preposition + "\\s+",
        next: "variableImText"
      }],
      variable: [{
        token: tokenMap.variable,
        regex: "\\s*" + identifier
      }, {
        token: tokenMap.plaintext,
        regex: "true|false|\\s|$",
        next: "start"
      }],
      comment: [{
        token: tokenMap.plaintext,
        regex: "$",
        next: "start"
      }, {
        token: tokenMap.comment,
        regex: ".*"
      }],
      waehle: [{
        token: tokenMap.plaintext,
        regex: "(?:einen|eine|ein|von der)\\s+",
        next: "variableImText"
      }, {
        token: tokenMap.plaintext,
        regex: "etwas",
        next: "start"
      }, {
        token: tokenMap.plaintext,
        regex: "[0-9]+\\s*",
        next: "variableNachZahl"
      }, {
        token: tokenMap.variable,
        regex: identifier + "+",
        next: "start"
      }],
      fuegeEinen: [{
        token: tokenMap.plaintext,
        regex: "(?:einen|eine|ein|von der)\\s+",
        next: "variableImText"
      }, {
        token: tokenMap.variable,
        regex: identifier + "+",
        next: "start"
      }],
      variableImText: [{
        token: tokenMap.variable,
        regex: identifier + "+"
      }, {
        token: tokenMap.plaintext,
        regex: "\\s*\\d+\\s*",
        next: "variableNachZahl"
      }, {
        token: tokenMap.plaintext,
        regex: "\\s",
        next: "start"
      }],
      variableNachZahl: [{
        token: tokenMap.plaintext,
        regex: "\\s|$",
        next: "start"
      }, {
        token: tokenMap.variable,
        regex: identifier + "+"
      }],
      sound: [{
        token: tokenMap.plaintext,
        regex: "$",
        next: "start"
      }, {
        token: tokenMap.sound,
        regex: soundType
      }, {
        token: tokenMap.plaintext,
        regex: "\\s*\\:\\s*",
        next: "variable"
      }],
      gotoFunction: [{
        token: tokenMap.plaintext,
        regex: "$",
        next: "start"
      }, {
        token: tokenMap.gotofunction,
        regex: ".*"
      }],
      declaration: [{
        token: tokenMap.plaintext,
        regex: "true|false|$|table",
        next: "start"
      }, {
        token: tokenMap.variable,
        regex: identifier
      }]
    };
  };

  oop.inherits(TitoHighlightRules, TextHighlightRules);

  exports.TitoHighlightRules = TitoHighlightRules;

});