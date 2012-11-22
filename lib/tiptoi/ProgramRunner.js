/*jshint evil:true*/
define(['tiptoi/SimpleSoundPlayer','tiptoi/Program', 'tiptoi/cpu', 'tiptoi/GameTable',
        'Psc/InvalidArgumentException', 'Psc/Code'], function () {
    
  Joose.Class('tiptoi.ProgramRunner', {
    //isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.EventDispatching],
    
    has: {
      soundPlayer: {is: 'rw', required: false, isPrivate: true },
      inputProvider: {is: 'rw', required: true, isPrivate: true },
      cpu: {is: 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function (props) {
  
        if (!props.soundPlayer) {
          this.$$soundPlayer = new tiptoi.SimpleSoundPlayer({
            eventManager: this.getEventManager(),
            onPlay: function (sounds) {
              // do nothing, wir fangen die events ab
            }
          });
        }
        
        if (!props.cpu) {
          this.$$cpu = new tiptoi.cpu({
            inputProvider: this.getInputProvider(),
            eventManager: this.getEventManager()
          });
        }
      }
    },
    
    methods: {
      run: function (program) {
        if (!Psc.Code.isInstanceOf(program, tiptoi.Program)) {
          throw new Psc.InvalidArgumentException('program', 'Instance of tiptoiProgram', program, 'ProgramRunner::run()');
        }
        
        var evm = this.$$eventManager;
        var soundPlayer = this.$$soundPlayer, that = this;
        var d = $.Deferred();
        
        var cpu = this.$$cpu;
        
        var programScope = {
          playSound: function (sound) {
            soundPlayer.playSound(sound);
          },
          playSounds: function (sounds) {
            soundPlayer.playSounds(sounds);
          },
          playRandomSound: function (sounds) {
            soundPlayer.playRandomSound(sounds);
          },
  
          tiptoi: cpu,
          
          A: {
            contains: function (array, value) {
              if (!array) {
                throw new Psc.InvalidArgumentException('array','array', array, 'A.contains in tiptoi Programm');
              }
              return Joose.A.exists(array, value);
            },
            /**
             * Remove the first occurence of needle in haystack
             */
            remove: function (array, needle) {
              if (!array) {
                throw new Psc.InvalidArgumentException('array','array', array, 'A.remove in tiptoi Programm');
              }
              
              for (var i = 0, l = array.length; i < l; i++) {
                if (array[i] === needle) {
                  array.splice(i, 1);
                  return; // stop, remove only once
                }
              }
            },
            
            copy: function (array) {
              var arrayCopy = [];
              for (var i = 0, l = array.length; i < l; i++) {
                arrayCopy.push(array[i]);
              }
              return arrayCopy;
            },
            
            shuffle: function(array) {
              array.sort(function () {
                return 0.5 - Math.random();
              });
              
              return array;
            },
            
            range: function (min, max) {
              var range = [];
              for (var i = min; i <= max; i++) {
                range.push(i);
              }
              return range;
            }
          },
          
          random: Psc.Numbers.randomInt,
          
          debug: Psc.Code.debug
        };
        
        // alle Tables des Programmes
        $.each(program.getTables(), function (name, rows) {
          Psc.Code.assertArray(rows, 'rows in Table: '+name, 'ProgramRunner.run()');
          programScope[name+'Table'] = new tiptoi.GameTable({rows: rows, name: name});
        });
        
        var exports = [], parameters = [];
        // übernehme alle properties aus dem scope als globale variablen für das Program
        Joose.O.eachOwn(programScope, function (parameter, paramName) {
          exports.push(paramName);
          parameters.push(parameter);
        });
        
        // alle Parameter des Scopes, die nicht globale variablen werden sollen sondern nur über this.xxx erreichbar sind
        programScope.sounds = $.extend({}, this.getCommonSounds(), program.getSounds());
        $.extend(programScope, this.getCommonSounds()); // @TODO ich glaub das hier baut jede menge mist
        
        // wir compilieren den code in eine Funktion jsProgram
        var jsProgram = this.compile(program, exports, programScope);
  
        // wir binden uns an das end() event vom tiptoi, denn dann sagen wir, dass unser programm gelaufen ist
        cpu.getEventManager().on('tiptoi-end', function (e) {
          d.resolve(true);
        });
        
        var simpleLog = '';
        var simpleOutput = new tiptoi.StringOutput({
          eventManager: cpu.getEventManager(),
          pipe: function (string) {
            simpleLog += string+"\n";
          }
        });
        
        // da wir promise erst zurückgeben müssen, um an notify zu binden muss der start leicht delayed sein
        // dies ist aber kein zeit delay (deshalb reicht eine 1ms), dies ist nur damit der thread weiterläuft
        // und erstmal d.promise() returned
        setTimeout(function () {
          
          d.notify(cpu);
          
          cpu.start(program);
  
          // damit geben wir playSound als Parameter an jsProgram (das macht playSound() direkt benutzbar)
          // und geben programScope als Scope: das macht this.playSound() ebenfalls benutzbar
          try {
            
            jsProgram.apply(programScope, parameters);
          } catch (e) {
            Psc.Code.warning('Fehler beim Ausführen von jSprogram', e);
            Psc.Code.debug(simpleLog);
            d.reject(e);
          }
          
        }, 1);
        
        return d.promise();
      },
      
      getCommonSounds: function () {
        // unbedingt auch in GameExporter anpassen
        
        return {
          gameButtonSound: new tiptoi.Sound({content: 'Game-Button-Sound', number: '091104ak009'}),
          rightSound: new tiptoi.Sound({content: 'Right-Sound', number: '091104ak004'}),
          tusch: new tiptoi.Sound({content: 'Tusch', number: '110207md5'}),
          wrongSound: new tiptoi.Sound({content: 'Wrong-Sound', number: '091104ak005'}),
          pause: new tiptoi.Sound({content: '0,3 sec. Silent-Pause', number: '091104ak000'}),
          tickingSound: new tiptoi.Sound({content: 'Ticking Sound', number: '101019js000'})
        };
      },
      
      compile: function (program, exports, programScope) {
        var pCode = program.getCode();
        
        var soundsRx = /(this|that)\.sounds\.([a-zA-Z0-9]+)/g;
        var match;
        
        while ((match = soundsRx.exec(pCode))) {
          
          if (!programScope.sounds[match[2]]) {
            programScope.sounds[match[2]] = [];
            
          //  var textBefore = match.input.substr(0,match.index);
          //  var cutBefore = textBefore.lastIndexOf("\n");
          //  if (cutBefore === -1) cutBefore =  Math.max(0, match.index - 20);
          //  var context = match.input.substring(cutBefore, Math.min(match.input.length, match.index+40));
          //  var line = textBefore.split("\n").length;
          //  
          //  throw new Error("Fehler beim Erstellen des ProgramCodes '"+program.getName()+"': that.sounds."+match[2]+" ist nicht gesetzt.\nUngefähr bei Zeile "+line+":"+context);
          }
        }
        
        var jsProgram;
        eval(
          "jsProgram = function("+exports.join(",")+") {"+
            pCode+
          "};"
        );
        
        return jsProgram;
      }
    }
  });
});