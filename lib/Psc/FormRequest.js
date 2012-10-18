/**
 * Ein FormRequest liest z.b. aus dem Formular die Custom-Header aus und übersetzt diese in "richtige" Header vom Ajax
 *
 * sodass wir einfach das Formular mit PHP mit allen Settings erstellen können und mit javascript nur abschicken
 */
Joose.Class('Psc.FormRequest', {
  isa: 'Psc.Request',
  
  use: ['Psc.InvalidArgumentException', 'Psc.Code'],

  has: {
    form: { is : 'rw', required: true, isPrivate: true },
    url: { is : 'rw', required: false, isPrivate: true },
    method: { is : 'rw', required: false, isPrivate: true }
  },

  override: {
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

      this.SUPER($form);
    },
    setUrl: function ($url) {
      return this.SUPER($url);
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
    }
  },
  
  methods: {
    initialize: function (props) {
      this.setForm(props.form);
      
      this.setMethod(props.method = this.expandMethod());
      this.setUrl(props.url = this.expandUrl());
      
      this.SUPER(props);
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