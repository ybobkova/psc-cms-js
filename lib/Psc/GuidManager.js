define(['joose'], function(Joose) {
  Joose.Class('Psc.GuidManager', {
    
    has: {
      hashTable: { is : 'r', required: false, isPrivate: true, init: Joose.I.Object },
      pad: { is: 'rw', required: false, isPrivate: true, init: '000000' },
      index: { is: '', required: false, isPrivate: true, init: 1}
    },
  
    methods: {
      create: function () {
        var index = this.$$index++;
        var guid = (this.$$pad+index.toString()).slice(-this.$$pad.length);
        
        this.$$hashTable[guid] = true;
        return guid;
      },
      toString: function() {
        return "[Psc.GuidManager]";
      }
    }
  });
});