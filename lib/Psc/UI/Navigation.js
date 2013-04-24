/*globals confirm:true*/
define(['joose', 'jqwidgets', 'Psc/GuidManager', 'Psc/UI/NavigationNode', 'Psc/Code', 'Psc/UI/Button', 'Psc/UI/WidgetWrapper', 'Psc/UI/Controlling'], function(Joose) {
  Joose.Class('Psc.UI.Navigation', {
    isa: Psc.UI.WidgetWrapper,

    does: [Psc.UI.Controlling],

    has: {
      colWidth: {
        is: 'rw',
        required: false,
        isPrivate: true,
        init: 50
      },
      flat: {
        is: 'rw',
        required: true,
        isPrivate: true
      },
      list: {
        is: 'r',
        required: false,
        isPrivate: true
      }, // ul im html
      guids: {
        is: 'rw',
        required: false,
        isPrivate: true
      },
      languages: {
        is: 'rw',
        required: true,
        isPrivate: true
      },
      // @TODO hier muss noch languages aus dem CMS ausgelesen werden!
      defaultNode: {
        is: 'rw',
        required: false,
        isPrivate: true
      }
    },

    after: {
      initialize: function() {
        this.$$defaultNode = {
          id: null,
          title: {
            fr: '',
            de: ''
          },
          depth: 0,
          pageId: null,
          parentId: null,
          locale: 'de',
          languages: this.$$languages
        };

        this.$$guids = new Psc.GuidManager({});
        this.init();
      }
    },

    methods: {
      init: function() {
        this.checkWidget();
        this.linkWidget();

        this.$$list = this.getNavigationWidget().find('ul.ui-widget');

        if (!this.$$list.length) {
          this.$$list = $('<ul class="ui-widget"></ul>').appendTo(this.getNavigationWidget());
        }

        this.initFlat();
        this.initHandlers();

        var that = this;
        var $widget = this.getNavigationWidget();

        $widget.css('position', 'relative');
        // dat is wichtig, weil das das parent-block element von li ist
        // damit die positions richtig sind

        $widget.sortable({
          cancel: false,
          items: 'li',
          grid: [this.$$colWidth, 1],
          cursor: 'inherit',
          start: function(e, ui) {
            var $li = ui.item,
              node = $li.data('node');

            var children = that.findChildren(node);
            if (children.length) {
              node.transport(children);
            }

            ui.placeholder.detach(); // detach or jQuery UI will think the placeholder is a menu item
            $widget.sortable("refresh"); // The children aren't sortable. We should let jQ UI know.
            $li.after(ui.placeholder); // reattach the placeholder.
          },
          stop: function(e, ui) {
            var $li = ui.item,
              node = $li.data('node');
            var relativeDepth = parseInt(ui.position.left / that.getColWidth(), 10);

            var maxDepth = 0;
            var $parentLi = $li.prev('li');
            if ($parentLi.length) { // nur wenn es ein "parent" - element gibt (parent ist hier gemeint als element darüber)
              maxDepth = ($parentLi.data('node').getDepth()) + 1;
            }

            var children = node.getTransport().insertAfter($li);

            // 0 <= depth <= maxDepth
            var depth = Math.min(maxDepth, Math.max(0, node.getDepth() + relativeDepth));

            node.setDepth(depth); // updates css

            $widget.trigger('unsaved');
          }
        });
      },
      initHandlers: function() {
        var that = this;

        var button = new Psc.UI.Button({
          label: 'Navigations-Punkt hinzufügen',
          leftIcon: 'circle-plus'
        }),

        $bottomButton = button.create().css('margin-top', '1.4em'),
        $topButton = button.create().css('margin-bottom', '1.4em');

        var $widget = this.getNavigationWidget();

        $widget.append($bottomButton);
        $widget.prepend($topButton);

        $bottomButton.on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          var node = that.add($.extend(true, {}, that.getDefaultNode()), 'bottom');

          that.getNavigationWidget().trigger('unsaved');

          node.openEditDialog();
        });

        $topButton.on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          var node = that.add($.extend(true, {}, that.getDefaultNode()), 'top');

          that.getNavigationWidget().trigger('unsaved');

          node.openEditDialog();
        });

        $widget.on('click', 'button.open-page', function (e) {
          var $target = $(e.currentTarget);
          e.preventDefault();

          var node = $target.closest('li').data('node');

          that.getUIController().openTab('page', node.getPageId(), {label: 'Seite für Navigations-Punkt: '+node.getTitle()});
        });

        $widget.on('click', 'button.delete', function (e) {
          var $button = $(e.currentTarget);
          e.preventDefault();
          e.stopImmediatePropagation();
          
          if (confirm('Sie sind dabei den Navigations-Punkt und alle darunter eingerückten Navigations-Punkte zu löschen.') === true) {
            $button.trigger('unsaved');
            $button.closest('li').remove();
          }
        });

        $widget.on('click', 'button.edit', function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();

          var $target = $(e.currentTarget);

          $target.closest('li').data('node').openEditDialog();
        });
      },
      initFlat: function() {
        var i, node, html = [];
        for (i = 0; i < this.$$flat.length; i++) {
          node = this.$$flat[i];

          node = this.add(node, 'bottom', true);
          html.push(node.html());
        }

        this.getList().append(html);
      },
      add: function(node, where, withoutHtml) {
        node.uiController = this.getUIController();
        node = new Psc.UI.NavigationNode(node);
        node.setGuid(this.$$guids.create());
        node.setColWidth(this.$$colWidth);
        node.refresh();

        if (!withoutHtml) {
          if (where === 'top') {
            this.getList().prepend(node.html());
          } else {
            this.getList().append(node.html());
          }
        }

        return node;
      },
      findChildren: function(node) {
        var children = [];
        node.html().nextAll('li').each(function(i, child) {
          var $child = $(child);

          if (!$child.hasClass('ui-sortable-placeholder')) {
            if ($child.data('node').getDepth() > node.getDepth()) {
              children.push(child);
            } else {
              return false; // stop
            }
          }

          return true; // continue
        });

        return children;
      },
      getNavigationWidget: function() {
        return this.widget.find('fieldset.psc-cms-ui-navigation div.content');
      },
      serialize: function(data) {
        /*
          Für das Speichern mit Gedmo brauchen wir jeweils die parent node jedes einzelnen
          die Reihenfolge ist von oben nach unten durch die liste. Wechselt das Depth eins höher haben wir ein neues aktuelles parent
        */
        var flat = [],
          flatNodes = [],
          that = this,
          stack = [null],
          depth = 0,
          prevNode = null,
          s;

        this.getList().find('li').each(function(i, li) {
          var $li = $(li),
            node = $li.data('node');

          // eine neue Ebene beginnt
          if (node.getDepth() > depth) {
            stack.push(prevNode);
            depth = node.getDepth();
            // eine ebene ist abgeschlossen
          } else if (node.getDepth() < depth) {
            for (s = 1; s <= Math.abs(depth - node.getDepth()); s++) {
              stack.pop();
            }
            depth = node.getDepth();
          }

          node.setParent(stack[stack.length - 1]); // letzter eintrag auf dem stack ist parent für die node
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
});