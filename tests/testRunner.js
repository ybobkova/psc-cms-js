define(["require", "jquery", "psc-cms", "qunit", "joose", "jqwidgets-global", "jqwidgets"], function (require, $) {
    QUnit.config.autostart = false;
    QUnit.config.reorder = false;
  
    QUnit.load(); // because qunit cannot attach to window on load when its loaded asynchronously
  
    return {
      run: function (test) {
        require(["../tests/"+test.replace(/\./g, '/')], function () {
          QUnit.start();
        });
      }
    };
});
