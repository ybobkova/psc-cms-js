/*jshint boss:true*/
define(['joose'], function(Joose) {
  Joose.Class('Psc.TextParser', {
    
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    methods: {
      tokenize: function (text) {
        var rxList = /^\s*\-\s*(.+)(?:\n\n|\n|$|\n\s*$)/,
            rxEmpty = /^\s*\n$/,
            rxLastToken = /\n\n/,
            rxToken = /^(.+)?(\n\n|\n|$|\n\s*$)/;
            
            
        var match = [], x = 0, i = 0, list, last, isEmpty, tokens = [];
        
        while (text.length && x <= 30) {
          match = rxToken.exec(text);
          last = rxLastToken.test(match[0]);
          isEmpty = rxEmpty.test(match[0]);
          list = rxList.test(match[0]);

          if (!isEmpty) {
            if (list) {
              match = rxList.exec(text);
              tokens.push({type:"listpoint", value:match[1]});
            } else {
              tokens.push({type:"text", value:match[1]});
            }
            if (last) {
              tokens.push({type:"doublebreak"});
            }
          }
          i = match[0].length;
          text = text.substr(i);
          x++;
        }
        return tokens;
      },
      
      parse:  function (text) {
        var arrayList = [], parsed = [], listFlag = false,
            tokens = this.tokenize(text),
            token, nextToken;

        for (var l = 0; l < tokens.length; l++) {
          token = tokens[l];
          nextToken = l < tokens.length-1 ? tokens[l+1] : {type: 'none'};

        if (token.type === "listpoint") {
          arrayList.push(token.value);
          if (!listFlag) {
            listFlag = true;
          } else {
            if (nextToken.type === "doublebreak" || l === tokens.length - 1) {
              parsed.push({type:"list", value:arrayList});
              arrayList = [];
              listFlag = false;
            }
          }
        } else {
            if (token.type !== "doublebreak") {
              if (listFlag) {
                parsed.push({type:"list", value:arrayList});
                arrayList = [];
                listFlag = false;
              }
              parsed.push({type:"paragraph", value:token.value});
            }
          }
        }
        return parsed;
      },
      
      toString: function() {
        return "[Psc.TextParser]";
      }
    }
  });
});