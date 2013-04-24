define(['hogan'], function(Hogan) {
	var partials = {};
	var templates = {};
	
	partials["TEST.Other.Template"] = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"row-fluid\">");_.b("\n" + i);_.b("  <div class=\"span4\">");_.b(_.v(_.d("headline.label",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("  <div class=\"span8\">");_.b(_.t(_.d("headline.input",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("<div class=\"row-fluid\">");_.b("\n" + i);_.b("    <div class=\"span4\">");_.b(_.v(_.d("text.label",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("    <div class=\"span2\">");_.b(_.t(_.d("image.input",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("    <div class=\"span6\">");_.b(_.t(_.d("text.input",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("<div class=\"row-fluid\">");_.b("\n" + i);_.b("  <div class=\"span4\">");_.b(_.v(_.d("link.label",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("  <div class=\"span8\">");_.b(_.t(_.d("link.input",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("</div>");return _.fl();;});
	
	for (var id in partials) {
		templates[id] = (function(id) {
			return function(context) {
				return partials[id].render(context, partials);
			}
		})(id);
	}

	return templates;
});
