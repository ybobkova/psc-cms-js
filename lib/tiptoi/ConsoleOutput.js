/*globals console:true*/
define(['joose', 'tiptoi/StringOutput'], function(Joose) {
  /**
   * Hört auf allen Events der CPU und gibt diese aus
   */
  Joose.Class('tiptoi.ConsoleOutput', {
    isa: tiptoi.StringOutput,

    has: {
      silent: { is : 'rw', required: false, isPrivate: true, init: false }
    },
    
    before: {
      initialize: function (props) {
        var that = this;

        if (that.$$silent) {
          this.$$pipe = function() {

          };
        } else {
          this.$$pipe = function (msg) {
            console.log(msg);
          };
        }
        
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