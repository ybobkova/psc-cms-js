define(['joose', 'jquery', 'Psc/InvalidArgumentException', 'Psc/Code', 'Psc/Request'], function(Joose, $) {
  /**
   * Ein FormRequest liest z.b. aus dem Formular die Custom-Header aus und übersetzt diese in "richtige" Header vom Ajax
   *
   * sodass wir einfach das Formular mit PHP mit allen Settings erstellen können und mit javascript nur abschicken
   */
  Joose.Class('Psc.FormRequest', {
    isa: Psc.Request,
  
    has: {
      form: { is : 'rw', required: true, isPrivate: true },
      url: { is : 'rw', required: false, isPrivate: true },
      method: { is : 'rw', required: false, isPrivate: true }
    },

    before: {
      initialize: function (props) {
        this.setForm(props.form);
        
        this.$$method = props.method = this.expandMethod();
        this.$$url = props.url = this.expandUrl();
      }
    },
    
    methods: {
      setForm: function ($form) {
        var that = this;

        if (!$form.is('form')) {
          Psc.Code.info('Suche <form> Element in Parameter', $form);
          $form = $form.find('form');
        }
        if (!$form.length) {
          throw new Psc.InvalidArgumentException('$form','jQuery <form> Element', $form, 'FormRequest::setForm()');
        }
        
        // alle header aus dem formular in den request Kopieren
        $form.find('input[class="psc-cms-ui-http-header"]').each(function () {
          var $input = $(this);
          that.setHeaderField($input.attr('name'), $input.attr('value'));
        });
  
        this.$$form = $form;
      },
      
      /**
       * Eine spezielle repräsentation wo alle felder als
       * [{name: $name, value: $value}, {...}] dargestellt werden
       */
      getBodySerialized: function() {
        var serialized = [];
        
        if (this.$$body) {
          $.each(this.$$body, function (name, value) {
            serialized.push({name: name, value: value});
          });
        }
      
        return serialized;  
      },
      expandUrl: function () {
        return this.getForm().attr('action');
      },
  
      expandMethod: function() {
        var $form = this.getForm(), $methodInput;
        
        $methodInput = $form.find('input[name="X-Psc-Cms-Request-Method"]');
        if ($methodInput.length) {
          return $methodInput.val();
        } else {
          return 'POST';
        }
      },
      toString: function() {
        return "[Psc.FormRequest "+this.getMethod()+" "+this.getUrl()+"]";
      }
    }
  });
});