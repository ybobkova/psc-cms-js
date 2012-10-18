/**
 * Eine AjaxResponse wird von Main resolved, wenn mit handleRequest ein Request erstellt / ausgeführt wurde und er eine Response zurück gibt
 *
 * ist der Request ein HTML-Request, werden inline Elemente mit dem Loader ausgeführt. (siehe loader::finish())
 */
Joose.Class('Psc.AjaxResponse', {
  
  isa: 'Psc.Response',
  
  has: {
    loader: { is : 'rw', required: true, isPrivate: true },
    request: { is : 'rw', required: true, isPrivate: true }
  },

  methods: {
    toString: function() {
      return "[Psc.AjaxResponse]";
    }
  }
});