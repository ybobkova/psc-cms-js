Joose.Class('tiptoi.InputProvider', {
  
  has: {
    sequence: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Array },
    delay: { is : 'rw', required: false, isPrivate: true, init: 300 }
  },
  
  methods: {
    getInput: function () {
      var deferred = $.Deferred(), that = this, sequence = this.$$sequence;
      
      setTimeout(function () {
        if (sequence && sequence.length >= 1) {
          deferred.resolve(that.getSequence().pop());
        } else {
          deferred.reject('sequence is empty');
        }
      }, this.$$delay);
      
      return deferred.promise();
    },
    
    toString: function() {
      return "[tiptoi.InputProvider]";
    }
  }
});