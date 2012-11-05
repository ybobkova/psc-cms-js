define(['jquery'], function ($) {
  /**
   * wird der timer gestoppet wird das interne deferred resolved
   * ranOut wird rejected
   *
   * wird ein timer neu gestartet obwohl schon gestartet wird der "alte" gestoppt, wenn noch nicht ausgelaufen
   */
  Joose.Class('tiptoi.Timer', {
    
    has: {
      deferred: { is : 'rw', required: false, isPrivate: true },
      timeout: { is : 'rw', required: false, isPrivate: true },
      seconds: { is : 'rw', required: true, isPrivate: true }
    },
    
    methods: {
      /**
       * @return time in ms
       */
      getTime: function () {
        return this.$$seconds * 1000;
      },
      
      start: function () {
        this.stop();
        var d = $.Deferred();
        this.$$deferred = d;
        
        this.$$timeout = window.setTimeout(function () {
          d.reject(); // hasRunOut
        }, this.getTime());
        
        return d.promise();
      },
      
      /**
       * @param function
       */
      hasRunOut: function(runOutLogic) {
        if (this.$$deferred) {
          this.$$deferred.fail(runOutLogic);
        }
      },
      
      stop: function() {
        if (this.$$deferred) {
          window.clearTimeout(this.$$timeout);
          this.$$deferred.resolve();
        }
      },
      
      toString: function() {
        return "[tiptoi.Timer]";
      }
    }
  });
});