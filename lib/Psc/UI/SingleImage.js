define(['Psc/UI/ResizableImage','Psc/UI/UploadableImage','Psc/UI/WidgetWrapper'], function () {
  /**
   * SingleImage ist der Wrapper für ein UploadableImage welches zu der Psc\UI\Component\SingleImage passt
   */
  Joose.Class('Psc.UI.SingleImage', {
    isa: Psc.UI.WidgetWrapper,
    
    has: {
      id: { is : 'rw', required: true, isPrivate: true },
      url: { is : 'rw', required: true, isPrivate: true },
      formName: { is : 'rw', required: true, isPrivate: true },
      
      // Psc.UI.Uploadservice
      uploadService: { is : 'rw', required: true, isPrivate: true },
      
      // uploadable image
      image: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function () {
        // wir könnten checken ob das hidden in sync mit unserem property ist
        
        this.initUI();
        this.linkWidget();
      }
    },
    
    methods: {
      initUI: function () {
        var that = this;
        
        this.$$image = new Psc.UI.UploadableImage({
          url: this.$$url,
          uploadService: this.$$uploadService,
          widget: this.unwrap(),
          id: this.$$id
        });
        
        this.$$image.getEventManager().on('image-edited', function(e, image, id, url) {
          // sync
          that.setId(id);
          that.refreshHidden();
          that.setUrl(url);
        });
      },
      
      refreshHidden: function() {
        this.getHidden().val(this.$$id);
      },
      
      getHidden: function () {
        return this.unwrap().find('input[name="'+this.$$formName+'"]');
      },
      
      toString: function() {
        return "[Psc.UI.SingleImage]";
      }
    }
  });
});