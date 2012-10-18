Joose.Class('Psc.UI.LayoutManager.Paragraph', {
  isa: 'Psc.UI.LayoutManagerComponent',

  has: {
    //attribute1: { is : 'rw', required: false, isPrivate: true }
  },
  
  before: {
    initialize: function () {
      this.$$type = 'paragraph';
    }
  },
  
  methods: {
    createContent: function () {
      var content = this.$$content;
      return this.$$content = this.createTextarea(content);
    },

    toString: function() {
      return "[Psc.UI.LayoutManager.Paragraph]";
    }
  }
});