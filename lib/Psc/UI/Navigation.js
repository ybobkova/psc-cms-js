/*globals confirm:true*/
define(['joose', 'jquery', 'jqwidgets', 'Psc/GuidManager', 'Psc/UI/NavigationNode', 'Psc/Code', 'Psc/UI/Button', 'Psc/UI/WidgetWrapper', 'Psc/UI/Controlling', 'Psc/UI/Translating', 'ui-nestable'], function(Joose, $) {
  Joose.Class('Psc.UI.Navigation', {
    isa: Psc.UI.WidgetWrapper,

    does: [Psc.UI.Controlling, Psc.UI.Translating],

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
      options: {
        is: 'r',
        required: false,
        isPrivate: true
      },
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
      defaultNode: {
        is: 'rw',
        required: false,
        isPrivate: true
      },

      showContentButtons: { is : 'rw', required: false, isPrivate: true, init: false }
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
          locale: this.getLocale(),
          languages: this.$$languages,
          showContentButtons: this.$$showContentButtons
        };

        this.$$guids = new Psc.GuidManager({});
        this.init();
      }
    },

    methods: {
      init: function() {
        this.checkWidget();
        this.linkWidget();

        this.$$options = {
          listNodeName: 'ul',
          itemNodeName: 'li',
          listClass: 'dd-list ui-widget',
          expandBtnHTML: '',
          collapseBtnHTML: '',
          maxDepth: 20,
          placeClass: 'ui-state-highlight ui-corner-all'
        };

        var $nestable = this.getNavigationWidget().find('.dd').first();

        if (!$nestable.length) {
          $nestable = $('<div class="dd"></div>').appendTo(this.getNavigationWidget());
        }

        this.$$list = this.initFlat($nestable);

        this.initHandlers();

        $nestable
           .nestable(this.$$options)
           .on('change', function() {
              $nestable.trigger('unsaved');
          });
      },
      initHandlers: function() {
        var that = this;

        var button = new Psc.UI.Button({
          label: that.trans('navigation.addNode'),
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

          that.getUIController().openTab('page', node.getPageId(), {label: that.transf('navigation.openPage', [node.getTitle()])});
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
      initFlat: function($container) {
        var $rootList = $('<ul class="dd-list ui-widget"></ul>');
        /*
        var i, node;
        for (i = 0; i < this.$$flat.length; i++) {
          node = this.$$flat[i];

          node.uiController = this.getUIController();
          node = new Psc.UI.NavigationNode(node);
          node.setGuid(this.$$guids.create());
          node.setColWidth(this.$$colWidth);

          $rootList.append(node.html());
        }
        */

        var stack = [$rootList],
            depth = 0,
            prevNode = null,
            $prevList;

        var i, node;
        for (i = 0; i < this.$$flat.length; i++) {
          node = this.$$flat[i];
  
          node.uiController = this.getUIController();
          node = new Psc.UI.NavigationNode(node);
          node.setGuid(this.$$guids.create());
          node.setColWidth(this.$$colWidth);

          if (node.getDepth() > depth) {
            // new 
            $prevList = $('<ul class="dd-list ui-widget"></ul>');
            prevNode.html().append($prevList);
            stack.push($prevList);

            depth = node.getDepth();
          } else if (node.getDepth() < depth) {
            // level end
            for (var s = 1; s <= Math.abs(depth - node.getDepth()); s++) {
              stack.pop();
            }
            depth = node.getDepth();
          }

          $parentList = stack[stack.length-1];
          $parentList.append(node.html());

          prevNode = node;
        }

        $container.append($rootList);

        return $rootList;
      },
      add: function(node, where, withoutHtml) {
        node.uiController = this.getUIController();
        node = new Psc.UI.NavigationNode(node);
        node.setGuid(this.$$guids.create());
        node.setColWidth(this.$$colWidth);

        if (!withoutHtml) {
          if (where === 'top') {
            this.getList().prepend(node.html());
          } else {
            this.getList().append(node.html());
          }
        }

        return node;
      },
      getNavigationWidget: function() {
        return this.widget.find('fieldset.psc-cms-ui-navigation div.content');
      },

      serialize: function(data) {
        var options = this.$$options;

        var flat = [],
            flatNodes = [],
            list = this;

        var DFS = function ($list, parent, depth) {
            $list.children(options.itemNodeName).each(function() {
                var $li = $(this);
                var node = $li.data('node');

                node.setParent(parent);

                flat.push(node.toJSON());
                flatNodes.push(node);

                var $subList = $li.children(options.listNodeName);

                if ($subList.length) {
                    DFS($subList, node, depth+1);
                }
            });
        };

        DFS(this.getList(), null, 0);

        data.bodyAsJSON = JSON.stringify(flat);

        return flatNodes;
      },
      toString: function() {
        return "[Psc.UI.Navigation]";
      }
    }
  });
});