/*globals alert:true*/
define(
  ['tiptoi/StringOutput', 'tiptoi/HTMLOutput','tiptoi/ProgramRunner', 'tiptoi/SimpleSoundPlayer','tiptoi/InteractiveInputProvider',
   'Psc/EventManager', 'Psc/Code', 'Psc/EventDispatching'
  ], function () {
  
  Joose.Class('tiptoi.GameSimulator', {
    
    does: [Psc.EventDispatching],
    
    has: {
      
      // kann entweder ein jQuery Objekt sein mit der Box wo das html appended werden soll oder
      // ein tiptoi.StringOutput sein
      output: { is : 'rw', required: true, isPrivate: true },
      
      // layout ist required wenn kein runner übergeben wird
      runner: { is : 'rw', required: false, isPrivate: true },
      startButton: { is : 'rw', required: true, isPrivate: true },
      
      // das aktuelle promise des laufenden Programs
      runStatus: {is : 'rw', required: false, isPrivate: true },
      
      // das program, welches beim klicken des start buttons ausgeführt werden soll
      program: {is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function (props) {
        
        if (!props.runner) {
          if (!props.layout) {
            throw new Psc.Exception('Wenn kein runner an GameSimulator übergeben wird, muss layout (jquery container mit den buttons) übergeben werden');
          }
          
          this.$$runner = new tiptoi.ProgramRunner({
            eventManager: this.getEventManager(),
          
            inputProvider: new tiptoi.InteractiveInputProvider({
              widget: props.layout,
              eventManager: this.getEventManager()
            })
          });
        }
        
        if (!Psc.Code.isInstanceOf(props.output, tiptoi.StringOutput)) {
          this.$$output = new tiptoi.HTMLOutput({
            widget: props.output,
            eventManager: this.getEventManager()
          });
        }
        
        this.attachHandlers();
      }
    },
    
    methods: {
      attachHandlers: function () {
        var that = this, evm = this.$$eventManager;
        
        // der Start button runnt ein neues Programm
        this.$$startButton.on('click', function (e) {
          e.preventDefault();
          
          that.reset();
          
          // wir speichern das promise
          try {
            that.setRunStatus(
              that.getRunner().run(that.createProgram())
            );
          } catch (err) {
            Psc.Code.Error(
              err.message+"\n"+
              'Möglicherweise fehlen Sounds, die im Spiel verwendet werden oder der Program Code selbst hat einen Fehler.'+"\n\n"
            );
          }
        });
      },
      
      reset: function () {
        this.getOutput().reset();
        
        if (this.$$runStatus) {
          this.$$runStatus.reject('reset von GameSimulator');
        }
      },
      
      /**
       * Wird aufgerufen, wenn der Start-Button geklickt wird und gibt das Program zurück, welches ausgeführt werden soll
       */
      createProgram: function() {
        return this.$$program;
      },
      
      setRunStatus: function(status) {
        this.$$runStatus = status;
        
        // wir hängen uns für den fehlerfall dran:
        status.fail(function (error) {
          alert(
                "Es befindet sich ein Fehler im Spiel. Es kann auch sein, dass dies ein Interner Fehler ist. Fehlermeldung:\n\n"+
                error.message+"\n"
              );
        });
        
      },
      
      toString: function() {
        return "[tiptoi.GameSimulator]";
      }
    }
  });
});