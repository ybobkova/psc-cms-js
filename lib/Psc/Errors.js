/*global _errs: true */
define(['jquery'], function ($) {

  return function () {

   /**
    * Use this to fully handle errors in low level
    * 
    * @param Error err
    * @param object contextInfo
    */
    this.handle = function (err, contextInfo) {
     // use errorception handling if avaible
      if (typeof _errs === 'object') {
        _errs.meta = $.extend(_errs.meta || {}, contextInfo);
      
        _errs.push(err);
      }

      throw err;
    };

    this.context = function(key, value) {
      if (typeof _errs === 'object') {
        var props = {};
        props[key] = value;

        _errs.meta = $.extend(_errs.meta || {}, props);
      }
    };
  };

});