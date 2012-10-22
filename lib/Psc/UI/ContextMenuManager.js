define(['Psc/UI/Menu','Psc/InvalidArgumentException', 'Psc/Exception', 'Psc/Code'], function() {
  Joose.Class('Psc.UI.ContextMenuManager', {
    
    has: {
      idStorageKey: { required: false, isPrivate: true, init: 'context-menu-manager-id' },
      menus: { required: false, isPrivate: true, init: Joose.I.Array },
      id: { required: false, isPrivate: true }
    },
  
    methods: {
      register: function ($owner, menu) {
        if (!Psc.Code.isInstanceOf(menu, Psc.UI.Menu)) {
          throw new Psc.InvalidArgumentException('menu', 'Psc.UI.Menu', menu);
        }
        var $menu = menu.unwrap();
        var owner = $owner;
        if ($owner.jquery) {
          owner = $owner.get(0);
        }
        
        // lets store the index for the menu inside the owner
        var index = this.index(owner);
        if (!$.isNumeric(index)) {
          $.data(owner, this.$$idStorageKey, index = this.$$menus.length); // store a new index
          menu.setOwner($owner);
        }
        
        this.$$menus[ index ] = menu; // overwrite / store new
        if (!$menu.parents('body').length) {
          $menu.hide();
          $menu.appendTo($('body'));
        }
        
        return this;
      },
      
      unregister: function ($owner) {
        var index = this.index($owner);
        var menu = this.$$menus[index];
        
        Psc.Code.info('[ContextMenumanager] versuche das menu zu unregistern', $owner, index, this.$$menus);
        
        if (menu) {
          menu.removeOwner();
          menu.unwrap().remove();
          delete this.$$menus[index];
        }
      },
      
      closeAll: function() {
        $.each(this.$$menus, function(i, menu) {
          if (menu && menu.isOpen()) { // menu kann mittlerweile gelöscht sein
            menu.close();
          }
        });
        return this;
      },
      toggle: function($owner) {
        var menu = this.get($owner);
        
        if (menu.isOpen()) {
          menu.close();
        } else {
          menu.open();
        }
        
        return menu;
      },
      get: function($owner) {
        var index = this.index($owner);
        
        var menu;
        if (!$.isNumeric(index) || !(menu = this.$$menus[index]) ) {
          throw new Psc.Exception('Für das Element $owner kann kein Menu gefunden werden. Dieses muss vorher mit register() hinzugefügt werden.');
        }
        
        return menu;
      },
      index: function($owner) {
        if ($owner.jquery) {
          $owner = $owner.get(0);
        }
        return $.data($owner, this.$$idStorageKey); // siehe auch register
      },
      toString: function() {
        return "[Psc.UI.ContextMenuManager]";
      }
    }
  });
});