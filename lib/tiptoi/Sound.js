Joose.Class('tiptoi.Sound', {
  
  has: {
    content: { is : 'rw', required: true, isPrivate: true },
    number: { is : 'rw', required: true, isPrivate: true }
  },
  
  my: {
    methods: {
      list: function (soundList) {
        var sounds = [];
        $.each(soundList, function (i, soundArray) {
          sounds.push(new tiptoi.Sound({
            content: soundArray[0],
            number: soundArray[1]
          }));
        });
        return sounds;
      }
    }
  },
  
  methods: {
    toString: function() {
      if (!this.$$content) {
        return '[tiptoi.Sound]';
      }
      
      return  "„"+this.$$content+"“ ("+this.$$number+")";
    }
  }
});