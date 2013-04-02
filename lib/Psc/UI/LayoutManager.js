define([
  'joose',
  'jquery',
  'jquery-ui',
  'Psc/UI/WidgetWrapper',
  'Psc/UI/Button',
  'Psc/Code',
  'Psc/Exception',        
  'Psc/UI/EffectsManaging',
  'Psc/TextParser',
  'Psc/TPL/TemplatesRenderer',
  
  'Psc/UI/LayoutManager/Li',
  'Psc/UI/LayoutManager/Paragraph',
  'Psc/UI/LayoutManager/Headline',
  'Psc/UI/LayoutManager/Image',
  'Psc/UI/LayoutManager/DownloadsList',
  'Psc/UI/LayoutManager/WebsiteWidget',
  
  'ui-connect-morphable'
  ], function (Joose, $) {
  
  Joose.Class('Psc.UI.LayoutManager', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.UI.EffectsManaging, Psc.TextParser],
  
    has: {
      // ui
      accordion: { is : 'rw', required: false, isPrivate: true },
      layout: { is : 'rw', required: false, isPrivate: true },
      control: { is : 'rw', required: false, isPrivate: true },
      magicBox: { is : 'rw', required: false, isPrivate: true },
      controls: { is : 'rw', required: true, isPrivate: true }, // list of Psc.UI.LayoutManager.Control
      
      // formular
      name: { is: 'rw', required: false, isPrivate: true, init: 'layoutManager' },

      // dependency für componenten
      uploadService: { is : 'rw', required: true, isPrivate: true }
    },
    
    after: {
      initialize: function (props) {
        this.checkWidget();
        this.linkWidget();
        this.initUI();
        
        if (props.serializedWidgets) {
          this.unserialize(props.serializedWidgets);
          delete props.serializedWidgets;
        }
      }
    },
    
    methods: {
      initUI: function () {
        var $layoutManager = this.createUI();

        this.$$layout = $layoutManager.find('> div.left fieldset.psc-cms-ui-group > div.content');
        this.$$accordion = $layoutManager.find('> div.right .psc-cms-ui-accordion');

        var that = this, $layout = this.$$layout;

        this.initControls();

        $layout.sortable({
          revert: true,
          cancel: false,
          tolerance: 'pointer',
          disabled: false,
          handle: '> h3.widget-header '
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
        var $section = this.$$accordion.find('div.text-und-bilder');

        for (var i = 0, control; i<this.$$controls.length; i++) {
          control = this.$$controls[i];

          button = new Psc.UI.Button({
            label: control.getLabel()
          });

          $button = button.create();

          // thats slow, i know
          $section.append($button);
          $section.append(' ');

          $button.draggable({
            connectMorphSortable: this.$$layout,
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
          return that.createWidget(control.getType(), control.getParams()).unwrap();
        };
      },
      createUI: function () {
        var renderer = new Psc.TPL.TemplatesRenderer();
        var html = renderer.render('SCE.layout-manager', {});
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
        
        if (Psc.UI.LayoutManager[type]) {
          widget = new Psc.UI.LayoutManager[type](parameters);
        } else {
          throw new Psc.InvalidArgumentException('type','a valid type', type, 'LayoutManager.createWidget()');
        }
        
        widget.create();
        
        return widget;
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
        return this.$$layout.find('div.widget');
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
        
        $widgets.each(function (i, div) {
          var $widget = $(div), widget = that.getLinkedWidget($widget), s;
          
          // cleanup to refresh caches and to remove non necessary elements in widget
          widget.cleanup();

          if (widget.isEmpty()) {
            widget.remove();

          } else {

            s = {type: widget.getType(), label: widget.getLabel()};
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