define(['Psc.Numbers', 'Psc/Code'], function() {
  Joose.Class('tiptoi.GameTable', {
    
    has: {
      rows: { is : 'rw', required: true, isPrivate: false}, // <- its not private!
      name: { is : 'rw', required: true, isPrivate: true },
      blocksNum: { is : 'rw', required: false, isPrivate: true, init: false },
      
      rowsLeft: { is : 'rw', required: false, isPrivate: true },
      blockNumsLeft: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function () {
        Psc.Code.assertArray(this.rows, 'this.rows', 'GameTable.chooseRandomBlock()');
        this.$$rowsLeft = this.shuffle(this.rows.slice()); // copy n shuffle
        
      }
    },
    
    methods: {
      /**
       * Wählt eine Zeile aus und gibt diese zurück
       *
       */
      chooseNotYetUsedRandomRow: function () {
        return this.$$rowsLeft.pop();
      },
      
      chooseNotYetUsedRandomBlock: function () {
        if (!this.$$blockNumsLeft) {
          this.$$blockNumsLeft = [];
          
          for (var i=1, l=this.getBlocksNum(); i <= l; i++) {
            this.$$blockNumsLeft.push(i);
          }
        
          this.shuffle(this.$$blockNumsLeft);
        }
        
        var num = this.$$blockNumsLeft.pop();
        // @TODO out of bounds
        
        if (num !== undefined) {
          return this.getBlock(num);
        }
      },
      
      chooseRandomBlock: function () {
        var blocks = this.getBlocksNum();
        var blockNum = this.getRandomInt(1, blocks);
        
        return this.getBlock(blockNum);
      },
      
      chooseRandomRow: function () {
        var i = this.getRandomInt(0, this.rows.length-1);
        
        return this.rows[i];
      },
      
      /**
       * @param int num 1-basierend
       */
      getBlock: function (num) {
        num = Math.max(1,num);
        var blocks = this.getBlocksNum(), block = [];
        if (blocks < num) {
          throw new Psc.Exception('Den Block '+num+' gibt es im '+this.getName()+'Table nicht');
        }
        //Psc.Code.info('Suche nach Block: '+num);
  
        $.each(this.rows, function (i, row) {
          if (row.block === num) {
            block.push(row);
          }
        });
        
        return block;
      },
      
      getBlocksNum: function () {
        if (this.$$blocksNum === false) {
          var that = this, maxNum = 0;
          $.each(this.rows, function (i, row) {
            Psc.Code.assertInteger(row.block, 'row['+i+'].block in GameTable '+that.getName(), 'GameTable.getBlocksNum()');
            var num = row.block;
            maxNum = Math.max(num, maxNum);
          });
          this.$$blocksNum = maxNum;
        }
        
        return this.$$blocksNum;
      },
      
      getRandomInt: function (min, max) {
        return Psc.Numbers.randomInt(min, max); // dpi random generator
      },
      
      toString: function() {
        return "[tiptoi.GameTable]";
      },
  
      shuffle: function(array) {
        array.sort(function () {
          return 0.5 - Math.random();
        });
        return array;
      }
    }
  });
});