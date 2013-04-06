define(['joose', 'jquery', 'jquery-ui', 'Psc/UI/ResizableImage', 'Psc/Request', 'Psc/UI/WidgetWrapper', 'Psc/EventDispatching'], function(Joose, $) {
  /**
   *
   * Events:
   *   image-edited [that, id, url]
   *     nachdem ein neues Bild hochgeladen wurde
   */
  Joose.Class('Psc.UI.UploadableImage', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.EventDispatching],
    
    has: {
      url: { is : 'rw', required: true, isPrivate: true }, // darf zwar leer sein,a ber muss angegebn sein
      id: { is : 'rw', required: false, isPrivate: true }, // die id des images welches hochgeladen wurde und von der api returned wurde
      
      uploadService: { is : 'rw', required: true, isPrivate: true },
      image: { is : 'rw', required: false, isPrivate: true } // das resizable Image, wenn url gesetzt ist
    },
    
    after: {
      initialize: function () {
        var that = this;
        
        this.$$eventManager.on('image-edit', function (e, editimage) {
          e.preventDefault();
          that.editImage();
        });
        
        this.checkWidget();
        this.initUI();
      }
    },
    
    methods: {
      initUI: function () {
        var that = this;
        if (this.$$url) {
          this._createImage();
        } else {
          this._createPlaceholder();
        }
      },
      
      refreshImage: function(responseImage) {
        this.$$url = responseImage.url;
        this.$$id = responseImage.id;
        
        this.getEventManager().triggerEvent('image-edited', {}, [this, this.$$id, this.$$url]);
        
        if (this.$$url) {
          this.unwrap().find('.psc-cms-ui-uploadable-image').remove();
          this._createImage();
        }
      },
      
      _createImage: function () {
        var that = this;
        var $widget =
              $('<div class="psc-cms-ui-uploadable-image" title="Doppelklick zum Bearbeiten" />')
                .css('overflow','hidden')
                .css('display','inline-block')
                .css('border','1px solid black')
                .css('text-align','right')
                .css('min-height','50px').css('min-width','50px')
                .append($('<img src="'+this.$$url+'?nocache='+(new Date()).getTime()+'" alt="" title="Doppelklick zum Bearbeiten" />'))
                .on('dblclick', function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  that.editImage();
                });
        
        this.unwrap().append($widget);
      },
      
      _createResizableImage: function () {
        var that = this;
        //var $widget = $('<div class="psc-cms-ui-uploadable-image" />');
        //this.unwrap().append($widget);
        
        this.$$image = new Psc.UI.ResizableImage({
          src: this.$$url,
          widget: this.unwrap(),
          eventManager: that.getEventManager(),
          handles: ['ne','se','sw','nw']
        });
      },
  
      _createPlaceholder: function () {
        var that = this, $widget = $('<div class="psc-cms-ui-uploadable-image placeholder">Zum hinzufügen eines neues Bildes hier doppelklicken.</div>');
        $widget.addClass('ui-corner-all ui-widget-content');
        
        $widget.on('dblclick',function (e) {
          e.preventDefault();
          e.stopPropagation();
          
          that.editImage();
        });
        
        return this.unwrap().append($widget);
      },
      
      editImage: function () {
        var that = this;
        var dialog = this.$$uploadService.openSingleDialog(
          new Psc.Request({
            url: '/cms/images/',
            method: 'POST',
            body: {
              types: ['jpg', 'png', 'gif']
              // usw
            },
            format: 'json'
          }),
          {
            form: {
              hint: 'Es können nur Bilder hochgeladen werden.'
            },
            title: this.$$url ? 'Bild ersetzen' : 'neues Bild hochladen',
            dataCallback: function (result) {
              var image = result;
              that.refreshImage(image);
            }
          }
        );
      },
      
      toString: function() {
        return "[Psc.UI.UploadableImage]";
      }
    }
  });
});