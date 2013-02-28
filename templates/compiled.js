define(['hogan'], function(Hogan) {
	var partials = {};
	var templates = {};
	
		partials["SCE.widget"] = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"widget ui-widget ui-widget-content ui-helper-clearfix ui-corner-all\" style=\"margin-bottom: 5px;\">");_.b("\n" + i);_.b("  <h3 class=\"widget-header ui-helper-reset ui-state-default ui-corner-all\" style=\"padding: 0.5em 0.5em 0.5em 0.7em;\">");_.b("\n" + i);_.b("    <span class=\"ui-icon ui-icon-close\" data-bind=\"click: close\" style=\"float: right; cursor: pointer;\"></span>");_.b(_.v(_.f("headline",c,p,0)));_.b("\n" + i);_.b("  </h3>");_.b("\n" + i);_.b("  ");_.b("\n" + i);_.b("  <div class=\"widget-content\" style=\"padding: 1.1em;\">");_.b(_.t(_.f("content",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("</div>");return _.fl();;});
	
	for (var id in partials) {
		templates[id] = (function(id) {
			return function(context) {
				return partials[id].render(context, partials);
			}
		})(id);
	}

	return templates;
});
