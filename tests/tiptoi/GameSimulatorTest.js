define(['psc-tests-assert','jquery-simulate','tiptoi/GameSimulator','tiptoi/ProgramRunner','tiptoi/SimpleSoundPlayer','tiptoi/InteractiveInputProvider','Psc/EventManager','tiptoi/HTMLOutput'], function(t) {
  
  var $startButton = $('<button class="psc-cms-ui-button psc-guid-4fe1b397df398 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-play"></span><span class="ui-button-text">Spiel starten</span></button>').button({icons: {primary: 'ui-icon-play'}});
  var $output = $('<fieldset style="font-size: 80%" class="ui-corner-all ui-widget-content psc-cms-ui-group"><legend>Game Output Log</legend><div class="content">Auf "Spiel Starten" klicken, um das Spiel zu simulieren.<br>Die Ausgabe des tiptoi wird hier angezeigt.<br>Während des Spieles kann auf die Buttons / Kästchen im OID Layout geklickt werden, um zu "tippen".</div></fieldset>');
  var $fixture = $('#visible-fixture');
  var $oidLayout = $('<div class="oid-layout-container"></div>');
  
  module("tiptoi.GameSimulator");
  
  var setupHTML = function (test) {
    $fixture
      .empty()
      .append($output)
      .append($startButton);
    
    var gameSimulator = new tiptoi.GameSimulator({
      startButton: $startButton,
      output: $output,
      layout: $oidLayout
    });
    
    t.setup(test);
    
    return gameSimulator;
  };

  asyncTest("acceptance", function() {
    var that = this;
    var gameSimulator = setupHTML(this), evm = gameSimulator.getEventManager();
    var listening = false, gotInput = false, gotStart = false, gotEnd = false;
    
    gameSimulator.setProgram(new tiptoi.Program({
        code:
          "playSound('game start')\n"+
          "tiptoi.waitForInput(function(oid) {\n"+
          "  playSound('i waited for '+oid);\n"+
          "  tiptoi.end()"+
          "});\n",
        name: 'runsAndWaitsForOneInput'
      })
    );
    
    evm.setLogging(true);
    
    // wenn der interactive input provider das hier triggered, erwartet er, dass geklickt wird
    evm.on('input-provider-listening', function () {
      
      var oid = 17121;
      
      that.assertEquals(
        "Spiel „runsAndWaitsForOneInput“ startet"+
        "„game start“ (null)"+
        "tiptoi wartet auf input...",
        
        $output.text(),
        'text hält bei wartet auf input...'
      );
      
      listening = true;
      stop();
      $oidLayout.trigger('tiptoi-tip', [{'oid': oid}]);
      
      start();
    });
    
    evm.on('input-provider-got-input', function () {
      gotInput = true;
    });
    
    evm.on('tiptoi-start', function (e, cpu, program) {
      gotStart = true;
    });

    evm.on('tiptoi-end', function (e, cpu, program) {
      gotEnd = true;
      
      start();
      
      // expect: outputbox hat die beidne playsounds
      
      // assertions nach allem:
      that.assertTrue(listening, 'Input provider listening was triggered from input-provider');
      that.assertTrue(gotInput, 'got Input was triggered from input-provider');
      that.assertTrue(gotStart, 'tiptoi Program wurde gestartet');
      that.assertTrue(gotEnd, 'tiptoi Program lief erfolgreich durch');
      
      that.assertEquals(
        "Spiel „runsAndWaitsForOneInput“ startet"+
        "„game start“ (null)"+
        //"tiptoi wartet auf input..."+
        "getippt wurde: 17121 undefined"+
        "„i waited for 17121“ (null)"+
        "Spiel beendet",
        
        $output.text(),
        
        'text ist komplett'
      );
    });
    
    
    // starten:
    $startButton.simulate('click');
    
  });
  
  test("flashing is going on my nerves", function() {
    t.setup(this);

    var $el = $('<p>tiptoi waiting for input</p>').css('color', '#000000');
    $('#visible-fixture').html($el);
    
    $el.effect('pulsate', [300], 2500);
    
    setTimeout(function () {
      $el.stop(true).queue(function (e) {
        $el.css('opacity',1);
      });
    }, 600); 

    this.assertTrue(true, "the test is passed");   
  });
});