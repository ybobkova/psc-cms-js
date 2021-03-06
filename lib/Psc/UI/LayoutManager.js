define([
  'joose',
  'jquery',
  'jquery-ui',
  'Psc/UI/WidgetWrapper',
  'Psc/UI/Button',
  'Psc/UI/Group',
  'Psc/Code',
  'Psc/Exception',        
  'Psc/UI/EffectsManaging',
  'Psc/TextParser',
  'Psc/ContainerDepending',
  'Psc/UI/Translating',
  
  'Psc/UI/LayoutManager/Li',
  'Psc/UI/LayoutManager/Paragraph',
  'Psc/UI/LayoutManager/Headline',
  'Psc/UI/LayoutManager/Image',
  'Psc/UI/LayoutManager/DownloadsList',
  'Psc/UI/LayoutManager/WebsiteWidget',
  'Psc/UI/LayoutManager/ContentStreamWrapper',
  'Psc/UI/LayoutManager/CollectionWidget',

  'Psc/UI/LayoutManager/TemplateWidget',
  
  'ui-connect-morphable'
  ], function (Joose, $) {
  
  Joose.Class('Psc.UI.LayoutManager', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.UI.EffectsManaging, Psc.TextParser, Psc.ContainerDepending, Psc.UI.Translating],
      has: {
      // ui
      accordion: { is : 'rw', required: false, isPrivate: true },
      layout: { is : 'rw', required: false, isPrivate: true },
      group: { is : 'rw', required: false, isPrivate: true },
      control: { is : 'rw', required: false, isPrivate: true },
      magicBox: { is : 'rw', required: false, isPrivate: true },
      controls: { is : 'rw', required: true, isPrivate: true }, // list of Psc.UI.LayoutManager.Control

      widgetLabels: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
      
      // formular
      name: { is: 'rw', required: false, isPrivate: true, init: 'layoutManager' },

      // dependency für componenten
      uploadService: { is : 'rw', required: true, isPrivate: true }
    },
    
    after: {
      initialize: function (props) {
        if (props.injectNavigationFlat) {
          this.$$container.getNavigationService().setFlat(props.injectNavigationFlat);
        }

        this.checkWidget();
        this.linkWidget();
        this.initUI();

        this.initControls();
        
        if (props.serializedWidgets) {
          this.unserialize(props.serializedWidgets);
          delete props.serializedWidgets;
        }
      }
    },
    
    methods: {
      initUI: function () {
        var $layoutManager = this.createUI();

        this.$$group = $layoutManager.find('> div.left > fieldset.psc-cms-ui-group');
        this.$$layout =  this.$$group.find('> div.content');
        this.$$right = $layoutManager.find('> div.right');
        this.$$accordion = this.$$right.find('.psc-cms-ui-accordion:first');

        var that = this, $layout = this.$$layout;

        $layout.sortable({
          revert: true,
          cancel: false,
          tolerance: 'pointer',
          disabled: false,
          handle: '> h3.widget-header ',
          morphStop: function (e, $widget) {
            if ($widget.hasClass('contentstreamwrapper')) {
              that.setActiveContentStream($widget);
            }
          }
        });
        
        $layout.droppable({
          hoverClass: 'hover',
          drop: function (event,ui) {
            $layout.trigger('unsaved');
          }
        });
        
        var $magicBox = $layoutManager.find('fieldset.magic-helper textarea.magic-box');
        var $magicButton = $layoutManager.find('fieldset.magic-helper button');
        
        $magicButton.click(function (e) {
          e.preventDefault();
          if ($magicBox.val() !== "") {
            try {
              that.parseText($magicBox.val());
              that.getEffectsManager().successBlink($magicButton);
            } catch (ex) {
              Psc.Code.warn(ex);
              that.getEffectsManager().errorBlink($magicBox.closest('fieldset'));
            }
          }
        });

        this.setActiveContentStream(false);

        this.$$layout.on('click', 'div.contentstreamwrapper', function (e) {
          var $widget = $(e.currentTarget);

          that.setActiveContentStream($widget);
        });

        this.$$right.on('click', '.deactivate-content-stream', function (e) {
          e.preventDefault();
          that.setActiveContentStream(false);
        });

        // kein formular abschicken in headlines, oder textfeldern
        this.$$layout.on('keydown','input', function (e) {
          if (e.keyCode === $.ui.keyCode.ENTER) {
            e.stopImmediatePropagation();
            e.preventDefault(); // nix formular abschicken oder sowas
          }
        });
        
        this.$$layout.on('keyup', function (e) {
          if (e.keyCode === $.ui.keyCode.ENTER) {
            var $ta = $(e.target), $widget,
                  match = $ta.val().match(/[\r\n]{2,}$/);
            
            //var debugTa = $ta.val();
            //debugTa = debugTa.replace(/[\r]/g, "-r-\r");
            //debugTa = debugTa.replace(/[\n]/g, "-n-\n");
            //alert("textarea value: "+debugTa+"\n"+(match ? match.length : 'nix'));
            
            if (match) {
              $widget = $ta.closest("div.widget");
              
              if ($widget.is('.paragraph')) {
                $ta.val(
                  $ta.val().substring(0,$ta.val().length-match[0].length)
                );
              
                var $newWidget = that.createWidget('Paragraph', {content: ''}).unwrap().insertAfter($widget);
                $newWidget.find('textarea').focus();
              
              } else if ($widget.is('.li')) { // Nicht mit <li> verwechseln!
                $ta.val(
                  $ta.val().substring(0,$ta.val().length-match[0].length)
                );
                
                var $newTa = that.createTextarea().insertAfter($ta).after('<br />').focus();
              }
            }
          }
        });
      },
      initControls: function () {
        var that = this, button, $button;
        var $section, $el;

        var findSortables = function () {
          return that.unwrap().parent().find('.active-content-stream-container div.content-stream:first');
        };

        for (var i = 0, control; i<this.$$controls.length; i++) {
          control = this.$$controls[i];
          $section = this.$$accordion.find('div.'+control.getSection());

          button = new Psc.UI.Button({
            label: control.getLabel()
          });

          that.$$widgetLabels[control.getType()] = control.getLabel();

          $button = button.create();

          // thats slow, i know
          $section.append($button);
          $section.append(' ');

          $button.draggable({
            connectMorphSortable: findSortables,
            helper: this.getWidgetCreateClosure(control),
            morph: this.getWidgetCreateClosure(control),
            cancel: false,
            revert: "invalid",
            revertDuration: 200,
            scroll: 'true',
            scrollSpeed: 40,
            appendTo: 'body',
            disabled: false
          });

        }
      },
      getWidgetCreateClosure: function (control) {
        var that = this;

        return function () {
          return that.createWidget(control.getType(), $.extend({}, control.getParams(), {label: control.getLabel()})).unwrap();
        };
      },
      createUI: function () {
        var sections = [], sect = {}, ctrlSection, sectionLabels = {
          'teasers': 'Teaser',
          'text-und-bilder': 'Texte und Bilder',
          'images': 'Bilder',
          'text-layout': 'Text-Layout',
          'text': 'Texte',
          'misc': 'Sonstige'
        };

        for (var i = 0, control; i<this.$$controls.length; i++) {
          control = this.$$controls[i];
          ctrlSection = control.getSection();

          if (!sect[ctrlSection]) {
            sect[ctrlSection] = true;
            sections.push({
              'label': this.trans('sce.widget.categories.'+ctrlSection),
              'name': ctrlSection
            });
          }
        }

        var html = this.$$container.getTemplatesRenderer().render('SCE.layout-manager', {
          sections: sections
        });
        var $html = $(html);

        this.unwrap().append($html);

        return $html;
      },
      createTextarea: function (content) {
        if (!content) content = '';
        
        return $('<textarea class="paragraph" name="disabled[layout-manager-component]" cols="120" rows="5" style="width: 100%; min-height: 120px">'+content+'</textarea>');
      },
      
      createWidget: function (type, parameters) {
        var that = this, widget;
        parameters = parameters || {};
        parameters.uploadService = this.getUploadService();
        parameters.container = this.$$container;
        parameters.navigationService = this.$$container.getNavigationService(); // to decouple more classes from container
        if (!parameters.label) {
          parameters.label = this.$$widgetLabels[type];
        }

        Psc.Code.info('CreateWidget ', type, parameters);
        
        if (Psc.UI.LayoutManager[type]) {
          widget = new Psc.UI.LayoutManager[type](parameters);
        } else {
          throw new Psc.InvalidArgumentException('type','a valid type', type, 'LayoutManager.createWidget()');
        }
        
        widget.create();
        
        return widget;
      },

      setActiveContentStream: function ($widget) {
        var active = 'active-content-stream-container';
        this.$$group.parent().find('.'+active).removeClass(active);

        if (!$widget) {
          this.$$group.addClass(active);
          this.$$right.find('fieldset.content-stream-active').hide();
        } else {
          $widget.addClass(active);
          this.$$right.find('fieldset.content-stream-active').show();
        }
      },
      parseText: function (text) {
        var parser = new Psc.TextParser({});
        var tokens = parser.parse(text), token, className, map = {
          'list': 'Li',
          'paragraph': 'Paragraph',
          'headline': 'Headline'
        };
        
        for (var i = 0; i<tokens.length; i++) {
          token = tokens[i];
          
          if (!map[token.type]) {
            throw new Psc.Exception('unexpected parsed token '+token.type);
          }
          
          className = map[token.type];
          
          this.appendWidget(this.createWidget(className, {content: token.value}));
        }
      },
      
      /**
       * fügt ein Widget dem LayoutManager ans Ende hinzu
       *
       * @return Psc.UI.LayoutManagerComponent
       */
      appendWidget: function (widget) {
        this.$$layout.append(widget.unwrap());

        return this;
      },
      
      /**
       * Gibt die HTML-Widgets des aktuellen Layouts zurück
       * 
       */
      getWidgets: function () {
        return this.$$layout.find('> div.widget');
      },
      
      getLinkedWidget: function($widget) {
        return Psc.UI.WidgetWrapper.unwrapWidget($widget, Psc.UI.LayoutManagerComponent);
      },
      
      /**
       */
      unserialize: function (serialized) {
        var that = this, widgets = [];
        
        /* unpack wenn es direkt die ausgabe von serialize() ist */
        if (serialized[this.$$name]) {
          serialized = serialized[this.$$name];
        }
        
        $.each(serialized, function (i, s) {
          var widget = that.createWidget(s.type, s);
          that.appendWidget(widget);
          widgets.push(widget);
        });
  
        return widgets;
      },
      
      serialize: function (serialized) {
        var $widgets = this.getWidgets(), that = this;
        var data = [];

        // siehe auch content stream widget        
        $widgets.each(function (i, div) {
          var $widget = $(div), widget = that.getLinkedWidget($widget), s;
          
          // cleanup to refresh caches and to remove non necessary elements in widget
          widget.cleanup();

          if (widget.isEmpty()) {
            widget.remove();

          } else {

            s = {type: widget.getType()};
            widget.serialize(s);
            data.push(s);
          }

        });
        
        serialized[this.getName()] = data;
        
        return serialized;
      },
  
      toString: function() {
        return "[Psc.UI.LayoutManager]";
      }
    }
  });
});  