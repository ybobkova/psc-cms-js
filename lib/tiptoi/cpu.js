define(['joose', 'tiptoi/Timer','Psc/EventDispatching','tiptoi/Sound'], function(Joose) {
  /**
   * Verwaltet den internen State des tiptois
   *
   * soll eine Nachbildung des echten tiptoi Processors sein
   *
   * Events:
   *  tiptoi-input-ignored [reason, type, input]
   *  
   */
  Joose.Class('tiptoi.cpu', {
    
    does: [Psc.EventDispatching],
    
    has: {
      eventManager: { is: 'rw', required: false, isPrivate: true, handles: [ 'on', 'one', 'off' ] },
      inputProvider: { is: 'rw', required: true, isPrivate: true }
    },
    
    methods: {
      start: function (program) {
        this._trigger('start', [this, program]);
      },
      
      waitForInput: function(onInputLogic) {
        var that = this;
        this._trigger('waiting-for-input');
        
        $.when(this.$$inputProvider.getInput())
         .then(function (input) {
            that._trigger('input-given', ['OID', input]);
            
            try {
              onInputLogic(input);
            } catch (exception) {
              that._trigger('crash', [exception]);
              that.end();
            }
          }
        );
      },
  
      waitForInputWithTimer: function(timer, onInputLogic) {
        var that = this;
        this._trigger('waiting-for-input-with-timer', [timer]);
        
        var timerHasRunOut = false;
  
        timer.hasRunOut(function () {
          timerHasRunOut = true;
        });
  
        $.when(this.$$inputProvider.getInput())
         .then(function (input) {
            if (timerHasRunOut) {
              that._trigger('input-ignored', ['timedout', 'OID', input]);
            
            } else {
              
              //timer.stop();
              that._trigger('input-given', ['OID', input]);
            
              try {
                onInputLogic(input);
              } catch (exception) {
                that._trigger('crash', [exception]);
                that.end();
              }
            }
          }
        );
      },

      /**
       * Requires another tiptoi program to run
       *
       * default: tiptoi.require(['master.common.ispy'], function (ISpy) {})
       */
      require: function (dependencies, callback) {
        for (var i = dependencies.length - 1; i >= 0; i--) {
          dependencies[i] = 'gdl/'+dependencies[i].replace(/\./g, '/'); // dies ersetzt namespaces mit . mit / OUND ist auch gleich ein hacking-schutz
        }

        return require(dependencies, callback);
      },
      
      /**
       * @return tiptoi.Timer
       */
      startTimer: function(seconds) {
        var timer = new tiptoi.Timer({
          seconds: seconds
        });
        
        timer.start();
        return timer;
      },
      
      evaluate: function(quantifier) {
        this._trigger('evaluate', arguments);
      },
  
      startGame: function (num) {
        this._trigger('start-game', [num]);
      },
      
      createSound: function(props) {
        return new tiptoi.Sound(props);
      },
      
      end: function () {
        this._trigger('end', [this]);
      },
      
      // funktionen die nicht zur api gehören
      _trigger: function (name, args) {
        args = args || [];
        this.getEventManager().triggerEvent('tiptoi-'+name, {'tiptoi': this}, args);
      },
  
      toString: function() {
        return "[tiptoi.cpu]";
      }
    }
  });
});