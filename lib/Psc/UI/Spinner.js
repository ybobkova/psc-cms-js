define(['jquery','joose'], function ($, Joose) {
  Joose.Class('Psc.UI.Spinner', {
    /**
     * a veryvery Simple Spinner for ajaxLoading
     */
    
    has: {
      image: { is : 'rw', required: false, isPrivate: true, builder: 'initSpinner' },
      stack: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Array },
      container: { is : 'rw', required: false, isPrivate: true, init: null },
      imageSrc: { is : 'rw', required: false, isPrivate: true, init: '/img/cms/ajax-spinner-small.gif' }
    },
    
    after: {
      initialize: function (props) {
        if (!props.container) {
          this.$$container = $('body .spinner-container');
        }
      }
    },
  
    methods: {
      initSpinner: function () {
        return $('<span class="psc-ui-spinner"><img src="'+this.$$imageSrc+'" alt="loading..." /></span>');
      },
      // @param reference derjenige der den Spinner spinnen lassen will
      show: function (reference) {
        var that = this;
        
        this.$$stack.push(reference);
        
        if (this.$$container.length) { // do we have a container to show a spinner?
          this.$$image.hide();
          this.$$container.append(this.$$image);
        } else {
          this.$$container = false; // prevents from rechecking
        }
        
        this.$$image.fadeIn(100);
      },
      remove: function (reference) {
        this.$$stack.pop();
          
        if (!this.$$stack.length) {
          this.$$image.fadeOut(100);
        }
      },
      toString: function() {
        return "[Psc.UI.Spinner]";
      }
    }
  });
});