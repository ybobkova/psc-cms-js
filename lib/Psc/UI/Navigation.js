Joose.Class('Psc.UI.Navigation', {
  
  isa: Psc.UI.WidgetWrapper,
  
  define(['Psc.GuidManager', 'Psc.UI.NavigationNode', 'Psc.Code','Psc.UI.Button'], function() {
  
  has: {
    colWidth: { is : 'rw', required: false, isPrivate: true, init: 50 },
    //tree: { is : 'rw', required: true, isPrivate: true },
    flat: { is : 'rw', required: true, isPrivate: true },
    list: { is : 'r', required: false, isPrivate: true }, // ul im html
    guids: { is: 'rw', required: false, isPrivate: true },
    
    // @TODO hier muss noch languages aus dem CMS ausgelesen werden!
    defaultNode: { is: 'rw', required: false, isPrivate: true }
  },
  
  after: {
    initialize: function () {
      this.$$defaultNode = {
        id: null,
        title: {
          fr: '',
          de: ''
        },
        pageId: null,
        locale: 'de',
        languages: ['fr','de']
      };
      
      this.$$guids = new Psc.GuidManager({});
      this.init();
    }
  },

  methods: {
    init: function () {
      this.linkWidget();
      
      this.$$list = $('<ul class="ui-widget"></ul>').appendTo(this.getNavigationWidget());
      
      //this.initTree();
      this.initFlat();
      this.initHandlers();
      
      var that = this;
      var $widget = this.getNavigationWidget();
      
      $widget.css('position','relative');
      // dat is wichtig, weil das das parent-block element von li ist
      // damit die positions richtig sind
      
      $widget.sortable({
        cancel: false,
        items: 'li',
        grid: [ this.$$colWidth, 1 ],
        cursor: 'inherit',
        start: function (e, ui) {
          var $li = ui.item, node = $li.data('node');
          
          var children = that.findChildren(node);
          if (children.length) {
            node.transport(children);
          }
          
          ui.placeholder.detach(); // detach or jQuery UI will think the placeholder is a menu item
          $widget.sortable( "refresh" ); // The children aren't sortable. We should let jQ UI know.
          $li.after( ui.placeholder ); // reattach the placeholder.
        },
        stop: function (e, ui) {
          var $li = ui.item, node = $li.data('node');
          var relativeLevel = parseInt(ui.position.left / that.getColWidth(),10);
          
          var maxLevel = 0;
          var $parentLi = $li.prev('li');
          if ($parentLi.length) { // nur wenn es ein "parent" - element gibt (parent ist hier gemeint als element darüber)
            maxLevel = ($parentLi.data('node').getLevel()) + 1;
          }
          
          var children = node.getTransport().insertAfter($li);
          
          // 0 <= level <= maxLevel
          var level = Math.min(maxLevel, Math.max(0, node.getLevel() + relativeLevel));
          
          node.setLevel(level); // updates css
        }
      });
    },
    initHandlers: function () {
      var that = this;
      
      var button = new Psc.UI.Button({label: 'Navigations-Punkt hinzufügen',leftIcon:'circle-plus'}),
          $button = button.create().css('margin-top','1.4em');
      
      this.getNavigationWidget().append($button);
      
      $button.on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        that.add( $.extend(true, {}, that.getDefaultNode()) );
      });
      
      this.widget.find('button.psc-cms-ui-button-save').on('click', function (e) {
      });
    },
    initTree: function() {
      var tree = this.$$tree, i, u;
      
      if (tree.length) {
        for (i = 0; i < tree.length; i++) {
          u = tree[i];
          
          if (!u.marked) {
            u.parent = null;
            u.level = 0;
            this.add(u);
            this.visitChildren(u, 1);
          }
        }
      }
    },
    visitChildren: function(u, level) {
      var i, v;
      
      u.marked = true;
      for (i = 0; i < u['__children'].length; i++) {
        v = u['__children'][i];
        
        if (!v.marked) {
          v.parent = u;
          v.level = level;
          this.add(v);
          this.visitChildren(v, level+1);
        }
      }
    },
    initFlat: function() {
      var i,node;
      for (i = 0; i < this.$$flat.length; i++) {
        node = this.$$flat[i];
        
        this.add(node);
      }
    },
    add: function(node) {
      node = new Psc.UI.NavigationNode(node);
      node.setGuid(this.$$guids.create());
      node.setColWidth(this.$$colWidth);
      node.refresh();
      
      this.getList().append(node.html());
    },
    findChildren: function(node) {
      var children = [];
      node.html().nextAll('li').each(function (i, child) {
        var $child = $(child);
        
        if (!$child.hasJoose.Class('ui-sortable-placeholder')) {
          if ($child.data('node').getLevel() > node.getLevel()) {
            children.push(child);
          } else {
            return false; // stop
          }
        }
        
        return true; // continue
      });
      
      return children;
    },
    getNavigationWidget: function () {
      return this.widget.find('fieldset.psc-cms-ui-navigation div.content');
    },
    serialize: function (data) {
      /*
        Für das Speichern mit Gedmo brauchen wir jeweils die parent node jedes einzelnen
        die Reihenfolge ist von oben nach unten durch die liste. Wechselt das Level eins höher haben wir ein neues aktuelles parent
      */
      var flat = [], flatNodes=[], that = this, stack = [null], level = 0, prevNode = null, s;
      
      this.getList().find('li').each(function (i, li) {
        var $li = $(li), node = $li.data('node');
        
        // eine neue Ebene beginnt
        if (node.getLevel() > level) {
          stack.push(prevNode);
          level = node.getLevel();
        // eine ebene ist abgeschlossen
        } else if (node.getLevel() < level) {
          for(s=1; s <= Math.abs(level-node.getLevel()); s++) {
            stack.pop();
          }
          level = node.getLevel();
        }
        
        node.setParent(stack[stack.length-1]); // letzter eintrag auf dem stack ist parent für die node
        prevNode = node;
        
        // warum geht das eigentlich nicht, hM=?! :) blödes json stringify
        flat.push(node.toJSON());
        flatNodes.push(node);
      });
      
      data.bodyAsJSON = JSON.stringify(flat);
      
      return flatNodes;
    },
    toString: function() {
      return "[Psc.UI.Navigation]";
    }
  }
});