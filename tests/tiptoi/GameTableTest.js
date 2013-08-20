define(['psc-tests-assert', 'lodash', 'tiptoi/GameTable','tiptoi/Sound'], function(t, _) {
  
  module("tiptoi.GameTable");
  
  var setup = function (test) {
    return t.setup(test);
  };
  
  var createTable = function () {
    var gameTable = new tiptoi.GameTable({
      name: 'main',
      rows: [
            {"block": 1,"sound": new tiptoi.Sound({number: "2-STA_0623", content: "und das ist rot"}),"oid": [9999001,1]},
            {"block": 1,"sound": new tiptoi.Sound({number: "2-STA_0624", content: "Das ist weich"}),"oid": [9999001,1]},
            {"block": 1,"sound": new tiptoi.Sound({number: "2-STA_0625", content: "Das geh\u00f6rt einem Kind"}),"oid": [9999001,1]},
            {"block": 1,"sound": new tiptoi.Sound({number: "2-STA_0626", content: "Es ist das rote Hemd von Jasper"}),"oid": [9999001,1]},
            {"block": 2,"sound": new tiptoi.Sound({number: "2-STA_0627", content: "und das ist blau"}),"oid": [9999006,1]},
            {"block": 2,"sound": new tiptoi.Sound({number: "2-STA_0628", content: "Das finden Babies gem\u00fctlich"}),"oid": [9999006,1]},
            {"block": 2,"sound": new tiptoi.Sound({number: "2-STA_0629", content: "Das wird von Eltern geschoben"}),"oid": [9999006,1]},
            {"block": 2,"sound": new tiptoi.Sound({number: "2-STA_0630", content: "Es ist der Kinderwagen"}),"oid": [9999006,1]},
            {"block": 3,"sound": new tiptoi.Sound({number: "2-STA_0627", content: "und das ist blau"}),"oid": [9999004,1]},
            {"block": 3,"sound": new tiptoi.Sound({number: "2-STA_0631", content: "Das ist aus Stoff."}),"oid": [9999004,1]},
            {"block": 3,"sound": new tiptoi.Sound({number: "2-STA_0632", content: "Da sind gelbe Sterne drauf."}),"oid": [9999004,1]},
            {"block": 3,"sound": new tiptoi.Sound({number: "2-STA_0633", content: "Es ist die Europaflagge."}),"oid": [9999004,1]},
            {"block": 4,"sound": new tiptoi.Sound({number: "2-STA_0634", content: "und das ist wei\u00df"}),"oid": [9999005,1]},
            {"block": 4,"sound": new tiptoi.Sound({number: "2-STA_0635", content: "Das ist auch ein bisschen schwarz."}),"oid": [9999005,1]},
            {"block": 4,"sound": new tiptoi.Sound({number: "2-STA_0636", content: "Es ist ein Lebewesen."}),"oid": [9999005,1]},
            {"block": 4,"sound": new tiptoi.Sound({number: "2-STA_0637", content: "Es ist der Hund, der vor dem Denkmal sitzt."}),"oid": [9999005,1]}
    ]
    });
    
    return gameTable;
  };

  test("calculates Blocks correctly", function() {
    setup(this);
    var gameTable = createTable();
    
    this.assertEquals(4, gameTable.getBlocksNum());
    this.assertEquals(4, gameTable.getBlocksNum()); // cache
  });

  test("returns a Block with all rows", function() {
    setup(this);
    var gameTable = createTable();
    
    this.assertEquals([
        gameTable.rows[4],
        gameTable.rows[5],
        gameTable.rows[6],
        gameTable.rows[7]
      ],
      gameTable.getBlock(2)
    );
  });
  
  test("returns a random row", function () {
    setup(this);
    var gameTable = createTable();
    
    var row = gameTable.chooseNotYetUsedRandomRow();
    
    this.assertNotUndefined(row.block, 'block in row is defined');
    this.assertNotUndefined(row.sound, 'block in sound is defined');
    this.assertNotUndefined(row.oid, 'block in oid is defined');
  });

  test("returns a random row never twice", function () {
    var that = setup(this);
    var gameTable = createTable();
    var usedRows = [];
    var row;
    
    for (var i = 1, l = gameTable.rows.length; i <= l; i++) {
      row = gameTable.chooseNotYetUsedRandomRow();
      
      if (_.contains(usedRows, row)) {
        that.fail("Zeile wurde bereits vorher ausgegeben");
      } else {
        this.assertNotUndefined(row.sound);
        usedRows.push(row);
      }
    }
    
    // ab der letzten ist moep
    var lastRow = gameTable.chooseNotYetUsedRandomRow();
    this.assertTrue(!lastRow);
  });

  test("returns a random block never twice", function () {
    var that = setup(this);
    var gameTable = createTable();
    var usedBlocks = [];
    var block;
    
    for (var i = 1, l = gameTable.getBlocksNum(); i <= l; i++) {
      block = gameTable.chooseNotYetUsedRandomBlock();
      
      if (_.contains(usedBlocks, block)) {
        that.fail("Zeile wurde bereits vorher ausgegeben");
      } else {
        this.assertNotUndefined(block[0].sound);
        usedBlocks.push(block);
      }
    }
    
    // ab der letzten ist moep
    var lastBlock = gameTable.chooseNotYetUsedRandomBlock();
    this.assertTrue(!lastBlock);
  });
  
  //test("randomizes things", function () {
  //  expect(0);
  //  var indizes = [1,2,3,4,5,6,7,8];
  //  
  //  var shuffled = indizes.slice();
  //  
  //  shuffled.sort(function () {
  //    return 0.5 - Math.random();
  //  });
  //  
  //  console.log(indizes, shuffled);
  //});
});