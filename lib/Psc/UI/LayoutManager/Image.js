define(['joose', 'Psc/UI/SplitPane', 'Psc/UI/UploadableImage', 'Psc/UI/Group', 'Psc/UI/LayoutManagerComponent'], function(Joose) {
  Joose.Class('Psc.UI.LayoutManager.Image', {
    isa: Psc.UI.LayoutManagerComponent,
  
    has: {
      uploadService: { is : 'rw', required: true, isPrivate: true },
      
      // das uploadable image
      image: { is : 'rw', required: false, isPrivate: true },
      
      
      // properties der componente
      imageEntity: { is : 'rw', required: false, isPrivate: true }, 
      url: { is : 'rw', required: false, isPrivate: true },
      caption: { is : 'rw', required: false, isPrivate: true },
      align: { is : 'rw', required: false, isPrivate: true },
      resize: { is : 'rw', required: false, isPrivate: true } // a hash with width and height or both how the maximum values should be for the inline image
    },
    
    before: {
      initialize: function (props) {
        this.$$type = 'Image';

        if (!props.resize) {
          props.resizie = this.$$resize = {};
        }
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
          id: this.$$imageEntity
        });
        this.refreshAlign(this.$$align);
        
        this.$$formBuilder.open();
        this.$$formBuilder.radios('Bild-Position im Text', 'align', this.$$align, {'left': 'links','right': 'rechts','full-width':'volle Breite'});

        this.$$formBuilder.miniTextField('Maximal-Breite', 'resize-width', this.$$resize.width);
        this.$$formBuilder.miniTextField('Maximal-Höhe', 'resize-height', this.$$resize.height);
        
        //var group = new Psc.UI.Group({label: 'Optionen', content: this.$$formBuilder.build()});
        pane.getLeftTag().append($form = this.$$formBuilder.build());
        
        $sizeHint = $('<small class="hint size">Das Bild wird hier nicht in Original-Größe angezeigt. Auf der Webseite wird es automatisch auf eine passende Größe reduziert.</small>');
        $form.append('<small class="hint">Das Bild kann durch Doppelklicken ersetzt werden</small><br />');
        $form.append($sizeHint);
        
        this.$$image.getEventManager().on('image-dimension-update', function(e, width, height) {
          $sizeHint.html('Das Bild soll in '+Math.round(width)+'x'+Math.round(height)+' angezeigt werden.');
        });

        $form.on('change', 'input[name="resize-width"], input[name="resize-height"]', function (e) {
          var $input = $(e.currentTarget), name = $input.attr('name').substr(7);
          var px = parseInt($input.val(), 10);

          if (px > 0) {
            that.$$resize[name] = px;
            $input.val(px);
          } else if(that.$$resize[name]) {
            delete that.$$resize[name];
            $input.val('');
          }
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

      serialize: function (s) {
        s.url = this.getExportUrl();
        s.imageEntity = this.getExportImageId();
        s.caption = this.getCaption();
        s.align = this.getAlign();
        s.resize = this.getResize();
      },

      isEmpty: function () {
        return this.isEmptyText(this.getExportUrl());
      },

      getExportUrl: function() {
        return this.$$image ? this.$$image.getUrl() : this.getUrl();
      },
      
      getExportImageId: function () {
        return this.$$image ? this.$$image.getId() : this.$$imageEntity;
      },
  
      toString: function() {
        return "[Psc.UI.LayoutManager.Image]";
      }
    }
  });
});