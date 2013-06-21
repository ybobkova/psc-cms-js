/*globals confirm:true*/
define(['joose', 'Psc/UI/Dialog', 'Psc/UI/FormBuilding', 'Psc/UI/FormReading', 'Psc/UI/Button', 'Psc/UI/Controlling', 'Psc/UI/Translating'], function(Joose) {
  Joose.Class('Psc.UI.NavigationNode', {
    
    does: [Psc.UI.FormBuilding, Psc.UI.FormReading, Psc.UI.Button, Psc.UI.Controlling, Psc.UI.Translating],
    
    has: {
      id: { is : 'rw', required: false, isPrivate: true },
      title: { is : 'rw', required: true, isPrivate: true },
      depth: { is : 'rw', required: true, isPrivate: true },
      pageId: { is : 'rw', required: true, isPrivate: true },
      pageIsActive: { is : 'rw', required: false, isPrivate: true, init: false },
      image: { is : 'rw', required: false, isPrivate: true }, // string
      
      locale: { is : 'rw', required: true, isPrivate: true },
      languages: { is : 'rw', required: true, isPrivate: true },
      parent: { is : 'rw', required: false, isPrivate: true },
      children: { is : 'rw', required: false, isPrivate: true },
      li: { is : '', required: false, isPrivate: true },
      colWidth: { is : 'rw', required: false, isPrivate: true },
      guid: { is : 'rw', required: false, isPrivate: true },
      
      dialog: { is : 'rw', required: false, isPrivate: true },
      showContentButtons: { is : 'rw', required: false, isPrivate: true, init: false }
    },
    
    methods: {
      transport: function ($children) {
        var $transport = this.html().find('.transport');
        $transport.append($children);
      },
      getTransport: function () {
        return this.html().find('.transport').children();
      },
      html: function () {
        if (!this.$$li) {
          this.$$li = $('<li class="ui-state-default ui-corner-all"></li>');
          
          var $buttonPanel = $('<div class="button-panel"/>');
          
          if (this.$$pageId > 0) {
            $buttonPanel.append(this.htmlPageButton());
          } else {
            $buttonPanel.append(this.htmlNoPageButton());
          }
          
          this.$$li.append(
            $buttonPanel
              .append(this.htmlEditButton())
              .append(this.htmlDeleteButton())
          );
          this.$$li.append('<span class="title">'+this.getTitle()+'</span>');
          this.$$li.append('<ul class="transport"></ul>');
          this.$$li.data('node',this);
        }
        
        return this.$$li;
      },
      htmlEditButton: function() {
        var $button = $('<button class="psc-cms-ui-button edit ui-button ui-widget ui-state-default ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-pencil"></span><span class="ui-button-text">'+this.trans('navigation.node.edit')+'</span></button>');
        
        return $button;
      },
      htmlDeleteButton: function() {
        var $button = $('<button class="psc-cms-ui-button delete ui-button ui-widget ui-state-default ui-button-text-icon-primary ui-corner-right" ><span class="ui-button-icon-primary ui-icon ui-icon-trash"></span><span class="ui-button-text">'+this.trans('navigation.node.del')+'</span></button>');
        
        return $button;
      },
      
      htmlPageButton: function () {
        var icon = this.$$pageIsActive ? 'check' : 'cancel';

        var $button = $(
            '<button class="open-page psc-cms-ui-button ui-button ui-widget ui-state-default ui-button-text-icons ui-corner-left" role="button" aria-disabled="false" title="'+this.trans('navigation.tooltip.hasPage')+'">'+
            '<span class="ui-button-icon-primary ui-icon ui-icon-script"></span>'+
            '<span class="ui-button-text">'+this.trans('navigation.pageLink')+'</span>'+
            '<span class="ui-button-icon-secondary ui-icon ui-icon-'+icon+'"></span>'+
            '</button>'
        );

        return $button;
      },
  
      htmlNoPageButton: function () {
        var button = new Psc.UI.Button({
          leftIcon: 'close',
          label: 'keine Seite'
        });
        
        return button.create().attr('title', this.trans('navigation.tooltip.hasNotPage'));
      },
      
      openEditDialog: function () {
        var that = this;
        
        this.$$dialog = new Psc.UI.Dialog({
          title: this.getTitle()+' bearbeiten',
          guid: this.$$guid+'-edit-dialog',
          onCreate: function (e, dialog) {
            that._createDialog(dialog);
          },
          onSubmit: function (e, eventDialog, $eventDialog) {
            that._submitDialog(eventDialog);
          }
        });
        
        this.$$dialog.open();
      },
      
      _createDialog: function (dialog) {
        var that = this, fb = this.$$formBuilder, lang;
        fb.open();
        
        for (var i=0; i<this.$$languages.length; i++) {
          lang = this.$$languages[i];
          fb.textField("Title ("+lang+")", 'title-'+lang, that.getTitle(lang));
        }
        
        //fb.textField("Navigations-Bild", 'image', that.getImage());

        var $form = fb.build(), ui = this.getUIController(), tabButtonItem;

        if (this.$$id > 0 && that.$$showContentButtons) {
          for (i=0; i<this.$$languages.length; i++) {
            lang = this.$$languages[i];

            tabButtonItem = ui.createTabButtonItem(
              ui.tab('navigation-node', this.$$id, ['contentstream', lang], "Navigationsinhalt: "+this.getTitle(lang)+" ("+lang.toUpperCase()+")"),
              ui.button("Navigationsinhalt bearbeiten ("+lang.toUpperCase()+")", 1)
            );

            $form.append(tabButtonItem.unwrap());
          }
        }

        dialog.setContent($form);

        $form.on('click', '.psc-cms-ui-button', function () {
          window.setTimeout(function () {
            dialog.close();
          }, 300);
        });
      },
      
      _submitDialog: function (dialog) {
        var that = this, locale, titleRx = /title-([a-zA-Z_]+)/;
        var $form = dialog.unwrap().find('form');
        
        if ($form.length) {
          $.each(this.readForm($form), function (field, value) {
            if (field === 'pageId') {
              that.setPageId(value);
            } else if((locale = field.match(titleRx)) !== null) {
              that.$$title[locale[1]] = value;
              that.refreshTitle();
            } else if (field === 'image') {
              that.setImage(value);
            }
          });
        }
      },
      
      setPageId: function (id) {
        this.$$pageId = id;
        return this;
      },
      
      remove: function () {
        if (this.$$li) {
          this.$$li.remove();
          this.$$li = undefined;
        }
      },
      refresh: function (oldDepth) {
        var $html = this.html();
        
        $html.css('margin-left',3+this.$$depth*this.getColWidth());
          
        if (oldDepth) {
          $html.removeClass('depth-'+oldDepth);
        }
        
        $html.addClass('depth-'+this.$$depth);
        
        return this;
      },
      refreshTitle: function () {
        if (this.$$li.length) {
          this.$$li.find('span.title').html(this.getTitle());
        }
      },
      setDepth: function(depth) {
        var oldDepth = this.$$depth;
        this.$$depth = depth;
        this.refresh(oldDepth);
      },
      getTitle:function(locale) {
        if (!locale) locale = this.$$locale;
        return this.$$title[locale];
      },
      
      toJSON: function () {
        return {
          id: this.$$id,
          title: this.$$title,
          parent: this.$$parent,
          depth: this.$$depth,
          guid: this.$$guid,
          pageId: this.$$pageId,
          image: this.$$image
        };
      },
      toString: function() {
        return "[Psc.UI.NavigationNode]";
      }
    }
  });
});