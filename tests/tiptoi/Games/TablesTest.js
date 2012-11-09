define(['psc-tests-assert','tiptoi/Main','tiptoi/GameTester', 'tiptoi/Program', 'tiptoi/cpu','tiptoi/InputProvider', 'Psc/Code','tiptoi/Sound'], function(t) {
  
  module("tiptoi/Games/Tables Test");
  
  var setup = function(test) {
    return t.setup(test);
  };

  asyncTest("tables have a choose random row function", function() {
    var that = setup(this);
    var gameTester = new tiptoi.GameTester({
    });

    var mainTable = [
      {sound: new tiptoi.Sound({number: '1-TEST_001', content: 'Was ist grün und lebt auf dem Baum?'}), correctOID: 9999004}
      //{sound: new tiptoi.Sound({number: '1-TEST_004', content: 'Wieviele Mäuse kann ein Bussard verspeisen?'}), correctOID: 9999004}
     ];
    
    var program = gameTester.prg(
      'chooseRandomRowProgram',
      
      'var row = mainTable.chooseRandomRow();',
      'playSound(row.sound);',
      'tiptoi.end()'
    );
    
    program.setTable('main', mainTable);
    
    var status = gameTester.run();
      
    status.done(function () {
      Psc.Code.info('gespielt wurde', gameTester.getPlayedSounds());
      that.assertEquals(['1-TEST_001'], gameTester.getPlayedNumbers(), 'der random sound aus der row wurde abgespielt');
      start();
    });
  });
});