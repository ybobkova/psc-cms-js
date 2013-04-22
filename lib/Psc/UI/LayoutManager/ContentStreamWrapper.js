define(['jquery', 'joose', 'Psc/UI/LayoutManagerComponent'], function ($, Joose) {
  Joose.Class('Psc.UI.LayoutManager.ContentStreamWrapper', {
    isa: Psc.UI.LayoutManagerComponent,

    has: {
      // the inner contentStream has: .type, .locale (maybe .revision)
      wrapped: { is: 'rw', required: true, isPrivate: true}
    },

    before: {
      initialize: function (props) {
        this.$$type = 'ContentStreamWrapper';
      }
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      createContent: function () {
        this.$$content = [];
        
        var collectionHTML = $('<div class="content-stream" />').css('min-height', '250px');
        for (var i = 0; i < this.$$wrapped.entries.length; i++) {
          collectionHTML.append(this.$$wrapped.entries[i].create());
        }
        
        this.$$content.push(collectionHTML);
        //this.$$content.push(this.createNewButton());
        
        return this.$$content;
      },
      
      afterCreate: function () {
        var $layout = this.findContent().find('.content-stream');

        $layout.sortable({
            items: '> .widget',
            revert: true,
            cancel: false,
            tolerance: 'pointer',
            disabled: false,
            handle: '> h3.widget-header ',
            greedy: true
        });
        
        $layout.droppable({
          hoverClass: 'hover',
          greedy: true,
          drop: function (event,ui) {
            $layout.trigger('unsaved');
          }
        });

      },

      serialize: function (serialized) {
        var that = this, entries = [], s;
        var $widgets = this.findContent().find('> .content-stream > div.widget');

        // siehe auch layoutmanager
        $widgets.each(function (i, div) {
          var $widget = $(div), widget = Psc.UI.WidgetWrapper.unwrapWidget($widget, Psc.UI.LayoutManagerComponent);
          
          // cleanup to refresh caches and to remove non necessary elements in widget
          widget.cleanup();

          if (widget.isEmpty()) {
            widget.remove();

          } else {

            s = {type: widget.getType(), label: widget.getLabel()};
            widget.serialize(s);

            entries.push(s);
          }
        });

        serialized.wrapped = {
          type: this.$$wrapped.type,
          locale: this.$$wrapped.locale,
          revision: this.$$wrapped.revision,
          entries: entries
        };
      },
      toString: function () {
        return '[Psc.UI.LayoutManager.ContentStreamWrapper]';
      }
    }
  });
});