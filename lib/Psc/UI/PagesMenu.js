define(['jquery', 'joose', 'jqwidgets', 'jqwidgets-global', 'Psc/EventDispatching', 'Psc/UI/jqx/WidgetWrapper', 'Psc/UI/Controlling'], function ($) {
  Joose.Class('Psc.UI.PagesMenu', {
    isa: Psc.UI.jqx.WidgetWrapper,
    
    does: [Psc.EventDispatching, Psc.UI.Controlling],
    
    has: {
      flat: { is: 'rw', required: true, isPrivate: true},
      
      // nodes indexed by id
      nodes: { is: 'r', required: false, isPrivate: true}
    },
    
    after: {
      initialize: function () {
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
          
          node.label = node.title.de; // das ist nicht möglich mit dem jqx.dataAdapter zu mappen
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
        })
        
        this.unwrap().bind('itemclick', function (event) {
          var node = that.$$nodes[event.args.id]
          if (node) {
            var ev = that._trigger('select-node', [node]);
            
            if (!ev.isDefaultPrevented()) {
              that.getUIController().openTab('page', node.pageId)
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