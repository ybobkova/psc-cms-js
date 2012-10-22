define(['Psc/Exception'], function() {
  /**
   * Klasse noch net fertig!
   *
   */
  Joose.Class('Psc.UI.FormReader', {
    
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
    
    methods: {
      read: function ($form) {
        var data = {};
        
        // @TODO hier das [] parsing
        $.each($form.serializeArray(), function (i, r) {
          if (r.name.indexOf('[') !== -1) {
            throw new Psc.Exception('Klammern parsing noch nicht implementiert');
          }
          
          data[r.name] = r.value;
        });
        
        return data;
      },
      
      toString: function() {
        return "[Psc.UI.FormReader]";
      }
    }
  });
});