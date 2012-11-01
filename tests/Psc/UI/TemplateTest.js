define(['psc-tests-assert','Psc/UI/Template','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.Template");
  
  var setup = function () {
    var $template = $('<script type="x-jquery-tmpl"><span id="comments-count">${count} Comments</span></script>');
    $('#qunit-fixture').append($template);
    
    var template = new Psc.UI.Template({
      jQueryTemplate: $template
    });
    
    return {template: template, $template: $template};
  };

  test("acceptance", function() {
    setup(this);
    
    var $commentsCount = $('<span id="comments-count">7 Comments</span>');
    $('#visible-fixture').empty().append($commentsCount);
  
    this.template.replace($commentsCount, {count: 8});
    // weil das wirklich wirklich replaced
    $commentsCount = $('#comments-count');
    
    this.assertEquals('<span id="comments-count">8 Comments</span>', $commentsCount[0].outerHTML);
  });
});