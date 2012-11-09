/*jshint boss:true*/
define(['joose'], function () {
  Joose.Class('Psc.TextParser', {
    
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    methods: {
      parse: function (text) {
        var rxList = /^ *([\-*])\s*(.+?)(?=\n\n|\n *[\-*]|\s*$)/,
            rxParagraph = /^(.+?)(\n\n|$|\n\s*$)/,
            rxPToList = /^(.+?)(?=\n\x40*[\-*])/;
            
        var match, l, x = 0, tokens = [], list;
        
        while(text.length && x++ <= 30) {
          if ((match = rxList.exec(text)) !== null) {
            if (!list) {
              list = [];
            }
            
            list.push(match[2]);
            l = match[0].length;
          } else if(match = rxPToList.exec(text)) {
            if (list) {
              tokens.push({type:"list", value:list});
              list = undefined;
            }
            
            tokens.push({type:"paragraph", value: match[1]});
            l = match[0].length;
          } else if(match = rxParagraph.exec(text)) {
            if (list) {
              tokens.push({type:"list", value:list});
              list = undefined;
            }
            
            tokens.push({type:"paragraph", value: match[1]});
            l = match[0].length;
          } else if(match = text.match(/^\s+/)) {
            l = match[0].length;
          } else {
            throw new Error("kann den Text: "+text+" nicht parsen");
          }
          
          text = text.substr(l);
        }
        
        if (list) {
          tokens.push({type:"list", value:list});
        }
        
        return tokens;
      },
      
      toString: function() {
        return "[Psc.TextParser]";
      }
    }
  });
});