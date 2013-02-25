define(['joose', 'Psc/UI/LayoutManagerComponent', 'Psc/UI/Button', 'Psc/Exception'], function(Joose) {
  Joose.Class('Psc.UI.LayoutManager.CollectionWidget', {
    isa: Psc.UI.LayoutManagerComponent,
    
    //does: [Psc.UI.InteractionProviding],
  
    has: {
      collectionable: { is : 'rw', required: true, isPrivate: true }
    },
    
    before: {
      initialize: function (props) {
        this.$$type = 'collection-widget';
      }
    },
    
    after: {
      initialize: function () {
        if (!this.$$collectionable.constructor) {
          throw new Psc.Exception('attribute collectionable.constructor has to be a class name to a component Psc.UI.LayoutManagerComponent.*');
        }
      }
    },
    
    methods: {
      createContent: function () {
        var content = this.$$content, $ta;
        
        this.$$content = [];
        
        var collectionHTML = $('<div class="collection-container" />');
        for (var i = 0; i < content.length; i++) {
          collectionHTML.append(content[i].create());
        }
        
        this.$$content.push(collectionHTML);
        this.$$content.push(this.createNewButton());
        
        return this.$$content;
      },
      
      afterCreate: function () {
        this.findContent().find('.collection-container').sortable({
          items: '> .widget'
        });
      },
      
      createNewButton: function () {
        var that = this;
        
        var button = new Psc.UI.Button({
          label: 'add new',
          leftIcon: 'circle-plus',
          classes: ['add-new'],
          click: function(e) {
            e.preventDefault();
            that.appendNew();
          }
        });
        
        return button.create();
      },
      
      appendNew: function () {
        this.findContent().find('.collection-container').append(
          this.createEmptyCollectionable().create()
        );
      },
      
      createEmptyCollectionable: function () {
        return new this.$$collectionable.constructor(
          this.$$collectionable.parameters || { content: undefined }
        );
      },
      
      toString: function() {
        return "[Psc.UI.LayoutManager.CollectionWidget]";
      }
    }
  });
});