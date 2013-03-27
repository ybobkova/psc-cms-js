/*jshint boss:true*/
define(['joose'], function(Joose) {
  Joose.Class('Psc.TextParser', {
    
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    methods: {
      parse: function (text) {
        var rxList = /^\s*\-\s*(.+)(?:\n\n|\n|$|\n\s*$)/,
					  rxEmpty = /^\s*\n$/;
						rxLastToken = /\n\n/;
            rxToken = /^(.+)?(\n\n|\n|$|\n\s*$)/;
						
            
        var match = [], x = 0, l = 0, i = 0, tokens = [], list, last, undef, arrayList = [], ausgabe = [], listFlag = false;
				
				while(text.length && x <= 30) {
					match = rxToken.exec(text);
					last = rxLastToken.test(match[0]);
					undef = rxEmpty.test(match[0]);

					if (!undef && last){
						tokens.push(match[1]);
						tokens.push("zeilenumbruchdetected"); //ToDo
					}
					if (!undef && !last){
						tokens.push(match[1]);
					}

					i = match[0].length;
					text = text.substr(i);
					x++;
				}

				while(l<tokens.length) {

					list = rxList.test(tokens[l]);

					if(list){
						if (!listFlag){
							match = rxList.exec(tokens[l]);
							arrayList.push(match[1]);
							listFlag=true;
						}
						else{
							match = rxList.exec(tokens[l]);
							arrayList.push(match[1]);
							if(tokens[l+1]==="zeilenumbruchdetected" || l === tokens.length-1){
								ausgabe.push({type:"list", value:arrayList});
								arrayList = [];
								listFlag = false;
							}
						}
					}

					else{
						if (tokens[l]!=="zeilenumbruchdetected"){
							if (listFlag){
								ausgabe.push({type:"list", value:arrayList});
								arrayList = [];
								listFlag = false;
								ausgabe.push({type:"paragraph", value:tokens[l]});
							}
							else{
								ausgabe.push({type:"paragraph", value:tokens[l]});
							}
						}
					}
					l++;
				}
				return ausgabe;
			},
      
      toString: function() {
        return "[Psc.TextParser]";
      }
    }
  });
});