define(['joose', 'lodash', 'Psc/Code', 'Psc/Exception'], function(Joose, _) {
  Joose.Class('Psc.UI.TabNotFoundException', {
    isa: Psc.Exception,
  
    has: {
      search: { is : 'rw', required: true, isPrivate: false }
    },
  
    methods: {
      BUILD: function (search) {
        return _.extend(this.SUPER("Tab nicht gefunden, gesucht wurde durch: "+Psc.Code.odump(search)), {
          search: search
        });
      },
      toString: function() {
        return "[Psc.UI.TabNotFoundException gesucht wurde durch: "+Psc.Code.odump(this.search)+']';
      }
    }
  });
});