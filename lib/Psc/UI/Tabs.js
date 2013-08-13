/*globals confirm:true*/
define(
  [
   'joose', 'jquery', 'lodash', 'JSON', 'jquery-ui',
   'Psc/UI/Tab', 'Psc/UI/WidgetWrapper', 'Psc/EventDispatching', 'Psc/Code', 'Psc/InvalidArgumentException', 'Psc/UI/TabNotFoundException', 'Psc/Exception', 
   'Psc/UI/ContextMenuManager', 'Psc/UI/ErrorPane', 'Psc/ContainerDepending'
  ], function(Joose, $, _) {

  /**
   * Events:
   *   - remote-tab-load kurz vor 
   *   - remote-tab-loaded  wenn der ajax request fertig ist (egal ob error oder success)
   */
  Joose.Class('Psc.UI.Tabs', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.EventDispatching, Psc.ContainerDepending], // der EVM wird von main bei initTabs überschrieben

    has: {
      list: { is: 'r', required: false},
      ul: { is: 'r', required: false},
      tabs: { is: 'r', required: false, isPrivate: true, init: Joose.I.Array }, // das nicht übergeben sondern "widget"
      selectedTab: { is: 'r', required: false, isPrivate: true},
      contextMenuManager: { is: 'rw', required: false, isPrivate: true},
      container: { is: 'rw', required: false, isPrivate: true},

      sessionStorageAvaible: { is: 'r', required: false, isPrivate: false}
    },
    
    after: {
      initialize: function (props) {
        if (!props.contextMenuManager) {
          this.$$contextMenuManager = new Psc.UI.ContextMenuManager({id: 'madeintabs'});
        }
        
        this.sessionStorageAvaible = Psc.Code.hasSessionStorage();
        
        this.checkWidget();
        this.initWidget(this.widget);
      }
    },
    
    methods: {
      /**
       * Fügt einen Tab hinzu
       *
       * Es kann alles angegebenwerden (Low-Level)
       */
      add: function(tab) {
        if (!Psc.Code.isInstanceOf(tab, Psc.UI.Tab)) {
          throw new Psc.InvalidArgumentException('tab', 'Psc.UI.Tab Instanz', tab);
        }
        var anchor = this.list.find('a[href="#'+tab.getId()+'"]');
  
        if (anchor.length === 1) {
          /* schon vorhanden */
          return this;
        } else {
          // @todo wenn closable: false ist, sollte auch kein span.close hinzugefügt werden (immer tab template vorher setzen / zurücksetzen?)
          // oder danach nochmal das html ändern?
          // blöd auch, dass jquery da nicht einfach eine funktion annimmt ..........
          
          var label = tab.getLabel();
          // jquery ui macht dies nicht für uns :( sad :(
          label = label.replace(/&/g, '&amp;');
          label = label.replace(/</g, '&lt;');
          label = label.replace(/>/g, '&gt;');
          
          /* tab hinzufügen (als inpage tab) */
          this.widget.tabs('add', tab.getId(), label);
          // in unseren tabs-index aufnehmen
          // vll checken ob index+1 === this.list.length is?, was wenn nicht?
          this.$$tabs.push(tab);
          // refresh / reset (internal state)
          this.list = this.ul.find('li'); // das brauchen wir
          // this.ul braucht kein update
          // remote tab aus unserem tab machen
          this.widget.tabs('url', this.getIndex(), tab.getUrl());
          // context-menu des tabs hinzufügen
          this._attachContextMenu(tab);
          
          // content?
          if (tab.getContent() !== null) {
            throw new Psc.Exception('content nicht leer ist noch nicht implementiert');
          }
        }
        
        return this;
      },
      open: function(tab, $target) {
        if (!Psc.Code.isInstanceOf(tab, Psc.UI.Tab)) {
          throw new Psc.InvalidArgumentException('tab', 'Psc.UI.Tab Instanz', tab, 'tabs.open()');
        }
        
        var that = this;
        var openCB = function() {
          if (that.has(tab)) {
            that.select(tab);
          } else {
            that.add(tab);
          }
        };
        
        if ($target) {
          $target.effect('transfer', { to: this.ul }, 500, openCB);
        } else {
          openCB();
        }
        
        return this;
      },
      
      close: function(tab) {
        if (!Psc.Code.isInstanceOf(tab, Psc.UI.Tab)) {
          throw new Psc.InvalidArgumentException('tab', 'Psc.UI.Tab Instanz', tab);
        }
        
        if (!tab.isClosable()) {
          return this;
        }
        
        // @TODO decouple: InteractionManager?
        if (!tab.isUnsaved() || confirm('Der Tab hat noch nicht gespeicherte Änderungen, Wenn der Tab geschlossen wird, ohne ihn zu Speichern, gehen die Änderungen verloren.') === true) {
          
          this._detachContextMenu(tab);
        
          var index = this.getIndex(tab);
          this.widget.tabs("remove", index);
          this.$$tabs.splice(index,1); // entferne an index
        
          // this.ul braucht kein update
          // aber this.list hat ein removed element nun, welches wir entfernen
          this.list.splice(index,1);
        }
        
        return this;
      },
      
      closeAll: function() {
        var that = this;
        var tabsCopy = this.$$tabs.slice();
        // weil wir während des durchslaufens splice() auf den array machen (in close) müssen wir hier zuerst kopieren
        
        var lastTab = tabsCopy.pop();
        
        // damit tabs (grmpf) nicht immer den selected tab aktualisieren muss, selecten wir zuerst den letzten tab und entfernen dann von vorn
        this.select(lastTab);
        
        $.each(tabsCopy, function (i, tab) {
          that.close(tab);
        });
        
        this.close(lastTab);
      },
      reload: function(tab) {
        if (!Psc.Code.isInstanceOf(tab, Psc.UI.Tab)) {
          throw new Psc.InvalidArgumentException('tab', 'Psc.UI.Tab Instanz', tab);
        }
        
        // @TODO decouple: InteractionManager?
        if (!tab.isUnsaved() || confirm("Der Tab hat noch nicht gespeicherte Änderungen, Wenn der Tab neugeladen wird gehen die Änderungen verloren.") === true) {
          var index = this.getIndex(tab);
          this.widget.tabs('load',index);
          
          // mark as saved
          this.saved(tab);
        }
      },
      
      /**
       *
       * 0 Parameter: gibt den letzten eingefügten Index zurück. Sind die Tabs leer wird -1 zurückgegeben
       * 1 Parameter (tab)
       */
      getIndex: function(tab) {
        if (tab) {
          var index = $.inArray(tab, this.$$tabs);
          if (index >= 0) {
            return index;
          } else {
            throw new Psc.UI.TabNotFoundException({id: tab.getId()});
          }
        } else {      
          return this.$$tabs.length-1;
        }
      },
      
      getAnchor: function(tab) {
        var index = this.getIndex(tab);
        return $(this.list[index]).find('a');
      },
      
      select: function(tab) {
        this.$$selectedTab = tab;
        this.getContainer().getErrors().context('tab', tab.getLabel()+' '+tab.getUrl());
        this.widget.tabs('select', tab.getId());
      },
      
      /**
       * Gibt einen Tab aus den Tabs zurück
       *
       * search kann ein objekt sein mit einem der properties:
       *   - id sucht nach der id des tabs (angegeben bei add)
       *   - url sucht nach der URL des tabs (TODO)
       *   - index ist der 0 basierende index wie der von getIndex zurückgegeben wird
       */
      tab: function(search) {
        search = search || {};
        if (search.id) {
          // the jquery way (nicht ganz weil a => li muss)
          //var $tab = this.list.find('a[href="#'+search.id+'"]');
          //if ($tab.length) {
          //  return this.$$tabs[ this.ul.index($tab) ];
          //}
          
          // wir nehmen nicht dom, sondern iterieren: @todo was ist schneller?
          var l = this.$$tabs.length, i;
          for (i = 0; i<l; i++) {
            var tab = this.$$tabs[i];
            if (tab.getId() === search.id) {
              return tab;
            }
          }
        } else if ($.isNumeric(search.index) && search.index >= 0 && search.index < this.$$tabs.length) {
          return this.$$tabs[ search.index ];
        } else if (search.url) {
          throw new Psc.Exception('Searching by url is not implemented');
        }
        
        throw new Psc.UI.TabNotFoundException(search);
      },
      has: function(search) {
        if (Psc.Code.isInstanceOf(search, Psc.UI.Tab)) {
          // search by id, not reference
          search = {id: search.getId()};
        } 
        
        try {
          this.tab(search);
          return true;
        
        } catch (e) {
          if (Psc.Code.isInstanceOf(e, Psc.UI.TabNotFoundException)) {
            return false;
          } else {
            throw e;
          }
        }
      },
      
      /**
       * Markiert einen Tab als Unsaved
       *
       * nur tab.setUnsaved(true|false) hat nicht den gewünschten effekt,
       * immer diese Funktion benutzen
       */
      unsaved: function(tab) {
        if (!Psc.Code.isInstanceOf(tab, Psc.UI.Tab)) {
          throw new Psc.InvalidArgumentException('tab', 'Psc.UI.Tab Instanz', tab);
        }
  
        if (!tab.isUnsaved()) {
          var $a = this.getAnchor(tab);
        
          if (!$a.find('span.unsaved').length) {
            $a.append('<span class="unsaved">&nbsp;*</span>');
          }
          
          // es wäre vll schöner ein event zu triggern und das den formpanel machen zu lassen?  
          this.widget.find($a.attr('href')).find('button.psc-cms-ui-button-save').css('font-weight','bold');
          
          tab.setUnsaved(true);
        }
        return this;
      },
      
      pinn: function(tab) {
        if (!Psc.Code.isInstanceOf(tab, Psc.UI.Tab)) {
          throw new Psc.InvalidArgumentException('tab', 'Psc.UI.Tab Instanz', tab);
        }
        
        if (this.sessionStorageAvaible) {
          var key = 'psc-cms-ui-pinned-tabs';
          var storedTabsJSON = sessionStorage.getItem(key);
          var storedTabs = JSON.parse(storedTabsJSON) || [];
          var exportedTab = tab.getExport();
          
          for (var i = 0; i<storedTabs.length; i++) {
            if (storedTabs[i].id === exportedTab.id) {
              return;
            }
          }
        
          storedTabs.push(exportedTab);
          sessionStorage.setItem(key, JSON.stringify(storedTabs));
        }
      },

      unpinn: function(tab) {
        if (!Psc.Code.isInstanceOf(tab, Psc.UI.Tab)) {
          throw new Psc.InvalidArgumentException('tab', 'Psc.UI.Tab Instanz', tab);
        }
        
        if (this.sessionStorageAvaible) {
          var key = 'psc-cms-ui-pinned-tabs';
          var storedTabsJSON = sessionStorage.getItem(key);
          var storedTabs = JSON.parse(storedTabsJSON) || [];
          var exportedTab = tab.getExport();
          
          for (var i = 0; i<storedTabs.length; i++) {
            if (storedTabs[i].id === exportedTab.id) {
              break;
            }
          }
          
          storedTabs.splice(i, 1);
        
          sessionStorage.setItem(key, JSON.stringify(storedTabs));
        }
      },
      
      getPinnedTabs: function () {
        if (!this.sessionStorageAvaible) {
          return [];
        }
        
        var key = 'psc-cms-ui-pinned-tabs';
        
        var storedTabsJSON = sessionStorage.getItem(key);
        var storedTabs = JSON.parse(storedTabsJSON) || [];
        
        return storedTabs;
      },
      
      saved: function(tab) {
        if (!Psc.Code.isInstanceOf(tab, Psc.UI.Tab)) {
          throw new Psc.InvalidArgumentException('tab', 'Psc.UI.Tab Instanz', tab);
        }
        
        if (tab.isUnsaved()) {
          var $a = this.getAnchor(tab);
          var $span = $a.find('span.unsaved');
            
          if ($span.length >= 1) {
            $span.remove();
          }
        
          // event wäre schöner
          this.widget.find($a.attr('href')).find('button.psc-cms-ui-button-save').css('font-weight','normal');
          
          tab.setUnsaved(false);
        }
      },
      initWidget: function($tabs) {
        var that = this;
        
        this.widget = $tabs.tabs({
          // das tabTemplate muss in sync mit in Psc\UI\tabs2.php sein
          tabTemplate: '<li><a href="#{href}" title="#{href}">#{label}<span class="load"></span></a><span class="ui-icon ui-icon-gear options">popup options</span><span class="ui-icon ui-icon-close">Remove Tab</span></li>',
          select: function (e, ui) {
            that.$$selectedTab = that.tab({ index: ui.index});
          },
          spinner: false,
          cache: true, // nicht jedes mal remote tabs neu laden, das wollen wir nicht wegen save!
          ajaxOptions: {
            dataType: 'html',
            error: function(xhr, status, index, anchor) {
              that.handleAjaxError(xhr, status, that.getTabWidget(that.getSelectedTab()), index, anchor);
            },
            success: function(response, status) {
              that.handleAjaxSuccess(response, status, that.getTabWidget(that.getSelectedTab()));
            },
            beforeSend: function(jqXHR, settings) {
              that.getEventManager().triggerEvent(
                'remote-tab-load', {source: 'tabs', tabs: that}, [jqXHR, settings]
              );
            }
          }
        });
        
  
        // set vars
        this.ul = $tabs.find('ul:eq(0)');
        this.list = this.ul.find('li');
        
        // attach handlers
  
        // close handler
        this.ul.on('click', 'li span.ui-icon-close', function() {
          var $li = $(this).parent('li');
          var index = that.list.index($li);
          
          that.close( that.tab({index: index}) );
        });
  
        // open menu handler
        this.ul.on('click', 'li span.options', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          var $span = $(e.target);
          that.getContextMenuManager().toggle($span);
        });
        
        // parse existing tabs (from php)
        _.forEach(this.list, function (li) {
          var $li = $(li);
          var anchor = $li.find('a:eq(0)');
          var tab = new Psc.UI.Tab({
            id: anchor.attr('href').substr(1),
            label: anchor.text(),
            url: anchor.data("load.tabs"), // siehe jquery-ui-tabs weil die keinen getter haben!
            //content: null // sollen wir den hier setzen?
            closable: !!$li.find('span.ui-icon-close').length
          });
          that.$$tabs.push(tab);
          that._attachContextMenu(tab);
        });

        // self test
        if (this.count() !== this.widget.tabs('length')) {
          throw new Psc.Exception('Interner Fehler: die Tabs im Widget sind asynchron zu den geparsten ('+this.count()+' !== '+this.widget.tabs('length')+')');
        }
        
        // open pinned tabs (from sessionStorage)
        var pinnedTabs = this.getPinnedTabs(), pinnedTab, lastTab, i;
        for (i = 0; i<pinnedTabs.length; i++) {
          pinnedTab = new Psc.UI.Tab(pinnedTabs[i]);
          
          pinnedTab.setPinned(true);
          
          if (!that.has(pinnedTab)) {
            that.add(pinnedTab);
            lastTab = pinnedTab;
          }
        }
      },
      _attachContextMenu: function (tab) {
        var that = this;
        var $anchor = that.getAnchor(tab);
        var $gear = $anchor.parent().find('span.options');
        
        var items = {
            'close': {
              label: 'Schließen',
              select: function (e, id) {
                that.close(tab); 
              }
            },
            'close-all': {
              label: 'Alle Tabs Schließen',
              select: function (e, id) {
                that.closeAll(); 
              }
            },
            'reload': {
              label: 'erneut Laden',
              select: function (e, id) {
                that.reload(tab);
              }
            }
            //'save': {
            //  label: 'Speichern',
            //  select: function(e, id) {
            //    $(menu.getItem({id: id})).trigger('save');
            //  }
            //},
        };
        
        if (that.sessionStorageAvaible)  {
          if (tab.getPinned()) {
            items.unpinn = {
              label: 'lösen',
              select: function() {
                that.unpinn(tab);
              }
            };
          } else {
            items.pinn = {
              label: 'anheften',
              select: function() {
                that.pinn(tab);
              }
            };
          }
        }
        
        var menu = new Psc.UI.Menu({ items: items});
        
        // append ui (passiert schon in tabTemplate
  
        // register
        if ($gear.length) {
          that.getContextMenuManager().register($gear, menu);
        }
      },
      _detachContextMenu: function (tab) {
        var $anchor = this.getAnchor(tab);
        var $gear = $anchor.parent().find('span.options');
        
        if ($gear.length) {
          this.getContextMenuManager().unregister($gear);
        }
        
      },
      count: function() {
        return this.$$tabs.length;
      },
      handleAjaxSuccess: function (xhr, status, $tab) {
        this.getEventManager().triggerEvent('remote-tab-loaded', {source: 'tabs', status:'success'}, [xhr, status, $tab]);
      },
      handleAjaxError: function (xhr, status, $tab) {
        this.getEventManager().triggerEvent('remote-tab-loaded', {source: 'tabs', status:'error'}, [xhr, $tab]);
        
        if (xhr.getResponseHeader('X-Psc-CMS-Error') === 'true') {
          //that.getEffectsManager().errorBlink($form);
          
          var pane = new Psc.UI.ErrorPane({
            container: $tab,
            label: 'Es ist ein Fehler beim Laden des Tabs aufgetreten',
            errorMessage: xhr.responseText
          });
          
          pane.display();
        } else {
          $tab.html(xhr.responseText);
        }
        
      },
      getTabWidget: function (tab) {
        if (tab) {
          return $('#'+tab.getId());
        }
      },
      toString: function() {
        return "[Psc.UI.Tabs]";
      }
    }
  });
});