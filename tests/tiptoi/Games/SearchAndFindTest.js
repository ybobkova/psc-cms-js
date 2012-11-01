define(['psc-tests-assert','tiptoi/Main','tiptoi/GameTester', 'tiptoi/Program', 'tiptoi/cpu','tiptoi/InputProvider', 'Psc/Code'], function(t) {
  
  
  module("tiptoi.SearchAndFind", {
    setup: function () {
      
    }
  });

  asyncTest("SearchAndFind SimpleRun", function() {
    var gameTester = new tiptoi.GameTester({
      sequence: [11011, 11011, 11011, 11011, 11011]
    });
    
    $.when(gameTester.ajaxLoad('SearchAndFind')).then(function() {
      gameTester.getProgram()
        .setTable('main',
                  [
                   {sound: new tiptoi.Sound({number: '2-STA_0596', content: 'Die Universität'}), correctOIDs: [11011]},
                   {sound: new tiptoi.Sound({number: '2-STA_0597', content: 'Das Aquarium'}), correctOIDs: [11012]},
                   {sound: new tiptoi.Sound({number: '2-STA_0598', content: 'Das Rathaus'}), correctOIDs: [11013]},
                   {sound: new tiptoi.Sound({number: '2-STA_0615', content: 'Die Fußgängerzone'}), correctOIDs: [11025,11041,11044,11051]}
                  ]
        )
        .setSoundsList('start', [
            ['Game-Button-Sound', '091104ak009'],
            ['0,3 sec. Silent-Pause', '091104ak000'],
            ['Jetzt spielen wir ein Suchspiel.','2-STA_0618']
          ])
        .setSoundsList('lastSounds', []);
      
      var status = gameTester.run();
      
      status.progress(function (cpu) {
        Psc.Code.info('tiptoi progress');
      });
      
      status.done(function () {
        Psc.Code.info('gespielt wurde'+"\n", gameTester.getPlayedSounds().join("\n"));
        this.assertTrue(gameTester.getPlayed().length > 4);
        start();
      });

      status.fail(function (error) {
        Psc.Code.error(error);
        fail('program funktioniert nicht');
        start();
      });
    });
  });
});