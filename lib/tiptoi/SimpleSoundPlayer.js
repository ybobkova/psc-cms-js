define(['Psc/Code', 'tiptoi/Sound', 'Psc/Numbers', 'Psc/EventDispatching'], function() {
  Joose.Class('tiptoi.SimpleSoundPlayer', {
    
    does: [Psc.EventDispatching],
    
    has: {
      onPlay: {is: 'rw', required: true, isPrivate: true }
    },
    
    methods: {
      playSound: function (sound) {
        if (sound) {
          sound = this.normalizeSound(sound);
          this.$$eventManager.triggerEvent('play-sound', {}, [sound]);
          
          (this.$$onPlay).apply(this, [[sound]]);
        }
      },
        
      playSounds: function (sounds) {
        if (sounds && sounds.length) {
          sounds = this.normalizeSounds(sounds);
          
          this.$$eventManager.triggerEvent('play-sounds', {}, [sounds]);
          (this.$$onPlay).apply(this, [sounds]);
        }
      },

      playRandomSound: function (sounds) {
        if (sounds && sounds.length) {
          sounds = this.normalizeSounds(sounds);
          
          var index = Psc.Numbers.randomInt(0, sounds.length-1);
          var sound = sounds[index];
          
          this.$$eventManager.triggerEvent('play-sound', {}, [sound]);
          (this.$$onPlay).apply(this, [sounds]);
        }
      },
      
      normalizeSounds: function (sounds) {
        var cSounds = [];
        for (var i = 0, l = sounds.length; i<l; i++) {
          cSounds.push(this.normalizeSound(sounds[i]));
        }
        return cSounds;
      },
      
      normalizeSound: function (sound) {
        if (Psc.Code.isArray(sound) && sound.length === 2) {
          return new tiptoi.Sound({content: sound[0], number: sound[1]});
        } else if(typeof sound === 'string') {
          return new tiptoi.Sound({content: sound, number: null});
        } else if (Psc.Code.isInstanceOf(sound, tiptoi.Sound)) {
          return sound;
        } else if (typeof sound === 'object') {
          return new tiptoi.Sound(sound);
        } else {
          return new tiptoi.Sound({content: sound, number: null}); 
        }
      }
    }
  });
});