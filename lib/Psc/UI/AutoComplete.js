/*globals alert:true*/
define(['joose', 'jquery', 'Psc/UI/WidgetWrapper', 'Psc/UI/EffectsManager','Psc/AjaxHandler','Psc/Request','Psc/Exception','Psc/Code', 'Psc/ResponseMetaReader', 'Psc/EventDispatching'], function(Joose, $) {
  /**
   * Ein Wrapper für ein AutoComplete
   *
   * sendet mit einem ajaxHandler den Request an die übergebene URL
   * oder
   * filtert nach angegebenen elementen (avaibleItems). Sollten anonyme Objekte sein die mindestens .label als Property haben (nach diesem wird gefiltert)
   *
   * events
   *  auto-complete-open({autoComplete:}, [items, response])  // response fehlt bei ohne ajax natürlich
   *  auto-complete-notfound', {autoComplete:}, [searchterm]  // wenn zwar gesucht wurde, aber nichts gefunden (feld blinkt rot)
   *
   * @TODO delay,autoFoxus,minLength sollten direkt ans Widget delegiert werden (das müsste ja ganz gut mit handle gehen), das könnten wir im widgetWrapper machen
   */
  Joose.Class('Psc.UI.AutoComplete', {
    isa: Psc.UI.WidgetWrapper,
    
    does: Psc.EventDispatching,
  
    has: {
      autoFocus: { is : 'rw', required: false, isPrivate: true, init: false },
      delay: { is : 'rw', required: false, isPrivate: true, init: 300 },
      minLength: { is : 'rw', required: false, isPrivate: true, init: 2 },
      maxResults: { is : 'rw', required: false, isPrivate: true },
      
      effectsManager: { is: 'rw', required: false, isPrivate: true },
      ajaxHandler: { is: 'rw', required: false, isPrivate: true },
      
      // das..
      url: { is: 'rw', required: false, isPrivate: true },
      body: { is: 'rw', required: false, isPrivate: true },
      method: { is : 'rw', required: false, isPrivate: true, init: 'GET' },
      // oder das required
      avaibleItems: { is: 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function (props) {
        if (!props.effectsManager) {
          this.$$effectsManager = new Psc.UI.EffectsManager();
        }
        
        if (!props.body) {
          this.$$body = {autocomplete: 'true'};
        }
        
        if (!props.ajaxHandler) {
          this.$$ajaxHandler = new Psc.AjaxHandler();
        }
        
        if (!props.url && !props.avaibleItems) {
          throw new Psc.Exception('Entweder muss url für ajax gesetzt sein. Oder avaibleItems für filtering.');
        }
        
        this.checkWidget();
        this.initWidget();
      }
    },
  
    methods: {
      initWidget: function() {
        var $input = this.unwrap();
        
        if (!$input.is('input')) {
          Psc.Code.debug('exception element', $input);
          throw new Psc.Exception('Autocomplete kann nicht zu einem anderen Element als input attached werden.');
        }
        
        $input.autocomplete({
          delay: this.$$delay,
          minLength: this.$$minLength,
          autoFocus: this.$$autoFocus,
          source: this.getSourceHandler(),
          focus: function(e) {
            // prevent value inserted on focus
            return false;
          },
          select: this.getSelectHandler()
        });
        
        var autoComplete = this.widget.data('autocomplete');
        this.widget.on('keydown', function (e) {
          // don't navigate away from the field on tab when selecting an item
          if (e.keyCode === $.ui.keyCode.TAB && autoComplete.menu.active) {
            e.preventDefault();
          }
          
          if (e.keyCode === $.ui.keyCode.ENTER) {
            e.preventDefault();
          }
        });
      },
      
      /**
       * Sucht automatisch nach einem Suchstring und öffnet das Menu
       *
       * @param string term
       */
      search: function (term) {
        this.unwrap().autocomplete('search', term);
        return this;
      },
      
      /**
       * Öffnet das Such-Menu (alle Einträge)
       *
       * wenn man das Menu für einen bestimmten Eintrag öffnen möchte muss man search benutzen
       */
      open: function () {
        this.search("");
        return this;
      },
      /**
       *
       * immer wenn url gesetzt wird, nehmen wir das als ajax request
       * ansonsten versuchen wir avaibleItems als Suchergebnis
       */
      getSourceHandler: function () {
        var that = this;
        
        if (this.$$url) {
          return this.getAjaxSourceHandler();
        } else {
          return this.getItemsSourceHandler();
        }
      },
      getAjaxSourceHandler: function () {
        var that = this;
        
        return function(acRequest, acResponse) {
          var acInput = that.unwrap();
          var body = $.extend({}, that.getBody(), {search: acRequest.term});
          
          if (that.getMaxResults()) {
            body.maxResults = that.getMaxResults();
          }
        
          var request = new Psc.Request({
            url: that.getUrl(),
            method: that.getMethod(),
            body: body,
            format: 'json'
          });
        
          that.removeMaxResultsInfo();
          that.getAjaxHandler().handle(request)
            .done(function (response) {
              var items = response.getBody();
              
              try {
                var meta = new Psc.ResponseMetaReader({response: response});
                if (meta.get(['acInfo', 'maxResultsHit']) > 0) {
                  that.displayMaxResultsInfo(meta.get(['acInfo', 'maxResultsHit']));
                }
              } catch (e) {
                // wir verhindern hier, dass was funktionales kaputt geht
                Psc.Code.warning(e);
              }
              
            
              if (!items.length) {
                that.getEffectsManager().blink(acInput);
                that.getEventManager().triggerEvent('auto-complete-notfound', {autoComplete: that}, [acRequest.term]);
              } else {
                // items im menu anzeigen
                acResponse(items);
              
                that.getEventManager().triggerEvent('auto-complete-open', {autoComplete: that}, [items, response]);
              }
            })
            .fail(function (response) {
              alert('Leider ist ein unerwarteter Fehler aufgetreten '+response);
            });
        };
      },
      getItemsSourceHandler: function () {
        var that = this;
        
        return function(acRequest, acResponse) {
          var acInput = that.unwrap();
          
          var matcher = new RegExp( $.ui.autocomplete.escapeRegex(acRequest.term), "i" );
          
          // match items
          var items;
          if (!acRequest.term) {
            items = that.getAvaibleItems();
          } else {
            items = $.map(that.getAvaibleItems(), function(item) {
              if (matcher.test(item.label)) {
                return item;
              } else {
                return undefined;
              }
            });
          }
  
          if (!items.length) {
            that.getEventManager().triggerEvent('auto-complete-notfound', {autoComplete: that}, [acRequest.term]);
            that.getEffectsManager().blink(acInput);
          } else {
            // items im menu anzeigen
            acResponse(items);
            
            that.getEventManager().triggerEvent('auto-complete-open', {autoComplete: that}, [items]);
          }
        };
      },
      getSelectHandler: function() {
        var that = this;
        var element = that.unwrap();
        
        return function (e, ui) {
          e.preventDefault();
          
          if (!ui.item) {
            throw new Psc.Exception('ui.item ist nicht gesetzt.');
          }
          
          that.getEventManager().triggerEvent('auto-complete-select', {}, [ui.item]);
          
          if (ui.item.tab) {
            var tab = new Psc.UI.Tab(ui.item.tab);
            
            //var item = new Psc.CMS.Item({
            //  trait: Psc.CMS.TabOpenable,
            //  tab: ui.item.tab
            //});
            //var tab = item.getTab();
          
            that.getEventManager().triggerEvent('tab-open', {source: 'autoComplete', autoComplete: that}, [tab, element]);
          } else {
            // das ist schon okay, weil das event auch schon ausreichend sein kann
            //throw new Psc.Exception('was anderes außer tab ist nicht implementiert: '+Psc.Code.varInfo(ui.item));
          }
        };
      },
      
      displayMaxResultsInfo: function (maxResults) {
        var $infoSpan = this.unwrap().nextAll('.ac-info');
        
        if (!$infoSpan.length) {
          $infoSpan =
            $('<span class="ui-state-error-text ac-info"></span>')
              .attr('title', 'Es werden nicht alle Suchergebnisse angezeigt. Das Ergebnis wurde auf '+maxResults+' eingeschränkt')
              .append(
                $('<a></a>')
                  .attr('title', 'Es werden nicht alle Suchergebnisse angezeigt. Das Ergebnis wurde auf '+maxResults+' eingeschränkt')
                  .button({
                    icons: {
                      primary: "ui-icon-alert"
                    },
                    text: false
                  })
              );
          
          var $after = this.unwrap().next('button'); // wenn es im select-mode den button rechts neben der box gibt
          if (!$after.length) {
            $after = this.unwrap(); 
          }
          $after.after($infoSpan);
        }
        
      },
      
      removeMaxResultsInfo: function () {
        Psc.Code.info('removing info');
        var $infoSpan = this.unwrap().nextAll('.ac-info');
        
        if ($infoSpan.length) {
          $infoSpan.remove();
        }
      },
      
      isOpen: function() {
        return this.unwrap().autocomplete("widget").is( ":visible" );
      },
      
      setMinLength: function(length) {
        this.$$minLength = length;
        this.unwrap().autocomplete('option', 'minLength', length);
        return this;
      },
  
      setDelay: function(delay) {
        this.$$delay = delay;
        this.unwrap().autocomplete('option', 'delay', delay);
        return this;
      },
      
      toString: function() {
        return "[Psc.UI.AutoComplete]";
      }
    }
  });
}); 