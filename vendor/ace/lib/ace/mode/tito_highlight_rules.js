define(function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

  var TitoHighlightRules = function() {
    var word = "[A-Za-zöäüÖÄÜ\\d]*[A-Za-zöäüÖÄÜ][A-Za-zöäüÖÄÜ\\d]*";
    var soundOperator = "\\s*\\>\\s*|\\s*\\*\\s*\\>";
    var gotoOperator = "^\\s*\\=\\s*\\>";
    var soundVariable = "\\s*\\:\\s*\\>";
    var bedingungIf = "(?:Oder Wenn|Wenn)\\s*";
    var bedingungElse = "Ansonsten\\s*";
    var timerCommand = "(?:Start|Stop)\\s+";
    var soundType = "\\[|\\]|\\((?=[^\\s]+\\)\\s*$)|\\)\\s*$";
    var preposition = "(?:aus|zu|zum|zur|in|für jedes|für)";
    var equals = "\\s*\\:\\=\\s*";
    var operator = "(?:\\<|\\>|\\=\\=|\\>\\=|\\<\\=)";
    var arrayElement = "\\[\\s*.+?\\s*\\]"

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
        token: tokenMap.variable, // Deklaration eines Elementes eines Arrays
        regex: "^\\s*" + word + "(?=\\s*" + arrayElement + ")",
        next: "element"
      }, {
        token: tokenMap.variable, // Variablendeklaration, keine Tabelle
        regex: "^\\s*" + word + "(?=\\s*" + equals + "\\d+)"
      }, {
        token: tokenMap.variable,
        regex: "^\\s*" + word + "(?=\\s*\\:\\>)",
        next: "sound"
      }, {
        token: tokenMap.variable, // Wenn nach := eine variable steht
        regex: "^\\s*" + word + "(?!\\s*" + equals + "\\d+)(?=\\s*" + equals + ")",
        next: "variable"
      }, {
        token: tokenMap.comment,
        regex: "\\#",
        next: "comment"
      }, {
        token: tokenMap.plaintext,
        regex: "\\s*\\:",
        next: "declaration"
      }, {
        token: tokenMap.plaintext,
        regex: timerCommand,
        next: "timer"
      }, {
        token: tokenMap.functions, // Anfang einer Funktiondeklaration
        regex: "^.*\\:\\s*$"
      }, {
        token: tokenMap.control, //Kontrollesymbole
        regex: bedingungIf,
        next: "bedingung"
      }, {
        token: tokenMap.control, //Kontrollesymbole
        regex: bedingungElse
      }, {
        token: tokenMap.control, //Goto
        regex: gotoOperator,
        next: "gotoFunction"
      }, {
        token: tokenMap.sound,
        regex: "^(?:" + soundOperator + ")(?=\\:)",
        next: "variable"
      }, {
        token: tokenMap.sound, // Soundsymbole
        regex: "^(?:" + soundOperator + ")",
        next: "sound"
      }, {
        token: tokenMap.variable, // Variablen mit < oder > oder == einer Value
        regex: word + "(?=\\s*(?:" + operator + ")\\s*\\d+)"
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
      element: [{
        token: tokenMap.plaintext,
        regex: "\\["
      }, {
        token: tokenMap.variable,
        regex: word
      }, {
        token: tokenMap.plaintext,
        regex: "\\](?=\\s*" + operator + ")",
        next: "variable"
      }, {
        token: tokenMap.plaintext,
        regex: "\\]",
        next: "sound"
      }],
      variable: [{
        token: tokenMap.plaintext,
        regex: "true|false|$",
        next: "start"
      }, {
        token: tokenMap.variable,
        regex: word
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
        regex: "aus\\s*",
        next: "poolMitZahlen"
      }],
      poolMitZahlen: [{
        token: tokenMap.variable,
        regex: "\\d+\\s*" + word,
        next: "start"
      }],      
      fuegeEinen: [{
        token: tokenMap.plaintext,
        regex: "(?:einen|eine|ein)\\s+",
        next: "variableImText"
      }, {
        token: tokenMap.variable,
        regex: word,
        next: "start"
      }],
      variableImText: [{
        token: tokenMap.variable,
        regex: word
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
        regex: word
      }],
      sound: [{
        token: tokenMap.sound,
        regex: "\\:\\>"
      }, {
        token: tokenMap.sound,
        regex: soundType
      }, {
        regex: "$",
        next: "start"
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
        regex: word
      }],
      bedingung: [{
        token: tokenMap.plaintext,
        regex: "auf etwas",
        next: "start"
      }, {
        token: tokenMap.plaintext,
        regex: "auf (?:einen|eine|ein)\\s*",
        next: "variableImText"
      }, {
        token: tokenMap.plaintext,
        regex: "auf",
        next: "aufVariableGetippt"
      }, {
        token: tokenMap.plaintext,
        regex: "innerhalb des\\s*",
        next: "variableImText"
      }, {
        token: tokenMap.plaintext,
        regex: "alle|A",
        next: "start"
      }, {
        token: tokenMap.variable, // Variablen <>== einer Variable
        regex: word + "\\s*(?=" + operator + "\\s*)",
        next: "variable"
      },  {
        token: tokenMap.variable, // Variablen <>== einer Variable
        regex: word + "\\." + word + "\\s*(?=" + operator + "\\s*)",
        next: "variable"
      },  {
        token: tokenMap.variable, // Variablen <>== einer Variable
        regex: word + "(?=\\s*" + arrayElement + ")",
        next: "element"
      },  {
        token: tokenMap.variable,
        regex: word,
        next: "start"
      }],
      aufVariableGetippt: [{
        token: tokenMap.variable,
        regex: ".+?(?=(?:angetippt|getippt wurde))",
        next: "start"
      }],
      timer: [ {
        token: tokenMap.plaintext,
        regex: "mit ",
        next: "mitSekunden"
      }, {
        token: tokenMap.variable,
        regex: word
      },  {
        token: tokenMap.plaintext,
        regex: "\\.",
        next: "start"
      }],
      mitSekunden: [{
        token: tokenMap.variable,
        regex: ".+(?=Sekunden)",
        next: "start"
      }]
    };
  };

  oop.inherits(TitoHighlightRules, TextHighlightRules);

  exports.TitoHighlightRules = TitoHighlightRules;

});