Joose.Class('Psc.CMS.Service', {
  
  use: ['Psc.AjaxHandler', 'Psc.Code'],
  
  has: {
    ajaxHandler: { is : 'rw', required: false, isPrivate: true }
  },
  
  after: {
    initialize: function (props) {
      if (!props.ajaxHandler) {
        this.$$ajaxHandler = new Psc.AjaxHandler();
      }
    }
  },
  
  methods: {
    download: function (request) {
      var $form =
        $('<form method="post" action="'+request.getUrl()+'"></form>')
        .append( $('<input type="hidden" name="bodyAsJSON" />').val(JSON.stringify(request.getBody())) );
        
      $('body').append($form);
      
      $form.submit();
      
      setTimeout(function () {
        $form.remove();
      }, 200);
    },

    handleAjaxRequest: function (request, ajaxHandler) {
    },
    
    toString: function() {
      return "[Psc.CMS.Service]";
    }
  }
});