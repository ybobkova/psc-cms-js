/*globals confirm:true alert:true*/
define([
    'Psc/AjaxFormHandler', 'Psc/FormRequest', 'Psc/ResponseMetaReader', 'Psc/UI/FormController',
    'Psc/InvalidArgumentException', 'Psc/Exception', 'Psc/Code', 'Psc/Loader',
    'Psc/UI/WidgetWrapper',
    'Psc/UI/Tabs', 'Psc/UI/Tab', 'Psc/UI/Spinner', 'Psc/UI/ErrorPane',
    'Psc/EventDispatching', 'Psc/UI/EffectsManaging'
    
  ], function () {
  
  /**
   *
   * events
   *
   *  tab-open({source: string}, [Psc.UI.Tab tab, jQuery $target])
   *    $target ist das element welches "tab-open" getriggered hat
   *    source im Event k
   *
   *  item-deleted( {deleter: main}, [Psc.CMS.Deleteable] ); (nur ducktyped)
   *  item-changed( {changer: main}, [Psc.CMS.FastItem] ); 
   */
  Joose.Class('Psc.UI.Main', {
    
    does: [Psc.EventDispatching, Psc.UI.EffectsManaging],
    
    has: {
      ajaxFormHandler: { is : 'rw', required: false, isPrivate: true },
      spinner: { is : 'rw', required: false, isPrivate: true },
      tabs: { is: 'rw', required: true, isPrivate: true },
      /*
       Der Aktuelle Loader
       
       dieser ist immutable
      */
      loader: { is: 'rw', required: false, isPrivate: true },
      
      /**
       * Map der Objects die sich beim bootstrappen registrieren
       *
       * für z.B. objekte die nicht an ein widget gehängt werden sollen
       *
       * register() getRegistered()
       */
      registered: {is: 'rw', required: false, isPrivate: true, init: Joose.I.Object }
    },
    
    after: {
      initialize: function (props) {
  
        if (!props.spinner) {
          this.$$spinner = new Psc.UI.Spinner();
        }
  
        if (!props.ajaxFormHandler) {
          this.$$ajaxFormHandler = new Psc.AjaxFormHandler({
            spinner: this.$$spinner
          });
        }
        
        if (Psc.Code.isInstanceOf(props.tabs, Psc.UI.Tabs)) {
          this.initTabs();
        } else {
          throw new Psc.InvalidArgumentException('tabs','Objekt: Psc.UI.Tabs');
        }
      }
    },
  
    methods: {
      /**
       * Speichert den aktuellen Tab
       * 
       * wenn tabHook false zurückgibt wird der neue tab nicht geöffnet
       */
      save: function ($form, tabHook, additionalData) {
        var controller = new Psc.UI.FormController({
          form: $form,
          ajaxFormHandler: this.getAjaxFormHandler(),
          eventManager: this.getEventManager(),
          effectsManager: this.getEffectsManager(),
          additionalData: additionalData
        });
        this.getEventManager().triggerEvent('form-controller-create', {creater: this}, [controller, $form]);
        
        try {
          controller.save(tabHook);
        } catch (e) {
          this.processException(e, 'Main.save() ');
        }
      },
      
      /**
       * @return promise|false
       */
      remove: function(item, ajaxHandler) {
        // ducktyping: item.getDeleteRequest()
        
        if (!confirm('Sie sind Dabei den Eintrag '+item.getEntityName()+' unwiderruflich zu löschen! Fortfahren?')) {
          return false; // vll hier ein deferred pipen?, damit immer deferred zurückkomt?
        }
        
        var status = this.handleAjaxRequest(item.getDeleteRequest(), ajaxHandler), evm = this.getEventManager();
  
        if (status !== false) {
          status.done(function () {
            evm.triggerEvent('item-deleted', {source:'main', deleter: this}, [item]);
          });
        }
        
        return status;
      },
      
      /**
       * @return promise
       */
      handleAjaxRequest: function (request, ajaxHandler, defaultFailure) {
        var that = this, d = $.Deferred();
        ajaxHandler = ajaxHandler || new Psc.AjaxHandler();
        
        // start spinner
        that.getSpinner().show(request);
        $.when(
          ajaxHandler.handle(request)
        ).then(function(ajaxResponse) {
          that.setLoader(ajaxResponse.getLoader());
          d.notify(ajaxResponse);
          
          // execute inline js
          ajaxResponse.getLoader().finished().done(function () {
            d.resolve(ajaxResponse);
          
          }).fail(function (exception) {
            d.reject(exception);
          
          }).always(function () {
            that.getSpinner().remove(request);
          });
        },
        // fail
        function (response) {
          that.getSpinner().remove(request); // für success entfernen ist nach dem loader
          d.reject(response);
        });
        
        var promise = d.promise();
        
        if (defaultFailure === true) {
          this.attachDefaultAjaxRequestFailure(promise);
        }
        
        return promise;
      },
  
      attachHandlers: function() {
        var that = this;
        var eventManager = this.getEventManager();
        var tabs = this.getTabs();
        
        eventManager.on('tab-open', function(e, tab, $target) {
          if (e.isDefaultPrevented()) return;
          if (e.source === 'tabOpenable') {
            tabs.open(tab, $target.unwrap());
          } else {
            tabs.open(tab, $target);
          }
        });
        
        eventManager.on('tab-close', function(e, tab, $target) {
          tabs.close(tab);
        });
  
        eventManager.on('tab-reload', function(e, tab, $target) {
          tabs.reload(tab);
        });
  
        eventManager.on('tab-saved', function(e, tab, $target) {
          tabs.saved(tab);
        });
        
        eventManager.on('tab-unsaved', function(e, tab, $target) {
          tabs.unsaved(tab);
        });
        
        eventManager.on('form-save', function(e, $form, $target, additionalData) {
          that.save($form, undefined, additionalData);
        });
        
        eventManager.on('form-save-close', function(e, $form, $target, additionalData) {
          that.save(
            $form,
            function () {
              $target.trigger('close'); // wir können hier nicht $form triggern. ist das so ein rekursiv ding?
              return false; // don't open new
            },
            additionalData
          );
        });
  
        /**
         * Event nach dem gespeichert wurde
         *
         */
        eventManager.on('form-saved', function(e, $form, metaResponse, tabHook) {
          /* blink den button */
          var $saveButton = $form.find('button.psc-cms-ui-button-save');
          if ($saveButton.length) {
            that.getEffectsManager().successBlink($saveButton);
            $saveButton.trigger('saved');
          }
          
          /* bearbeite tabs-meta */
          var open = true;
          var meta;
          
          if (Psc.Code.isInstanceOf(metaResponse, Psc.Response)) {
            meta = new Psc.ResponseMetaReader({response: metaResponse});
          } else if (Psc.Code.isInstanceOf(metaResponse, Psc.ResponseMetaReader)) {
            meta = metaResponse;
          } else {
            throw new Psc.InvalidArgumentException('event:form-saved:metaResponse','Psc.ResponseMetaReader', metaResponse);
          }
          
          if (tabHook) {
            open = tabHook();
          }
          
          if (meta.get(['data','tab','close']) === true) {
            $form.trigger('close'); // this bubbles up and triggers tab-close with the tab correctly
            
          } else if (open !== false && meta.has(['data','tab'])) {
            
            /* neuen Tab öffnen */
            var tab = new Psc.UI.Tab(
              meta.get(['data','tab'])
            );
            
            eventManager.triggerEvent('tab-open', {}, [tab, $form]); // use form as target
          
          } else if (meta.has(['data','item'])) {
            var item = new Psc.CMS.FastItem(
              meta.get(['data','item'])
            );
          
            eventManager.triggerEvent('item-changed', {changer: this, source:'main'}, [item]);
          }
        });
        
        eventManager.on('collapse-right', function (e) {
          var $right = $('#content > div.right');
          var $left = $('#content > div.left');
  
          $right.animate({'width': 0}, 500, function () {
            $(this).css('display', 'none');
            var $container = $('#header div.profile-info');
            if (!$container.find('span.expand-link').length) {
              $container.append($('<span class="expand-link" > | <a href="#">rechte Spalte wiederherstellen</a></span>').click(function (e) {
                $right.stop();
                $left.stop();
                eventManager.triggerEvent('expand-right', {}, []);
                $(this).remove();
              }));
            }
          });
          
          $left.animate({'width': '99%'}, 500);
        });
        
        eventManager.on('expand-right', function (e) {
          var $right = $('#content > div.right');
          var $left = $('#content > div.left');
  
          $right.css('display', 'block');
          $right.animate({'width': '19%'}, 500, function () {
            
          });
          $left.animate({'width': '80%'}, 500);
        });
        
  
        /* von der rechten Seite aus Inhalte öffnen */
        $('#drop-contents').on('click', 'a.psc-cms-ui-drop-content-ajax-call', function(e) {
          var $target = $(e.target);
          var eventManager = that.getEventManager();
    
          e.preventDefault();
          e.stopPropagation();
          
          eventManager.trigger(
            eventManager.createEvent('tab-open', {source: 'dropContents'}), [
              new Psc.UI.Tab({
                id: that.getGUID($target),
                url: $target.attr('href'),
                label: $target.text()
              }),
              $target
            ]
          );
        });
  
        $('#drop-contents').on('click', '.ui-accordion-header span.open-all-list', function (e) {
          /* alle öffnen*/
          e.preventDefault();
          e.stopPropagation(); // nicht akkordion zuklappen: das klappt leider nicht weil es hier zu spät hin bubbled
          var $link = $(this);
          
          var delay = 40;
          $link
            .closest('.ui-accordion-header')
              .next('.ui-accordion-content')
                .find('a.psc-cms-ui-drop-content-ajax-call').each(function (i) {
                  var $target = $(this);
                  
                  setTimeout(function () {
                    eventManager.triggerEvent('tab-open', {source: 'dropContents'},
                      [
                        new Psc.UI.Tab({
                          id: that.getGUID($target),
                          url: $target.attr('href'),
                          label: $target.text()
                        }),
                        $target
                      ]
                    );
                  }, i * delay);
                });
        });
      
        // die rechte seite einklappen
        $('#drop-contents legend:eq(0)').on('click', function (e) {
          e.preventDefault();
          eventManager.triggerEvent('collapse-right');
        });
  
  
        /* Delete Button */
        $('body').on('click', 'button.psc-cms-ui-button-delete', function(e) {
          var $target = $(e.target);
          var eventManager = that.getEventManager();
    
          e.preventDefault();
          e.stopPropagation();
          
          var item = Psc.UI.WidgetWrapper.unwrapWidget($target);
  
          var status = that.remove(item);
          
          if (status !== false) {
            status.done(function () {
              $target.trigger('close');
            });
          }
        });
        
        /* ajax Button */
        $('body').on('click', '.psc-cms-ui-ajax-button', function (e) {
          e.preventDefault();
          e.stopPropagation();
          
          var $button = $(e.target), requestData = $button.data('request'), request = new Psc.Request(requestData);
          $.when(that.handleAjaxRequest(request, undefined, true)).then(function (response) {
            that.getEffectsManager().successBlink($button);
          });
        });
        
        // stop submitting site!
        $('body').on('click', 'button.psc-cms-ui-button', function (e) {
          Psc.Code.info('button stopped from submitting site', $(e.target));
          e.preventDefault();
          e.stopPropagation();
        });
      },
      
      /**
       * Attached alle Handler zu den Tabs, die zum "globalen" Ganzen gehören
       *
       * - elemente in den tabs können "unsaved", "reload", "close" und "saved" triggern
       * - die tabs-nav ist ein droppable in welches content-items hineingezogen werden können
       *
       * Buttons (save, reload, save-close) triggern ein weiteres event, welches dann zur form (bei reload zum panel) hochbubbelt. Erst da delegieren wir an main weiter
       */
      initTabs: function() {
        var that = this;
        var eventManager = this.getEventManager();
        var $tabs = this.$$tabs.unwrap();
        this.$$tabs.setEventManager(eventManager);
        
        /*
          Interaction mit Tabs
        */
        // das kommt aus tabs
        eventManager.on('remote-tab-loaded', function (e, xhr) {
          if (e.status === 'success') { // e hat hier status vom Psc.UI.Tabs
            // started die ausführung der jobs inline und wenn fertig entfernt den spinner
            Psc.Code.info('ending remote tab load (success). Starting Execution');
            $.when( that.getLoader().finished() ).then( function () {
              eventManager.triggerEvent('remote-tab-finished', {main: that}, []);
              Psc.Code.info('[remote-tab] execution finished');
            
            }, function (loader, exceptions) {
              Psc.Code.warning('[remote-tab] execution errored', exceptions);
              
              that.processException(exceptions[0], 'remote-tab-loaded: execution');
            }).always(function () {
              that.getSpinner().remove(xhr);
            });
          
          } else {
            that.getSpinner().remove(xhr);
            
            Psc.Code.error('[remote-tab] ending tab load (error!).');
            Psc.Code.warning('xhr is', xhr);
          }
        });
        
        eventManager.on('remote-tab-load', function (e, xhr) {
          Psc.Code.info('starting remote tab load');
          
          //that.resetLoader(); // erstelle einen neuen loader
          that.getSpinner().show(xhr);
        });
        
        /*
          Tab-Events
         
          Elemente in tab-panels können diese events triggern, diese werden dann an den eventManager weitergeleitet
          es wird der Tab genommen in dem sich das Element welches das Event-triggered genommen
        */
        $tabs.on('unsaved reload close saved', 'div.ui-tabs-panel', function(e) {
          var $tab = $(this), $target = $(e.target);
          e.preventDefault();
          e.stopPropagation();
          
          // transform $tab to tab
          var tab = that.getTabs().tab({ id: $tab.attr('id') });
          
          // sonderfall unsaved nicht dauernd triggern:
          if (e.type === 'unsaved' && tab.isUnsaved()) {
            return;
          }
          
          eventManager.trigger(
            eventManager.createEvent('tab-'+e.type), [tab, $target]
          );
        });
  
        /* Reload-Button (muss nicht zwingend in einer form sein */
        $tabs.on('click','button.psc-cms-ui-button-reload', function(e) {
          e.preventDefault();
          e.stopPropagation();
          $(this).trigger('reload'); // bubble up to tabs on event
        });
        
        /* Form-Events */
        /* EntityForm + Normale Form Event-Binds (an Buttons und Elemente)
           form.psc-cms-ui-form-panel (div.psc-cms-ui-entity-form)
        */
        
        /**
         * Allgemeines Save
         *
         */
        $tabs.on('save save-close','form.psc-cms-ui-form', function(e, postData) {
          var $form = $(this), $target = $(e.target);
          e.preventDefault();
          e.stopPropagation();
        
          eventManager.trigger(
            eventManager.createEvent('form-'+e.type), [$form, $target, postData]
          );
        });
  
        /* Speichern + Schliessen - Button */
        $tabs.on('click','form.psc-cms-ui-form button.psc-cms-ui-button-save-close', function(e) {
          e.preventDefault();
          e.stopPropagation();
          $(this).trigger('save-close'); // bubble up to form
        });
        
        /* Speichern - Button */
        $tabs.on('click','form.psc-cms-ui-form button.psc-cms-ui-button-save', function(e) {
          e.preventDefault();
          e.stopPropagation();
          $(this).trigger('save');
        });
      
        /*
          Formular Komponenten die verändert werden, markieren das Formular als "unsaved"
          dies ist im moment eine sehr naive Variante (lots of false-positive)
        */
        $tabs.on('change','form.psc-cms-ui-form:not(.unbind-unsaved) (input, textarea, select):not([readonly="readonly"])', function(e) {
          // nicht prevent default denn das ist ganz schön doof
          $(this).trigger('unsaved'); // hochbubblen bis zur form
        });
  
        /* Button auf die Navi Leiste ziehen */
        $tabs.find('ul.ui-tabs-nav').droppable({
          hoverClass: 'hover',
          drop: function (event, ui) {
            var item = Psc.UI.WidgetWrapper.unwrapWidget(ui.draggable);
            
            if (item.getTab) { // nur ducktypen
              eventManager.triggerEvent('tab-open', {source: 'tabOpenable' }, [item.getTab(), item]);
            }
          }
        });
  
        /* siehe auch Buttonable.js - weil wir von dort nicht an einen evm kommen */
        $tabs.on('click', '.psc-cms-ui-tab-button-openable', function (e) {
          e.preventDefault();
          var $tabOpenable = $(e.target),
              item = Psc.UI.WidgetWrapper.unwrapWidget($tabOpenable);
          
          if (item) {
            eventManager.triggerEvent('tab-open', {source: 'tabOpenable' }, [item.getTab(), item]);
            
          }
        });
        
        /* Formular Gruppen klappbar machen */
        $tabs.on('click', 'legend.collapsible', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var $target = $(e.target), $fieldset = $target.parent('fieldset');
        
          if ($fieldset.length && $fieldset.is('.psc-cms-ui-group')) {
            $fieldset.find('div.content:first').toggle();
          }
        });
  
        // links als psc-cms-ui-tabs-item
        // siehe Psc\CMS\CMS in createTemplateTabLink() wenn das hier geändert wird
        $tabs.on('click', 'a.psc-cms-ui-tabs-item, button.psc-cms-ui-tabs-item', function (e) {
          e.preventDefault();
          e.stopPropagation();
        
          var $target = $(e.target), id = that.getGUID($target);
          
          if (id !== null) {
            var tab = new Psc.UI.Tab({
              id: id,
              label: $target.text(),
              url: $target.attr('href')
            });
            
            eventManager.trigger(
              eventManager.createEvent('tab-open', { source: 'anchor' }),
              [tab, $target]
            );
          } else {
            throw new Psc.Exception('guid ist nicht gesetzt von '+$target.html());
          }
        });
        
       /*
        * close all contextMenus when clicked somewhere on body and still open
        *
        * das wäre schöner durch den context-manager binden zu lassen, und dann mit once() immer wenn eins offen ist
        * sonst triggern wir diesen handler hier wirklich jedes mal (bei jedem click)
        */
        $('body').on('click', function (e) {
          that.getTabs().getContextMenuManager().closeAll();
        });
      },
      
      /**
       * Der allgemeinste Error-Handler für AjaxRequests und unerwartetes, anstatt überall an jeder Stelle sein eigenens Süppchen zu kochen
       *
       */
      processException: function (exception, context) {
        var text = "Leider ist ein Fehler aufgetreten, der nicht erwartet war.\n";
        
        if (exception instanceof Error) {
          text += exception.name+": "+exception.message+" ("+exception.description+")";
        } else if (exception.toString) {
          text += "Fehlermeldung: "+exception.toString();
        } else if ("string" === typeof(exception)) {
          text += "Fehlermeldung: "+exception;
        }
        
        if (context) {
          text += "\nFehler Kontext: ".context;
        }
        
        text += "\n\n";
        text += JSON.stringify(exception).replace(/\\n/g, "\n");
        
        Psc.Code.error(exception);
        alert(text);
      },
      
      attachDefaultAjaxRequestFailure: function (promise) {
        promise.fail(function (response) {
          alert('Beim Ausführen des Requests ist ein Fehler aufgetreten: '+response.getCode()+' '+response.getBody());
        });
      },
      
      /**
       * Registriert ein Objekt in Main
       *
       * es kann eine category angegeben werden z. B. "GridPanel" damit getRegistered() nicht alles zurückgeben muss
       */
      register: function (object, category) {
        if (!category) category = "none";
        
        if (!this.$$registered[category]) {
          this.$$registered[category] = [];
        }
          
        this.$$registered[category].push(object);
      },
      
      /**
       * Gibt alle vorher mit register() registrierten Objekte (einer Kategory) zurück
       *
       * 
       * @return array|object  object wenn ohne Parameter aufgerufen. Properties sind die Kategorien, values die listen
       */
      getRegistered: function (category) {
        var list;
        if (!category) {
          list = this.$$registered;
        } else if (this.$$registered[category]) {
          list = this.$$registered[category];
        } else {
          list = [];
        }
        
        return list;
      },
      
      getOneRegistered: function (category) {
        var list = this.getRegistered(category);
        
        if (list.length === 1)
          return list[0];
          
        return undefined;
      },
      
      /**
       * Gibt einen Loader für die Remote Tabs zurück
       *
       * ist gerade keiner vorhanden, wird ein neuer erstellt
       * alle weiteren Calls für getLoader() geben dann den aktuellen zurück
       * bis dieser mit resetLoader() zurückgesetzt wird
       */
      getLoader: function() {
        if (!this.$$loader) {
          this.$$loader = new Psc.Loader();
        }
        
        return this.$$loader;
      },
      resetLoader: function () {
        this.$$loader = undefined;
        return this;
      },
      
      toString: function() {
        return "[Psc.UI.Main]";
      },
      
      qmatch: function (value, pattern, index) {
        index = index || 1;
        try {
          var m = value.match(pattern);
          if (m && m[index]) {
            return m[index];
          }
        } catch (e) {}
        
        return null;
      },
    
      getGUID: function ($element) {
        return this.qmatch($element.attr('class'), /psc\-guid\-(.*?)(\s+|$)/,1);
      }
    }
  });
});  