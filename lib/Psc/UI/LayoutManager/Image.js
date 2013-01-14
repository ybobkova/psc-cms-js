define(['Psc/UI/SplitPane', 'Psc/UI/UploadableImage', 'Psc/UI/Group', 'Psc/UI/LayoutManagerComponent'], function() {
  Joose.Class('Psc.UI.LayoutManager.Image', {
    isa: Psc.UI.LayoutManagerComponent,
  
    has: {
      uploadService: { is : 'rw', required: true, isPrivate: true },
      
      // das uploadable image
      image: { is : 'rw', required: false, isPrivate: true },
      imageId: { is : 'rw', required: false, isPrivate: true }, 
      
      // properties der componente
      url: { is : 'rw', required: false, isPrivate: true },
      caption: { is : 'rw', required: false, isPrivate: true },
      align: { is : 'rw', required: false, isPrivate: true }
    },
    
    before: {
      initialize: function () {
        this.$$type = 'image';
      }
    },
    
    methods: {
      createContent: function () {
        var that = this, $form, $sizeHint;
        
        // this.$$content ist eigentlich leer
        var pane = new Psc.UI.SplitPane({
          width: 40
        });
        this.$$content = pane.html();
  
        this.$$image = new Psc.UI.UploadableImage({
          url: this.$$url,
          uploadService: this.$$uploadService,
          widget: pane.getRightTag(),
          id: this.$$imageId
        });
        this.refreshAlign(this.$$align);
        
        this.$$formBuilder.open();
        this.$$formBuilder.radios('Bild-Position im Text', 'align', this.$$align, {'left': 'links','right': 'rechts','full-width':'volle Breite'});
        
        //var group = new Psc.UI.Group({label: 'Optionen', content: this.$$formBuilder.build()});
        pane.getLeftTag().append($form = this.$$formBuilder.build());
        
        $sizeHint = $('<small class="hint size">Das Bild wird hier nicht in Original-Größe angezeigt. Auf der Webseite wird es automatisch auf eine passende Größe reduziert.</small>');
        $form.append('<small class="hint">Das Bild kann durch Doppelklicken ersetzt werden</small><br />');
        $form.append($sizeHint);
        
        this.$$image.getEventManager().on('image-dimension-update', function(e, width, height) {
          $sizeHint.html('Das Bild soll in '+Math.round(width)+'x'+Math.round(height)+' angezeigt werden.');
        });
        
        $form.on('change','input[name="align"]', function (e) {
          that.refreshAlign($(e.currentTarget).val());
        });
      },
      
      refreshAlign: function (value) {
        this.$$align = value;
        if (this.$$image && this.$$align !== 'full-width') {
          this.$$image.unwrap().css('text-align', this.$$align);
        }
      },
      
      getExportUrl: function() {
        return this.$$image ? this.$$image.getUrl() : this.getUrl();
      },
      
      getExportImageId: function () {
        return this.$$image ? this.$$image.getId() : this.$$imageId;
      },
  
      toString: function() {
        return "[Psc.UI.LayoutManager.Image]";
      }
    }
  });
});