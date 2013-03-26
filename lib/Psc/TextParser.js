/*jshint boss:true*/
define(['joose'], function(Joose) {
  Joose.Class('Psc.TextParser', {
    
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    methods: {
      parse: function (text) {
        var rxList = /^\s*\-\s*(.+)?(?:\n\n|\n|$|\n\s*$)/,
					  rxEmpty = /^\s*\n$/;
            rxToken = /^(.+)?(?:\n\n|\n|$|\n\s*$)/;
            
        var match = [], x = 0, l = 0, i = 0, tokens = [], list, undef, arrayList = [], ausgabe = [], listFlag = false;
				
			while(text.length && x <= 30) {
				match = rxToken.exec(text);
				undef = rxEmpty.test(match[0]);
				
				if (!undef){
					tokens.push(match[1]);
				}
				
				i = match[0].length;
				text = text.substr(i);
				x++;
			}
			
			while(l<tokens.length) {
				
				list = rxList.test(tokens[l]);
				
				if(list && !listFlag){
					match = rxList.exec(tokens[l]);
					arrayList.push(match[1]);
					listFlag=true;
				}
				
				else if(list && listFlag){
					match = rxList.exec(tokens[l]);
					arrayList.push(match[1]);
				}
				
				else if (!list && listFlag){
					ausgabe.push({type:"list", value:arrayList});
					arrayList = [];
					listFlag = false;
					ausgabe.push({type:"paragraph", value:tokens[l]});
				}
				
				else if (!list && !listFlag){
					ausgabe.push({type:"paragraph", value:tokens[l]});
				}
				
				l++;
			}
      return list;
      },
      
      toString: function() {
        return "[Psc.TextParser]";
      }
    }
  });
});