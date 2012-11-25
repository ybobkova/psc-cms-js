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
        var that = this, button, $button, delbutton, $delbutton;
        
        if (!this.$$download) {
          this.$$download = $('<div class="psc-cms-ui-uploadable-file"></div>');
        } else {
          this.$$download.empty();
        }
        
        if (this.$$id > 0) {
          var label;
          if (this.$$description) {
            label = this.$$description;
          } else {
            label = '(Keine Beschreibung vorhanden)';
            
            if (this.$$url) {
              var filename = this.$$url.substring(this.$$url.lastIndexOf('/')+1);
              if (filename.length) {
                label = filename;
              }
            }
          }

          this.$$download.append('<p style="margin-bottom: 0.1em"><a target="_blank" href="'+this.$$url+'">'+label+'</a></p>');
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
        
        // delete button
        if (this.$$id > 0) {
          delbutton = new Psc.UI.Button({
            label: 'Datei entfernen',
            leftIcon: 'trash'
          });
        
          this.$$download.append($delbutton = delbutton.create());
          
          $delbutton.on('click', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            that.delFile();
          });
        }
        
        this.unwrap().append(this.$$download);
      },
      
      refreshFile: function(response) {
        var oldId = this.$$id;
        // response.size wäre auch verfügbar
        this.$$id = response.id;
        this.$$url = response.url;
        this.$$description = response.description;
        
        if (!oldId) {
          this.getEventManager().triggerEvent('file-new', {}, [this, this.$$id, this.$$url]);
        }
              
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
      
      delFile: function () {
        this.$$id = undefined;
        this.$$url = undefined;
        this.$$description = undefined;
        
        var ev = this.getEventManager().triggerEvent('file-deleted', {}, [this]);
        if (!ev.isDefaultPrevented()) {
          this.refreshUI();
        }
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