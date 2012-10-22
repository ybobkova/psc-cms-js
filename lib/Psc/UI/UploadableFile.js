define(['Psc/Request', 'Psc/UI/Button', 'Psc/UI/WidgetWrapper', 'Psc/EventDispatching', 'Psc/UI/FormFields'], function() {
  /**
   *
   * Events:
   *   image-edited [that, id, url]
   *     nachdem ein neues Bild hochgeladen wurde
   */
  Joose.Class('Psc.UI.UploadableFile', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.EventDispatching, Psc.UI.FormFields],
    
    has: {
      id: { is : 'rw', required: true, isPrivate: true }, // die id der Datei welche hochgeladen wurde und von der api returned wurde
      url: { is : 'rw', required: true, isPrivate: true }, // darf zwar leer sein, aber muss angegeben sein
      description: { is : 'rw', required: true, isPrivate: true }, // darf zwar leer sein, aber muss angegeben sein
      
      uploadService: { is : 'rw', required: true, isPrivate: true },
      // das tag unseres downloads
      download: { is : 'rw', required: false, isPrivate: true } 
    },
    
    after: {
      initialize: function () {
        var that = this;
        
        this.checkWidget();
        this.initUI();
      }
    },
    
    methods: {
      initUI: function () {
        var that = this;
  
        this.refreshUI();
      },
      
      refreshUI: function () {
        var that = this, button, $button;
        
        if (!this.$$download) {
          this.$$download = $('<div class="psc-cms-ui-uploadable-file"></div>');
        } else {
          this.$$download.empty();
        }
        
        if (this.$$id > 0) {
          this.$$download.append('<p><a target="_blank" href="'+this.$$url+'">'+(this.$$description !== null ? this.$$description : '(Keine Beschreibung vorhanden)')+'</a></p>');
        } 
  
        // button für den upload
        button = new Psc.UI.Button({
          label: (this.$$id > 0 ? 'Datei ersetzen' : 'neue Datei hochladen'),
          leftIcon: 'arrowreturnthick-1-n'
        });
        
        this.$$download.append($button = button.create());
        
        $button.on('click', function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          that.editFile();
        });
        
        this.unwrap().append(this.$$download);
      },
      
      refreshFile: function(response) {
        // response.size wäre auch verfügbar
        this.$$id = response.id;
        this.$$url = response.url;
        this.$$description = response.description;
              
        var ev = this.getEventManager().triggerEvent('file-edited', {}, [this, this.$$id, this.$$url]);
        if (!ev.isDefaultPrevented()) {
          this.refreshUI();
        }
      },
      
      editFile: function () {
        var that = this;
        var dialog = this.$$uploadService.openSingleDialog(
          new Psc.Request({
            url: '/cms/uploads/',
            method: 'POST',
            body: {},
            format: 'json'
          }),
          {
            form: {
              hint: 'Es können beliebige Dateien hochgeladen werden.',
              fields: that.getFormFields()
            },
            title: this.$$url ? 'Datei ersetzen' : 'neue Datei hochladen',
            dataCallback: function (result) {
              that.refreshFile(result);
            }
          }
        );
      },
      
      getFormFields: function () {
        return new Psc.UI.FormFields({
          fields: {
            'description': 'string'
          }
        });
      },
      
      toString: function() {
        return "[Psc.UI.UploadableFile]";
      }
    }
  });
});