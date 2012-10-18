Joose.Class('Psc.UI.TableBuilder', {
  
  has: {
    html: { is : 'rw', required: false, isPrivate: true, init: '' },
    rowOpen: { is : 'rw', required: false, isPrivate: true, init: false },
    tableOpen: { is : 'rw', required: false, isPrivate: true, init: false }
  },
  
  after: {
    initialize: function () {
      //this.start();
    }
  },
  
  methods: {
    start: function (c) {
      c = $.extend({}, {
        classes: []
      }, c);

      this.$$html = '<table cellpadding="0" cellspacing="0"';
      if (c.classes.length) {
        this.$$html += ' class="'+c.classes.join(' ')+'"';
      }
      this.$$html += '>';
      
      this.$$tableOpen = true;
      return this;
    },
    tr: function () {
      if (this.$$rowOpen) {
        this.$$html += '</tr>';
      } else {
        this.$$html += '<tr>';
      }
      this.$$rowOpen = !this.$$rowOpen;
      return this;
    },
    td: function (content, c) {
      c = $.extend({}, {
        type: 'td',
        classes: []
      }, c);
      
      // tag auf
      this.$$html += '<'+c.type;
      if (c.classes.length) {
        this.$$html += ' class="'+c.classes.join(' ')+'"';
      }
      if (c.colspan > 1) {
        this.$$html += ' colspan="'+c.colspan+'"';
      }
      this.$$html += '>';
      
      // content
      this.$$html += content;
      
      // tag zu
      this.$$html +='</'+c.type+'>';
      
      return this;
    },
    th: function (content, spec) {
      spec.type = 'th';
      return this.td(content, spec);
    },
    build: function () {
      if (this.$$tableOpen) {
        this.$$html += '</table>';
        this.$$tableOpen = false;
      }
      
      return this.$$html;
    },
    
    toString: function() {
      return "[Psc.UI.TableBuilder]";
    }
  }
});