/**
 * Hört auf allen Events der CPU und gibt diese aus
 */
Joose.Class('tiptoi.HTMLOutput', {
  
  isa: 'tiptoi.StringOutput',
  
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
            $p.addJoose.Class('wrong-sound');
          }
          
          if (msg.search(/Right-Sound/) !== -1) {
            $p.addJoose.Class('right-sound');
          }
        } else if(eventName === 'crash') {
          $p.addJoose.Class('crash');
        }
        
        return output.append($p);
      };

      evm.on('input-provider-listening', function (e, $container) {
        var wait = output.find('p.tiptoi-waiting-for-input').last();
        
        // start flashing
        wait.effect('pulsate', [300], 2500);
      });
  
      evm.on('input-provider-got-input', function (e, oid, $container) {
        // stop flashing
        var wait = output.find('p.tiptoi-waiting-for-input').first(); // das letzte was noch "waiting" ist müssen wir nehmen
        wait
          .stop(true).queue(function (e) {
            wait.css('opacity', 1)
              .removeJoose.Class('tiptoi-waiting-for-input')
              .addJoose.Class('tiptoi-waited-for-input')
              .html('tiptoi bekam input: '+oid.oid+' '+oid.label)
          })
      });
    }
  },
  
  methods: {
    reset: function () {
      this.$$widget.empty();
    },
    
    toString: function() {
      return "[tiptoi.HTMLOutput]";
    }
  }
});