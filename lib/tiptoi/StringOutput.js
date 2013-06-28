define(['joose', 'Psc/Code', 'tiptoi/cpu', 'Psc/Exception'], function(Joose) {
  /**
   * Hört auf allen Events der CPU und gibt diese aus
   *
   * pipe ist ein callback mit zwei parametern (msg, eventName)
   * diesen mit before: initialize: setzen!
   */
  Joose.Class('tiptoi.StringOutput', {
    
    has: {
      eventManager: { is : 'rw', required: true, isPrivate: true },
      pipe: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function (props) {
        if (!Psc.Code.isFunction(this.$$pipe)) {
          throw new Psc.Exception('ableitende Klasse für StringOutput muss pipe auf eine function setzen: '+this.toString());
        }
        
        this.initEvents();
      }
    },
    
    methods: {
      initEvents: function () {
        var evm = this.getEventManager();
        
        var output = this.getPipe();
        
        evm.on({
          'play-sounds': function (e, sounds, soundType) {
            output(sounds.join("\n + "), e.type, [soundType]);
          },
          'play-sound': function (e, sound, soundType) {
            output(sound.toString(), e.type, [soundType]);
          },
          
          'tiptoi-waiting-for-input': function (e) {
            output('tiptoi wartet auf input...', e.type);
          },
  
          'tiptoi-waiting-for-input-with-timer': function (e, timer) {
            output('tiptoi wartet auf input '+timer.getSeconds()+' Sekunde(n) timeout...', e.type);
          },
          
          'tiptoi-input-given': function (e, type, value) {
            output('getippt wurde: '+type+': '+value, e.type);
          },
  
          'tiptoi-crash': function (e, exception) {
            var msg = exception.message || exception.getMessage();
            output('ERROR: tiptoi ist gecrasht wegen Programmierfehler: '+msg, e.type);
          },
          
          'tiptoi-start-game': function (e, num) {
            if (!num)  {
              num = '(nicht angegeben)';
            }
            output('tiptoi würde Spiel '+num+' starten. Dies ist jedoch im Simulator nicht möglich.');
          },
          
          'tiptoi-evaluate': function (e, right) {
            output('Evaluation von '+right+' richtigen Antworten', e.type);
          },
          
          'tiptoi-start': function (e, cpu, program) {
            output('Spiel „'+program.getName()+'“ startet', e.type);
          },
          
          'tiptoi-end': function (e) {
            output('Spiel beendet', e.type);
          },

          'tiptoi-require': function (e, dependencies) {
            output('Lade Spiel '+dependencies[0], e.type);
          }
        });
      },
  
      reset: function () {
        
      },
      
      toString: function() {
        return "[tiptoi.StringOutput]";
      }
    }
  });
});