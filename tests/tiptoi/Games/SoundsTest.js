define(['psc-tests-assert','tiptoi/Main','tiptoi/GameTester', 'tiptoi/Program', 'tiptoi/cpu','tiptoi/InputProvider', 'Psc/Code'], function() {
  
  
  module("Games Sound Test", {
    setup: function () {
      
    }
  });

  asyncTest("this.sounds is set", function() {
    var gameTester = new tiptoi.GameTester({
    });
    
    var program = gameTester.prg(
      'sounds1',
      
      'playSound( this.sounds.aTestSound )',
      'tiptoi.end()'
    );
    
    program.setSound('aTestSound', new tiptoi.Sound({content: 'i make a trembling noise', number: '1-TEST_0002'}));
    
    var status = gameTester.run();
    
    stop();
    status.progress(function (cpu) {
      Psc.Code.info('tiptoi progress');
      start();
    });
      
    status.done(function () {
      Psc.Code.info('gespielt wurde', gameTester.getPlayedSounds());
      this.assertEquals(['1-TEST_0002'], gameTester.getPlayedNumbers(), 'der test sound wurde abgespielt');
      start();
    });
  });
  
  asyncTest("common sounds are set and merged with own sounds", function () {
    var gameTester = new tiptoi.GameTester({}), program = gameTester.prg(
      'sounds merged',
      
      'playSound( this.sounds.aTestSound )',
      'playSound( this.sounds.gameButtonSound )',
      'tiptoi.end()'
    );
    
    program.setSound('aTestSound', new tiptoi.Sound({content: 'i make a trembling noise', number: '1-TEST_0002'}));
    
    var status = gameTester.run();
    
    status.done(function () {
      Psc.Code.info('gespielt wurde', gameTester.getPlayedSounds());
      this.assertEquals(['1-TEST_0002', '091104ak009'], gameTester.getPlayedNumbers());
      start();
    });
  });
});