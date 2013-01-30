define(['jquery', 'joose'<%= _.reduce(deps, function (js, dep) {
    return js + ", '"+(dep.replace(/\./g, '/'))+"'";
  }, '')%>], function ($, Joose) {
  Joose.Class('<%= className %>', {
<%= isa ? '    isa: '+isa+",\n" : '' %><%= traits ? "\n    does: ["+traits+"]," : '' %>
    
    has: {
      //propertyName: { is: 'rw', required: true, isPrivate: true},
    },
    
    after: {
      initialize: function () {
        <% if (isa === 'Psc.UI.WidgetWrapper' || isa === 'Psc.UI.jqx.WidgetWrapper') {
        %>this.checkWidget();
        this.linkWidget();<% } %>
      }
    },
    
    methods: {
      toString: function () {
        return '[<%= className %>]';
      }
    }
  });
});