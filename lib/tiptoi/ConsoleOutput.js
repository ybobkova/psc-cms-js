/*globals console:true*/
define(['tiptoi/StringOutput'], function () {
  /**
   * Hört auf allen Events der CPU und gibt diese aus
   */
  Joose.Class('tiptoi.ConsoleOutput', {
    isa: tiptoi.StringOutput,
    
    before: {
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
});