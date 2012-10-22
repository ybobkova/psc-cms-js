define(['Psc/Code','Psc/Exception'], function() {
  Joose.Class('Psc.InvalidArgumentException', {
    isa: Psc.Exception,
  
    has: {
      arg: { is : 'rw', required: true },
      expected: { is : 'rw', required: true },
      actual: { is: 'rw', required: false }
    },
    
    methods: {
      BUILD: function (arg, expected, actual, context) {
        var msg = "Falscher Parameter für Argument: '"+arg+"'. Erwartet wird: "+expected;
        
        if (arguments.length >= 3) {
          msg += ' Übergeben wurde: '+Psc.Code.varInfo(actual);
        }
        
        if (context) {
          msg += ' in '+context;
        }
        
        return Joose.O.extend(this.SUPER(msg), {
          arg: arg,
          expected: expected,
          actual: actual
        });
      }
    }
  });
});