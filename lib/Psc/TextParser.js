/*jshint boss:true*/
define(['joose', 'jquery'], function(Joose, $) {
  Joose.Class('Psc.TextParser', {
    
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    methods: {
      tokenize: function (text) {
        var rxList = /^\s*[\-•\d]+\s*(.+)/,
            rxEmpty = /^\s*\n$/,
            rxLastToken = /\n\n/,
            rxToken = /^(.+)?(\n\n|\n|$)/;   
            
            
        var match = [], x = 0, i = 0, list, short, last, isEmpty, tokens = [];
        
        while (text.length && x <= 30) {
          match = rxToken.exec(text);
          isEmpty = rxEmpty.test(match[0]);
          if (!isEmpty) {
            last = rxLastToken.test(match[0]);
            list = rxList.test(match[0]);
            if (list) {
              match = rxList.exec(match[1]);
              match[1] = $.trim(match[1]);
              tokens.push({type:"listpoint", value:match[1]});
            } else {
              match[1] = $.trim(match[1]);
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
        var parsed = [], 
            openList = false,
            tokens = this.tokenize(text),
            token, nextToken;

        for (var l = 0; l < tokens.length; l++) {
          token = tokens[l];
          nextToken = l < tokens.length-1 ? tokens[l+1] : {type: 'none'};

          if (token.type === "listpoint") {
            if (!openList) {
              openList = [];
            }
            openList.push(token.value);
            if (nextToken.type === "doublebreak" || l === tokens.length - 1) {
              parsed.push({type:"list", value:openList});
              openList = false;
            }
          } else if (token.type === "text") {
            parsed.push({type:"paragraph", value:token.value});
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