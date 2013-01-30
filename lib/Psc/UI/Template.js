define(['joose', 'Psc/Exception', 'Psc/Date', 'jquery-tmpl'], function(Joose) {
  Joose.Class('Psc.UI.Template', {
    
    has: {
      /**
       * Das Markup des Templates als jQuery Object mit <script>-tag
       *
       * kann dur Psc\JS\jQueryTemplate erzeugt werden
       */
      jQueryTemplate: { is : 'rw', required: true, isPrivate: true },
      
      /**
       * Die Template vars sind in gegensatz zu "data" fixed
       */
      vars: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
      
      dateFormat: { is : 'rw', required: false, isPrivate: true, init: '$d.m.yy hh:ii' }
    },
    
    after: {
      initialize: function () {
        this.initVars();
      }
    },
    
    methods: {
      initVars: function () {
        var that = this;
        
        /**
         * $item.i18nDate(utsOrDate)
         *
         * http://docs.jquery.com/UI/Datepicker/formatDate
         * @param utsOrDate der UnixTimestamp in Sekunden(!) oder ein Javascript Date Objekt
         * @param format wenn undefined wird das default datum (d.m.yy) benutzt
         * @param lanugage unbeutzt @TODO datepicker mit internationalisierungen laden
         * @return string
         */
        this.$$vars.i18nDate = function (utsOrDate, format, language) {
          var date;
          if (typeof(utsOrDate) === 'integer') {
            date = new Date(utsOrDate*1000);
          } else if (typeof(utsOrDate) === 'string') {
            date = new Date(parseInt(utsOrDate,10)*1000);
          } else if (utsOrDate instanceof Date) {
            date = utsOrDate;
          } else if (utsOrDate.date && utsOrDate.timezone) {
            date = new Date(parseInt(utsOrDate.date,10)*1000);
          } else {
            throw new Error('unbekannter Parameter für utsOrDate');
          }
          
          return (new Psc.Date({date: date})).format(format || that.$$dateFormat);
        };
        
        this.$$vars.miniMarkup = function (text) {
          if (!text || typeof(text) !== 'string') return '';
          
          return text.replace(/\n/g, '<br />');
        };
      },
      
      /**
       * Rendert das Template mit den angegeben dynamischen Variablen
       *
       * @return jQuery
       */
      render: function(data) {
        if (!this.$$jQueryTemplate.length) {
          throw new Psc.Exception('jQueryTemplate ist ein leeres jQuery Objekt. Das Template kann nicht gerendert werden');
        }
        
        return this.$$jQueryTemplate.tmpl(data, this.$$vars);
      },
      /**
       * Render das Template und ersetzt dabei $element mit den Daten
       *
       * (praktisch für linking)
       *
       * template: 
       * <span id="comments-count">${count} Comments</span>
       *
       * code:
       * template.replace($('span#comments-count'), {count: 17});
       * 
       * @chainable
       */
      replace: function($element, data) {
        $element.replaceWith(this.$$jQueryTemplate.tmpl(data, this.$$vars));
        return this;
      },
      
      toString: function() {
        return "[Psc.UI.Template]";
      }
    }
  });
});