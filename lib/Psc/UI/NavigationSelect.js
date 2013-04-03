define(['jquery', 'joose', 'Psc/UI/WidgetWrapper', 'Psc/UI/ComboBox', 'Psc/UI/AutoComplete'], function ($, Joose) {
  Joose.Class('Psc.UI.NavigationSelect', {
    isa: Psc.UI.WidgetWrapper,
    
    has: {
      flat: { is: 'rw', required: true, isPrivate: true},
      displayLocale: { is: 'rw', required: true, isPrivate: true},
      comboBox: { is: 'rw', required: false, isPrivate: true},
      selectItems: { is: 'rw', required: false, isPrivate: true}
    },
    
    after: {
      initialize: function (props) {
        this.linkWidget();
        this.initUI();

        if (props.selected) {
          this.setSelected(props.selected);
        }

        if (props.selectedNodeId) {
          this.setSelectedFromNodeId(props.selectedNodeId);
        }
      }
    },
    
    methods: {
      initUI: function () {
        var $widget = $('<input name="disabled[nav-select]" type="text" />').addClass('psc-cms-ui-combo-box');

        this.$$comboBox = new Psc.UI.ComboBox({
          widget: $widget,
          selectMode: true,
          name: 'disabled[nav-select]',
          autoComplete: new Psc.UI.AutoComplete({
            avaibleItems: this.$$selectItems = this.exportFlat(),
            widget: $widget
          })
        });

        this.unwrap().append($widget);
      },

      "ac": {
        "label": "FX: Sound Giraffe rupft Bl\u00e4tter von einem Ba\u2026 (2-TAF_0078)"
      },
      "identifier": 16,
      "entityName": "sound",
      "tab": {
        "id": "fxsound-16",
        "label": "FX: Sound Giraffe rupft Bl\u00e4tter von einem Ba\u2026 (2-TAF_0078)",
        "url": "\/ajax.php?todo=tabs&ctrlTodo=content.data&ajaxData%5Btype%5D=fxsound&ajaxData%5Bidentifier%5D=16"
      },

      exportFlat: function () {
        var exported = [], node, depth = 0, stack = [null], prevNode, s;

        for (var i=0; i < this.$$flat.length; i++) {
          node = this.$$flat[i];

          // eine neue Ebene beginnt
          if (node.depth > depth) {
            stack.push(prevNode.title[this.$$displayLocale]);

            // eine ebene ist abgeschlossen
          } else if (node.depth < depth) {
            for (s = 1; s <= Math.abs(depth - node.depth); s++) {
              stack.pop();
            }
          }

          depth = node.depth;
          prevNode = node;

          exported.push({
            "label": stack.join(" / ")+" / "+node.title[this.$$displayLocale],
            value: node.id
          });
        }

        return exported;
      },

      setSelected: function (item) {
        this.$$comboBox.setSelected(item);
      },

      // fails silently if node with this id is not found
      setSelectedFromNodeId: function (id) {
        if (id > 0) {
          for (var item, i=0; i<this.$$selectItems.length; i++) {
            item = this.$$selectItems[i];
            if (item.value === id) {
              return this.setSelected(item);
            }
          }
        }

        // do nothing
      },

      onItemSelected: function (callback) {
        this.$$comboBox.getEventManager().bind('combo-box-selected', function (e, item) {
          callback(item);
        });
      },

      getValue: function () {
        return this.$$comboBox.getSelected();
      },

      toString: function () {
        return '[Psc.UI.NavigationSelect]';
      }
    }
  });
});