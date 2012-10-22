Joose.Class('Psc.UI.EffectsManager', {
  
  has: {
    //attribute1: { is : 'rw', required: false, isPrivate: true }
  },

  methods: {
    blink: function ($element, color, callback, time) {
      if (!color) color = '#880000';
      if (color === 'green') color = '#88fc4f';
      if (!time) time = 120;
      var oldColor = $element.css('background-color');
      
      var propsTo = {backgroundColor: color}, propsBack = {backgroundColor: oldColor};

      $element.animate(propsTo, time, function () {
        $element.animate(propsBack, time*2, callback);
      });
    },
    errorBlink: function ($element, callback) {
      if ($element.is('button.ui-button')) {
        return $element.effect('highlight', {color: '#cd0a0a'}, 1200, callback);
      } else {
        return this.blink($element, '#880000', callback, 200);
      }
    },
    successBlink: function ($element, callback) {
      if ($element.is('button.ui-button')) {
        return $element.effect('highlight', {color: '#88fc4f'}, 1200, callback);
      } else {
        return this.blink($element, 'green', callback, 200);
      }
    },
    disappear: function ($element, time, callback) {
      if (!time) time = 400;
      $element.fadeOut(time, callback);
    },
    toString: function() {
      return "[Psc.UI.EffectsManager]";
    }
  }
});