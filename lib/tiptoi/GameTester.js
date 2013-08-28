define(['joose', 'Psc/Code', 'tiptoi/SimpleSoundPlayer', 'tiptoi/ProgramRunner', 'tiptoi/Program', 'tiptoi/InputProvider', 'tiptoi/Sound', 'tiptoi/StringOutput', 'tiptoi/ConsoleOutput'], function(Joose) {
  
  Joose.Class('tiptoi.GameTester', {
    has: {
      programRunner: { is : 'rw', required: false, isPrivate: true },
      played: {is: 'rw', requred: false, isPrivate: true, init: Joose.I.Array },
      program: {is: 'rw', requred: false, isPrivate: true },
      cpu: {is: 'rw', requred: false, isPrivate: true }
      //output: {is: 'rw', requred: false, isPrivate: true }
    },
    
    after: {
      initialize: function (props) {
        var played = this.$$played, that = this;
        
        if (!props.programRunner) {
          this.$$programRunner = new tiptoi.ProgramRunner({
            soundPlayer: new tiptoi.SimpleSoundPlayer({
              onPlay: function (sounds) {
                $.each(sounds, function (i, sound) {
                  played.push(sound);
                });
              }
            }),
            inputProvider: new tiptoi.InputProvider({
              sequence: props.sequence
            })
          });
        }
      }
    },
    
    methods: {
      run: function() {
        var program = this.$$program, that = this;
        
        var status = this.$$programRunner.run(
          program
        );
        
        status.progress(function (cpu) {
          that.setCpu(cpu);
          
          var output = new tiptoi.StringOutput({eventManager: cpu.getEventManager()});
        });
        
        status.fail(function (error) {
          Psc.Code.warning('Game '+program.getName()+' kann nicht ausgeführt werden: '+error);
        });
        
        return status;
      },
      
      ajaxLoad: function (gameName) {
        var that = this;
        
        var status = $.ajax({
          url: '/js/games/'+gameName+'.js',
          dataType: 'text'
        });
        
        status.fail(function (jqXHR, textStatus) {
          Psc.Code.warning(textStatus);
        });
        
        status.done(function (data) {
          that.setProgram(new tiptoi.Program({code: data, name: gameName}));
        });
        
        return status;
      },
  
      // shortcoming für ein program
      createProgram: function (name, code) {
        return new tiptoi.Program({code: code, name: name});
      },
    
      // erstellt ein neues program mit erstem parameter name und dann dem code zeile bei zeile
      // setzt dieses direkt im object
      prg: function(name, codeline1, codeline2, codelinex) {
        var c = '';
        for (var i = 1; i<arguments.length; i++) {
          c += arguments[i]+"\n";
        }
        
        this.$$program = this.createProgram(name, c);
        return this.$$program;
      },
      
      getPlayedNumbers: function () {
        var numbers = [];
        $.each(this.$$played, function (i, sound) {
          Psc.Code.assertClass(sound, tiptoi.Sound, 'sound in played', 'GameTester::getPlayedNumbers');
          numbers[i] = sound.getNumber();
        });
        return numbers;
      },
  
      getPlayedContents: function () {
        var numbers = [];
        $.each(this.$$played, function (i, sound) {
          Psc.Code.assertClass(sound, tiptoi.Sound, 'sound in played', 'GameTester::getPlayedContents');
          numbers[i] = sound.getContent();
        });
        return numbers;
      },
  
      getPlayedSounds: function () {
        var numbers = [];
        $.each(this.$$played, function (i, sound) {
          Psc.Code.assertClass(sound, tiptoi.Sound, 'sound in played', 'GameTester::getPlayedSounds');
          numbers[i] = sound.toString();
        });
        return numbers;
      },
      
      toString: function() {
        return "[tiptoi.GameTester]";
      }
    }
  });
});