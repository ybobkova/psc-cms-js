define(['Psc/Exception'], function() {
  Joose.Class('Psc.UI.Tab', {
    
    has: {
      /* required */
      id: { is : 'rw', required: true, isPrivate: true },
      url: { is : 'rw', required: true, isPrivate: true },
      label: { is : 'rw', required: true, isPrivate: true },
  
      /* optional */
      content: { is : 'rw', required: false, isPrivate: true, init: null },
      unsaved: { is : 'rw', required: false, isPrivate: true, init: false },
      closable: { is: 'rw', required: false, isPrivate: true, init: true },
      pinned: { is : 'rw', required: false, isPrivate: true, init: false }
    },
    
    after: {
      initialize: function () {
        //if (typeof(this.$$url) !== 'string' || this.$$url.length == 0) {
        //  throw new Psc.Exception('Url für new Tab() muss ein nichtleerer String sein');
        //}
      }
    },
  
    methods: {
      getExport: function () {
        return {
          id: this.$$id,
          url: this.$$url,
          label: this.$$label,
          closable: this.$$closable,
          content: this.$$content
        };
      },
      
      isUnsaved: function() {
        return this.$$unsaved;
      },
      isClosable: function() {
        return this.$$closable;
      },
      toString: function() {
        return "[Psc.UI.Tab]";
      }
    }
  });
});  