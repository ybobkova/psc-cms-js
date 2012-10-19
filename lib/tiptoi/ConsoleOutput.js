/*globals console:true*/
/**
 * Hört auf allen Events der CPU und gibt diese aus
 */
Joose.Class('tiptoi.ConsoleOutput', {
  
  isa: 'tiptoi.StringOutput',
  
  after: {
    initialize: function (props) {
      
      this.$$pipe = function (msg) {
        console.log(msg);
      };
      
      this.initEvents();
    }
  },
  
  methods: {
    toString: function() {
      return "[tiptoi.ConsoleOutput]";
    }
  }
});