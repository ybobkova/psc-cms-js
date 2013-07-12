define(['joose', 'jquery', 'tiptoi/Timer','Psc/EventDispatching','tiptoi/Sound'], function(Joose, $) {
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
      inputProvider: { is: 'rw', required: true, isPrivate: true },
      scope: { is: 'rw', required: false, isPrivate: true }
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
        var that = this;
        /*
        for (var i = dependencies.length - 1; i >= 0; i--) {
          dependencies[i] = '/api/product/test/game-creater/convert-common/'+dependencies[i]+'/page/1';
        }
        */
        this._trigger('require', [dependencies]);

        return require(dependencies, function (programCode) {
          var programArgs = that._parseFunctionArgs(programCode);

          var runProgram = function (caller, options) {
            var parameterBindings = [];

            for (var i = 0, arg; i < programArgs.length; i++) {
              arg = programArgs[i];

              if (arg === 'options') {
                parameterBindings.push(options);
              } else {
                parameterBindings.push(that.$$scope[arg] || undefined);
              }
            }

            return programCode.apply(caller, parameterBindings);
          };

          callback(runProgram);
        });
      },

      _parseFunctionArgs: function(callback) {
        // bought from requirejs
        var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
        var functionArgsRegExp = /^function\s*\((.*?)\)/;

        var args = [];

        callback
          .toString()
          .replace(commentRegExp, '')
          .replace(functionArgsRegExp, function (match, argsString) {
            args = argsString.split(/\s*,\s*/);
          });

        return args;
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