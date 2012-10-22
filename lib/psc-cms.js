/**
 * Psc CMS JS Bootstrap
 *
 * this creates a small jQuery-Plugin (a global instance $.psc) which helps you with asynchronous loading of the main class and 
 * gives you some use-presences to load classes.
 *
 * for example if you want to require jquery-ui you would use the builder:
 * use: [$psc.getUsePresence('jquery-ui')]
 *
 * versions are not yet supported
 */
define(['jquery', 'joose'], function($, Joose) {
  
  $.psc = {
    deferred: $.Deferred(),
    presence: {},
    
    loaded: function() {
      return this.deferred.promise();
    },
    
    resolve: function(main) {
      this.deferred.resolve(main);
    },

    reject: function(error) {
      this.deferred.reject(error);
    },
   
    // in tests 
    reset: function() {
      this.deferred = $.Deferred();
    },
    
    /**
     * Eine Registry für Objekte die geladen werden (praktisch für Joose Namespace Depend)
     * 
     * @return bool
     */
    getPresence: function (name) {
      return this.presence.name ? true : false;
    },
    
    /**
     * Setzt ob name geladen wurde
     */
    setPresence: function (name) {
      this.presence.name = true;
    },
    
    getUsePresence: function (type) {
      if (type === 'jquery-ui') {
        return {
          type: 'javascript',
          token       : '/vendor/jquery-ui/jquery-ui-1.8.22.custom.patched.js',
          presence    : function () {
            return $.ui;
          }
        };
      } else if(type === 'jquery-ui-i18n') {
        return {
          type: 'javascript',
          token       : '/vendor/jquery-ui/jquery-ui-i18n.custom.js',
          presence    : function () {
            return $.datepicker && $.datepicker.regional && $.datepicker.regional.de;
          }
        };
      } else if(type === 'jqx') {
        return {
          type: 'javascript',
          token       : '/vendor/jqwidgets/jqx-all.js',
          presence    : function () {
            return $.jqx;
          }
        };
      } else if(type === 'ui.paging') {
        return {
          type: 'javascript',
          token       : '/vendor/webforge/ui.paging.js',
          presence    : function () {
            return $.pscUI.paging;
          }
        };
      } else if(type === 'jquery-tmpl') {
        return {
          type: 'javascript',
          token       : '/vendor/jquery/jquery.tmpl.min.js',
          presence    : function () {
            return $.tmpl;
          }
        };
      } else if(type === 'ace') {
        return {
          type: 'javascript',
          token       : '/vendor/ace/ace.js',
          presence    : function () {
            return $.jqx;
          }
        };
      } else {
        return undefined;
      }
    }
  };
});