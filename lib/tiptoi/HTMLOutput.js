define(['joose', 'tiptoi/StringOutput'], function(Joose) {
  /**
   * Hört auf allen Events der CPU und gibt diese aus
   */
  Joose.Class('tiptoi.HTMLOutput', {
    
    isa: tiptoi.StringOutput,
    
    has: {
      widget: {is: 'rw', required: true, isPrivate: true }
    },
    
    before: {
      initialize: function (props) {
        var that = this, evm = this.getEventManager(), output = this.$$widget;
        
        this.$$pipe = function (msg, eventName) {
          if (eventName === 'tiptoi-input-given') { // das machen wir über den provider-got-input
            return false;
          }
          
          var $p = $('<p class="'+eventName+'">'+msg+'</p>');
          
          if (eventName === 'play-sound' || eventName === 'play-sounds') {
            if (msg.search(/Wrong-Sound/) !== -1) { // wrong
              $p.addClass('wrong-sound');
            }
            
            if (msg.search(/(Right-Sound|tusch)/i) !== -1) {
              $p.addClass('right-sound');
            }
          } else if(eventName === 'crash') {
            $p.addClass('crash');
          }
          
          return output.append($p);
        };
  
        evm.on('input-provider-listening', function (e, $container) {
          var wait = output.find('p.tiptoi-waiting-for-input').last();
          
          // start flashing
          wait.effect('pulsate', [300], 2500);
        });
    
        evm.on('input-provider-got-input', function (e, oid, $container) {
          // wir ersetzen alle noch wartenden waits, weil das auch das ist, was passiert wenn man mehrere threads waiting hat
          var wait = output.find('p.tiptoi-waiting-for-input');
          
          that.stopFlashing(wait, oid);
        });
        
        evm.on('tiptoi-end', function (e) {
          // wir ersetzen alle noch wartenden waits damti diese nicht weiterflashen
          var wait = output.find('p.tiptoi-waiting-for-input');
          that.stopFlashing(wait, {oid: 0, label: 'keine, da Spiel beendet'});
        });
      }
    },
    
    methods: {
      reset: function () {
        this.$$widget.empty();
      },
      
      stopFlashing: function (waits, oid) {
        // stop flashing
        waits.stop(true).queue(function (e) {
          waits.css('opacity', 1)
            .removeClass('tiptoi-waiting-for-input')
            .addClass('tiptoi-waited-for-input')
            .html('getippt wurde: '+oid.oid+' '+oid.label);
        });
      },
      
      toString: function() {
        return "[tiptoi.HTMLOutput]";
      }
    }
  });
});