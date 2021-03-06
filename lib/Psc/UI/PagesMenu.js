define(['jquery', 'joose', 'jqwidgets', 'jquery-global', 'Psc/EventDispatching', 'Psc/UI/jqx/WidgetWrapper', 'Psc/UI/Controlling', 'Psc/UI/Translating'], function ($, Joose) {
  Joose.Class('Psc.UI.PagesMenu', {
    isa: Psc.UI.jqx.WidgetWrapper,
    
    does: [Psc.EventDispatching, Psc.UI.Controlling, Psc.UI.Translating],
    
    has: {
      flat: { is: 'rw', required: true, isPrivate: true},
      locale: { is: 'rw', required: true, isPrivate: true},
      
      // nodes indexed by id
      nodes: { is: 'r', required: false, isPrivate: true},
      contentStreamTypes: { is: 'r', required: false, isPrivate: true}
    },
    
    after: {
      initialize: function (props) {
        if (props.contentStreamTypes === undefined) {
          this.$$contentStreamTypes = ['page-content'];
        }

        this.checkWidget();
        this.linkWidget();
        
        this.initjqxFlat();
      }
    },
    
    methods: {
      initjqxFlat: function () {
        var that = this;
        
        this.$$nodes = {};
        for (var i = 0; i < this.$$flat.length; i++) {
          var node = this.$$flat[i];
          
          node.label = node.title[that.$$locale]; // das ist nicht möglich mit dem jqx.dataAdapter zu mappen
          
          this.$$nodes[node.id] = node;
        }
        
        var dataAdapter = new $.jqx.dataAdapter({
          datatype: "json",
          datafields: [
            { name: 'id' },
            { name: 'parentId' },
            { name: 'label' }
          ],
          id: 'id',
          localdata: this.$$flat
        });
        
        dataAdapter.dataBind();
        
        /*
         The first parameter is the item's id.
         The second parameter is the parent item's id.
         The 'items' parameter represents the sub items collection name.
        */
        var records = dataAdapter.getRecordsHierarchy('id', 'parentId', 'items');
        
        this.jqx('Menu', {
          mode: 'horizontal',
          source: records,
          autoSizeMainItems: true,
          animationHideDelay: 800
        });
        
        this.unwrap().bind('itemclick', function (event) {
          var node = that.$$nodes[event.args.id];
          if (node) {
            var ev = that._trigger('select-node', [node]);

            if (!ev.isDefaultPrevented()) {
              var ui = that.getUIController();
              var items = [], label, tabLabel;

              for(var type, j=0; j<that.$$contentStreamTypes.length; j++) {
                type = that.$$contentStreamTypes[j];
                for(var language, i=0; i<node.languages.length; i++) {
                  language = node.languages[i];

                  label = '';
                  if (type === 'page-content') {
                    label += that.trans('pages.button.page-content');
                  } else if(type === 'sidebar-content') {
                    label += that.trans('pages.button.sidebar-content');
                  }
                  label += ' '+language.toUpperCase();

                  items.push(
                    ui.createTabButtonItem(
                      ui.tab('page', node.pageId, ['contentstream', language, type], node.label+' - '+label),
                      ui.button(label, 1, 'pencil', type === 'sidebar-content' ? 'grip-dotted-vertical' : undefined)
                    )
                  );
                }
              }

              items.push(
                ui.createTabButtonItem(
                  ui.tab('page', node.pageId, 'form', that.transf('pages.openTab.title', [node.label])),
                  ui.button(that.trans('pages.button.info'), 1, 'wrench')
                )
              );

              ui.openTabsSelection(
                that.trans('pages.openDialog.title'),
                items
              );
            }
          }
        });
      },
      
      getNode: function (search) {
        return this.$$nodes[search];
      },
    
      _trigger: function (eventName, handlerData) {
        return this.getEventManager().triggerEvent(eventName, {menu: this}, handlerData);
      },
      
      toString: function () {
        return '[Psc.UI.PagesMenu]';
      }
    }
  });
});