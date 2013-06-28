define(function () {
  
  return function (options, playSound, playQuestionSound, playSounds, playRandomSound, tiptoi, A, random, chooseRandom, debug, sounds, gameButtonSound, rightSound, tusch, wrongSound, pause, tickingSound) {
    var that = this, lastWait, lastQuestion;
    
    if (!A) {
      throw "A is not defined";
    }

    if (!tiptoi) {
      throw "tiptoi is not defined";
    }

    if (!options.mainTable && options.mainTable.isTable) {
      throw "options.mainTable ist not defined";
    }

    if (!options.mainTable && options.mainTable.isTable) {
      throw "options.mainTable ist not defined";
    }

    if (!that.sounds) {
      throw "this.sounds is not defined";
    }

    playSounds( that.sounds.start );

    tiptoi.end();

  };

});