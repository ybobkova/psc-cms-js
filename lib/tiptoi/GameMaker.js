define(['tiptoi/GameSimulator', 'Psc/Code', 'Psc/Request', 'Psc/UI/WidgetWrapper', 'Psc/UI/EffectsManager', 'Psc/UI/EffectsManaging', 'Psc.UI.WidgetWrapper'], function() {
  Joose.Class('tiptoi.GameMaker', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.UI.EffectsManaging],
    
    has: {
      main: { is : 'rw', required: false, isPrivate: true },
      buttons: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
      oids: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
      parent: { is : 'rw', required: false, isPrivate: true },
      name: { is : 'rw', required: true, isPrivate: true },
      scale: { is: 'rw', required: false, isPrivate: true},
      
      simulator: { is : 'rw', required: false, isPrivate: true },
      program: { is : 'rw', required: true, isPrivate: true },
      
      // ob es ein bild gibt welches hinterlegt ist
      // falls nicht zeigen wir z. b. oid labels an und so geschichten
      hasLayout: { is : 'rw', required: false, isPrivate: true, init: false }
    },
    
    after: {
      initialize: function (props) {
        //if (props.main) {
          //props.main.getEventManager().triggerEvent('collapse-right'); // pli-pla-platz
        //}
        
        if (this.$$scale.v <= 0 || this.$$scale.v > 2 ||
            this.$$scale.h <= 0 || this.$$scale.h > 2) {
          this.$$scale.v = 1;
          this.$$scale.h = 1;
        }
        
        this.checkWidget();
        this.linkWidget();
        
        this.initUI();
  
        Psc.Code.group('GameMaker: Simulator init');
        Psc.Code.info('startButton', this.findStartButton());
        Psc.Code.info('layout', this.findLayout());
        Psc.Code.info('output', this.findOutput());
        Psc.Code.endGroup();
        
        this.$$simulator = new tiptoi.GameSimulator({
          startButton: this.findStartButton(),
          layout: this.findLayout(),
          output: this.findOutput(),
          program: new tiptoi.Program(props.program)
        });
        this.$$simulator.getEventManager().setLogging(true);
      }
    },
    
    methods: {
      initUI: function () {
        var that = this;
        this.$$parent = that.unwrap().find('> div.left > fieldset > div.content:eq(0)'); // das ist position relative
        
        $.each(this.$$oids, function (key, oid) {
          that.createButton(key, oid);
          that.updateUIPosition(key, oid.offsets);
        });
        
        // click auf einen oid button / div triggered das tip event für den input listener
        // wir machens lieber schnell und uncool unten
        //this.$$parent.on('click', 'div.oid-button', function (e) {
        //});
        
        that.unwrap().find('button.layout-save').on('click', function (e) {
          e.preventDefault();
          var $button = $(this);
          
          $.when ( $.psc.loaded() ).then(function(main) {
            var tabOpenable = Psc.UI.WidgetWrapper.unwrapWidget($button);
            var data = {};
            
            Psc.Code.info('serializing to ', that.getName());
            that.serialize(data);
            Psc.Code.info(data);
            
            var status = main.handleAjaxRequest(new Psc.Request({
              url: tabOpenable.getUrl(),
              method: 'PUT',
              format: 'json',
              body: data
            }), undefined, true);
            
            status.done(function (response) {
              Psc.Code.info('Successful save!');
              that.getEffectsManager().successBlink($button);
            });
  
            status.fail(function (response) {
              Psc.Code.info('save failed!');
              that.getEffectsManager().errorBlink($button);
            });
          });
        });
        
        that.unwrap().find('> div.left button.clear-output').on('click', function (e) {
          that.findOutput().empty();
        });
        
        that.unwrap().find('> div.left button.expand').on('click', function (e) {
          if (that.getMain()) {
            that.getMain().getEventManager().triggerEvent('collapse-right'); // pli-pla-platz
          }
        });
      },
      
      findStartButton: function () {
        return this.unwrap().find('> div.left button.simulator-start');
      },
  
      findOutput: function () {
        return this.unwrap().find('> div.right .simulator-output');
      },
  
      findLayout: function () {
        return this.$$parent;
      },
      
      createButton: function (name, oid) {
        var $button = $('<div class="oid-button" title="'+oid.label+' ('+oid.oid+')">'+(!this.$$hasLayout ? oid.label+' '+oid.oid : '')+'</div>')
            .css('position', 'absolute')
            .draggable({cancel:false});
            
        
        if (this.$$hasLayout) {
          $button
            .resizable({ handles:"all" })
            .css('height', this.scaleh(oid.dimension.height)+'px') // height horizontal scalen
            .css('width', this.scalev(oid.dimension.width)+'px')   // width vertical scalen
            .css('opacity', 0.4)
            .css('background-color', '#ffffff')
            .css('border', '1px solid black');
        }
        
        this.$$buttons[name] = $button;
        $button.appendTo(this.$$parent);
  
        if (!this.$$hasLayout) {
          $button.button({}); // wir machen einen button raus, der ist sichtbarer als das halb-trans kästchen
        }
        
        // qnd
        $button.click(function (e) {
          e.preventDefault();
          $button.trigger('tiptoi-tip', [oid]);
        });
        
        return $button;
      },
      
      // position ist relativ zum parent element (absolut auf dem Bild)
      updateUIPosition: function(name, offsets) {
        var parentOffset = this.$$parent.offset();
        
        // da position setzen nicht relativ geht müssen wir offset umrechnen
        this.$$buttons[name].offset({
          top: this.scaleh(Math.round(offsets.top)) + Math.round(parentOffset.top), // auf px runden
          left: this.scalev(Math.round(offsets.left)) + Math.round(parentOffset.left)
        });
      },
      
      scaleh: function (num) {
        return Math.round(num*this.$$scale.h);
      },
      scalev: function (num) {
        return Math.round(num*this.$$scale.v);
      },
      unscaleh: function (num) {
        return Math.round(num/this.$$scale.h);
      },
      unscalev: function (num) {
        return Math.round(num/this.$$scale.v);
      },
      
      update: function () {
        var that = this;
        $.each(this.$$buttons, function (key) {
          var $button = $(this), pos = $button.position(); // position ist schon relativ zum Bild
          
          that.$$oids[key].offsets = {top: that.unscalev(pos.top), left: that.unscaleh(pos.left)}; 
          that.$$oids[key].dimension = {width: that.unscaleh($button.width()), height: that.unscalev($button.height())};
        });
        return this;
      },
      
      serialize: function (data) {
        var that = this;
        this.update();
        
        $.each(this.$$oids, function (i,oid) {
          data[i] = oid;
        });
        
        //$.extend(data, this.$$oids); // <- das da ist voll evil, weil es den prototype von array mit kopiert
      },
  
      toString: function() {
        return "[tiptoi.GameMaker]";
      }
    }
  });
});