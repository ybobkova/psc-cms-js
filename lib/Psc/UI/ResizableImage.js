define(['Psc/UI/WidgetWrapper','Psc/EventDispatching'], function () {
  /**
   * events: image-edit [image]
   *         image-dimension-update [width, height, image]
   */
  Joose.Class('Psc.UI.ResizableImage', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.EventDispatching],
  
    has: {
      src: { is : 'rw', required: false, isPrivate: true },
      img: { is : 'rw', required: false, isPrivate: true },
      maxWidth: { is : 'rw', required: false, isPrivate: true, init: 300 },
      
      // current, immer up-to-date
      width: { is : 'rw', required: false, isPrivate: true },
      height: { is : 'rw', required: false, isPrivate: true },
      
      handles: { is : 'rw', required: false, isPrivate: true, init: ['ne','se','sw','nw']}
    },
    
    after: {
      initialize: function (props) {
        this.checkWidget();
        this.linkWidget();
        
        this.init();
      }
    },
    
    methods: {
      init: function () {
        var that = this;
        
        this.$$img = $('<img src="'+this.$$src+'" alt="" title="Doppelklick zum Bearbeiten" />');
        this.unwrap().append(this.$$img);
        
        this.initResizable();
        
        this.unwrap().on('dblclick', function (e) {
          that.getEventManager().triggerEvent('image-edit', {}, [that]);
        });
      },
      
      initResizable: function() {
        var that = this, handles = {};
        $.each(this.$$handles, function (i,type) {
          handles[type] = that.createHandle(type);
          that.unwrap().append(handles[type]);
        });
  
        this.$$img.resizable({
          ghost: true,
          aspectRatio: true,
          //handles: handles,
          stop: function (e, ui) {
            that.setWidth(ui.size.width);
            that.setHeight(ui.size.height);
            that.getEventManager().triggerEvent('image-dimension-update', {}, [ui.size.width, ui.size.height, that]);
          }
          //alsoResize: this.unwrap().find('img')
        });
      },
      
      refreshSource: function (url) {
        this.$$src = url;
        if (this.$$img) {
          this.$$img.attr('src', url);
          
          //this.unwrap().resizable('destroy');
          //this.unwrap().parent()
          //  .css('width','59%')
          //  .css('height','100%');
          //
          //this.$$img.attr('src', url)
          //  .css('height','100%')
          //  .css('width', '100%');
          //
          //this.unwrap().css('height', 'auto');
          //this.unwrap().css('width', 'auto');
          //
          //var computed, tmp;
          //
          //if (document.body.currentStyle) {
          //  computed = document.body.currentStyle;
          //} else {
          //  computed = document.defaultView.getComputedStyle(document.body, '');
          //}
          //
          //tmp = computed.backgroundColor;
          //tmp = computed.backgroundImage;
          //tmp = computed.backgroundAttachment;
          ////this.initResizable();
        }
      },
      
      createHandle: function (type) {
        var icon = '';
        
        icon = 'arrowthick-1-'+type;
        
        //icon = 'grip-diagonal-se'; // das icon hätte ich gerne an allen ecken, das wäre toll!
        return $('<div class="ui-resizable-handle ui-resizable-'+type+' ui-icon ui-icon-'+icon+'"></div>')
            .css('background-color','#ffffff')
            .css('opacity',0.8);
            //.css('')
      },
      
      toString: function() {
        return "[Psc.UI.ResizableImage]";
      }
    }
  });
});