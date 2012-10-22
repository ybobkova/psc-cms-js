define(['tiptoi/Main','tiptoi/ProgramRunner', 'tiptoi/Program', 'tiptoi/cpu','tiptoi/InputProvider', 'Psc/Code'], function() {
  var tiptoiMain, main, programRunner, program1, played = [];
  
  module("tiptoi.Main", {
    setup: function () {
        programRunner = new tiptoi.ProgramRunner({
         soundPlayer: new tiptoi.SimpleSoundPlayer({
          onPlay: function (sounds) {
            $.each(sounds, function (i, sound) {
              played.push(sound.getContent());
            });
          }
        }),
        inputProvider: new tiptoi.InputProvider({
          sequence: [77]
        })
      });

    }, teardown: function () {
      played = []; // warum muss das in teardown und geht nicht in setup?
    }
  });
  
  var p = function (code) {
    return new tiptoi.Program({code: code});
  };
  
  var pCode = function() {
    var c = '';
    for (var i = 0; i<arguments.length; i++) {
      c += arguments[i]+"\n";
    }
    return p(c);
  };

    /* okay:
      was passiert alles in einem program?
    
      - es werden Sounds abgespielt
      - es muss auf input gewartet werden
          das ist nicht ganz untricky, weil wir nicht synchron blocken können (und wollen)
          synchron würde das problem sein, dass dann der browser nix mehr machen kann (was bei interactivem Input blöd ist ;))
          deshalb müssen wir waitForInput(function () { ... machen})
          bis jetzt war meine Idee, dass immer nach dem schließen des Blocks von waitForInput kein Code mehr kommen darf,
          mal sehen ob ich das durchziehen kann. man könnte die Syntax waitForInput(function () {
          zu waitForInput({ vereinfachen
      
      - es müssen daten aus der Tabelle ausgelesen werden
          da tables etwas tricky sind, habe ich mich dazu entschieden eine verbose datenstruktur:
          table = [
            {head1: wert11, head2: wert12}, // zeile 1 (index 0)
            {head1: wert21, head2: wert21}  // zeile 2 (index 1)
            {head1: wert31, head2: wert31}
          ]
          zu benutzen. Das ist blöd von Hand zu bauen, wir können aber den Table aus dem CMS so oder so automatisiert umwandeln
          
          und der Zugriff wird richtig gut:
          table.rows[1]['number']
          oder table.rows[1].number
          
      - play a Random Sound out of Table PositiveFeedbackTable
      
      vll machen wir
      positiveFeedbackTable.playRandomSound();
      var row = mainTable.chooseRandomRow();
      
      playSound(row.number);
      
      - A.contains(haystack, needle)
        weil man lesen würde: does haystack contain needle ? also in präfix-schreibeise contains(haystack, needle)
    
    */

  asyncTest("a program can play sounds", function () {
    $.when( programRunner.run(p(
      "playSound('2-TEST-001');"+
      "tiptoi.end()"
      ))
    ).then(function () {
      assertEquals(["2-TEST-001"], played);
      start();
    }, function (error) {
      fail("program failed");
      start();
    });
  });
  
  asyncTest("a program can have sounds", function () {
    var program = new tiptoi.Program({
      code: "not necessary",
      name: "my label"
    }), sound;
    
    program.setSound('aPlaceHolder', sound = new tiptoi.Sound({number: '2-STA_0596', content: 'Die Universität'}));
    
    assertEquals({aPlaceHolder: sound}, program.getSounds());
    start();
  });

  asyncTest("a program can have complex code", function () {
    var status = programRunner.run(p(
      "var count = 0;"+
      "if (count === 0) {"+
      "  playSound('2-TEST-002');"+
      "} else {"+
      "  playSound('2-TEST-001');"+
      "}"+
      "tiptoi.end()"
    ));
    
    status.done(function () {
      assertEquals(['2-TEST-002'], played);
      start();
    });
  });

  asyncTest("a program can wait for input", function () {
    var log = '';
    
    // ich verstehe nicht, warum ich hier mir einen eigenen programmrunner bauen muss,
    // weil wenn ich die tests hintereinander laufen lasse hat dieser immer eine leere input sequence
    var programRunner = new tiptoi.ProgramRunner({
         soundPlayer: new tiptoi.SimpleSoundPlayer({
          onPlay: function (sounds) {
            $.each(sounds, function (i, sound) {
              played.push(sound.getContent());
            });
          }
        }),
        inputProvider: new tiptoi.InputProvider({
          sequence: [77]
        })
    });
    
    var status = programRunner.run(p(
      "tiptoi.waitForInput(function(oid) {\n"+
        "playSound('i waited for '+oid);\n"+
        "tiptoi.end()"+
      "});\n"+
      
      "playSound('this should not be allowed'); \n"
    ));
    
    status.progress(function (cpu) {
      assertInstanceOf(tiptoi.cpu, cpu, 'notify param is a tiptoi.tiptoi instance');
      log += 'yay up it goes';
    });
    
    status.done(function () {
      assertEquals(['this should not be allowed', 'i waited for 77'], played);
      
      assertEquals(log, 'yay up it goes');
      start();
    });
  });

  asyncTest("tiptoi triggers events while waiting", function () {
    var input = false, waiting = false;
    
    var status = programRunner.run(p(
      "tiptoi.waitForInput(function() {\n"+
        "tiptoi.end()"+
      "});\n"
    ));
    
    status.progress(function (cpu) {
      cpu.on('tiptoi-waiting-for-input', function (e) {
        waiting = true;
      });

      cpu.on('tiptoi-input-given', function (e, inputType, inputValue) {
        assertEquals('OID', inputType);
        input = inputValue;
      });
      
    });
    
    status.done(function () {
      assertTrue(waiting,'tiptoi-waiting-for-input was triggered');
      assertEquals(77, input,'tiptoi-input-given was triggered');
      start();
    });
  });
  
  asyncTest("a program can have a timer", function () {
    var log = '';
    var played = [];
    
    var programRunner = new tiptoi.ProgramRunner({
         soundPlayer: new tiptoi.SimpleSoundPlayer({
          onPlay: function (sounds) {
            $.each(sounds, function (i, sound) {
              played.push(sound.getContent());
            });
          }
        }),
        inputProvider: new tiptoi.InputProvider({
          sequence: [77]
        })
    });
    
    var status = programRunner.run(pCode(
      "var timer = tiptoi.startTimer(1);",
      "timer.hasRunOut(function() {",
      "  playSound('timer ran out');",
      "  tiptoi.end();",
      "});",
      "playSound('will be played before');"
    ));
    
    status.done(function () {
      assertEquals(['will be played before', 'timer ran out'], played);
      start();
    });
    
    status.fail(function (e) {
      fail("runner rejected: "+e.message);
      start();
    });
  });
  
  asyncTest("a program has the A helper", function () {
    var status = programRunner.run(pCode(
      "var oids = [9999001, 9999002, 9999005];",
      "if (A.contains(oids, 9999002)) {",
      "  playSound('contains');",
      "} else {",
      "  playSound('contains-not');",
      "}",

      "if (A.contains(oids, 9999007)) {",
      "  playSound('contains');",
      "} else {",
      "  playSound('contains-not');",
      "}",
      
      "tiptoi.end()"
    ));

    status.done(function () {
      assertEquals(['contains','contains-not'], played);
      start();
    })
  });

  asyncTest("the program A helper removes elements from arrays", function () {
    var status = programRunner.run(pCode(
      "var oids = [9999001, 9999002, 9999002, 9999005];",
      // remove first occurence
      "A.remove(oids, 9999002);",

      "if (A.contains(oids, 9999002)) {",
      "  playSound('1:contains');",
      "} else {",
      "  playSound('1:contains-not');",
      "}",
      
      // remove second occurence
      "A.remove(oids, 9999002);",
      
      "if (A.contains(oids, 9999002)) {",
      "  playSound('2:contains');",
      "} else {",
      "  playSound('2:contains-not');",
      "}",
      
      "tiptoi.end()"
    ));

    status.done(function () {
      assertEquals(['1:contains','2:contains-not'], played);
      start();
    })
    
    status.fail(function(e) {
      console.log(e);
    });
  });
    
  asyncTest("a program can read sounds table", function () {
    var mainTable = [
      {number: '1-TEST_001', sound: 'Was ist grün und lebt auf dem Baum?', correctOID: 9999004},
      {number: '1-TEST_004', sound: 'Wieviele Mäuse kann ein Bussard verspeisen?', correctOID: 9999004}
     ];
      
      
    var program = pCode(
      "playSound(mainTable.rows[1].number);",
      "playSound(mainTable.rows[0].number);",
      "tiptoi.end()"
    );
      
    program.setTable('main', mainTable);
    
    var status = programRunner.run(program);
    
    status.done(function () {
      assertEquals(['1-TEST_004', '1-TEST_001'], played);
      start();
    });
    
  });
  
  asyncTest("program can make syntax errors", function () {
    var status = programRunner.run(pCode(
      'thisFunctionDoesNotExists();'
    ));
    
    status.done(function () {
      fail('done should not be called on syntax error');
      start();
    });

    status.fail(function (error) {
      assertNotUndefined(error, 'some error message is set');
      ok('fail is called');
      start();
    });
  });

  asyncTest("program should be given to run()", function () {
    try {
      programRunner.run('bullshit');
      
    } catch (e) {
      start();
      ok("caught");
      return;
    }
    
    fail("not caught");
    start();
  });
});