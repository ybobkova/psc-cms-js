define(['hogan'], function(Hogan) {
  var t = {
    'SCE.Components.Teaser' : new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"row-fluid\">");_.b("\n" + i);_.b("  <div class=\"span4\">");_.b(_.v(_.d("headline.label",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("  <div class=\"span8\">");_.b(_.t(_.d("headline.input",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("<div class=\"row-fluid\">");_.b("\n" + i);_.b("    <div class=\"span4\">");_.b(_.v(_.d("text.label",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("    <div class=\"span2\">");_.b(_.t(_.d("image.input",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("    <div class=\"span6\">");_.b(_.t(_.d("text.input",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("<div class=\"row-fluid\">");_.b("\n" + i);_.b("  <div class=\"span4\">");_.b(_.v(_.d("link.label",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("  <div class=\"span8\">");_.b(_.t(_.d("link.input",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("</div>");return _.fl();;}),
    'SCE.widget' : new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"widget ui-widget ui-widget-content ui-helper-clearfix ui-corner-all\" style=\"margin-bottom: 5px;\">");_.b("\n" + i);_.b("  <h3 class=\"widget-header ui-helper-reset ui-state-default ui-corner-all\" style=\"padding: 0.5em 0.5em 0.5em 0.7em;\">");_.b("\n" + i);_.b("    <span class=\"ui-icon ui-icon-close\" data-bind=\"click: close\" style=\"float: right; cursor: pointer;\"></span>");_.b(_.v(_.f("headline",c,p,0)));_.b("\n" + i);_.b("  </h3>");_.b("\n" + i);_.b("  ");_.b("\n" + i);_.b("  <div class=\"widget-content\" style=\"padding: 1.1em;\">");_.b(_.t(_.f("content",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("</div>");return _.fl();;})
  },
  r = function(n) {
    var tn = t[n];
    return function(c, p, i) {
      return tn.render(c, p || t, i);
    };
  };
  return {
    'SCE.Components.Teaser' : r('SCE.Components.Teaser'),
    'SCE.widget' : r('SCE.widget')
  };
});
