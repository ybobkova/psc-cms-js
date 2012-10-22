define(['Psc/UI/WidgetWrapper'], function() {
  Joose.Class('Psc.UI.Menu', {
    isa: Psc.UI.WidgetWrapper,
  
    has: {
      widget: { is : 'rw', required: false, isPrivate: false },
      open: { is: '', required: false, isPrivate: true, init: false },
      owner: { is: 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function(props) {
        if (props.items) {
          this.createWidget(props.items);
        }
        this.checkWidget();
        this.initWidget();
      }
    },
  
    methods: {
      open: function () {
        this.$$open = true;
        this.updatePos();
        this.widget.slideDown(100);
      },
      updatePos: function() {
        this.widget.css({'top':0,'left':0});
        this.widget.position({
          of: this.$$owner,
          my: 'left top',
          at: 'left bottom',
          offset: '10 0',
          collision: 'flip none'
        });
      },
      close: function() {
        this.$$open = false;
        this.widget.slideUp(100);
      },
      isOpen: function () {
        return this.$$open;
      },
      setOwner: function ($owner) {
        this.$$owner = $owner;
        var $menu = this.widget;
        $menu.css('position','absolute');
        this.updatePos();
      },
      removeOwner: function () {
        delete this.$$owner;
      },
      getItem: function (search) {
        var item;
        if (search.id) {
          item = this.widget.find('li a[href="#'+search.id+'"]');
        }
        
        return item;
      },
      createWidget: function (items) {
        var html = '', that = this;
        
        this.widget = $('<ul></ul>');
        $.each(items, function(id, item) {
          if (typeof(item) === 'string') {
            item = { label: item };
          }
          
          if ($.isFunction(item.select)) { // das kann dann sogar eine eventsmap sein
            that.unwrap().on('click', 'li a[class*="menu-'+id+'"]', [id,that], item.select); // das geht dann nur für maus, nicht tastatur!
          }
          
          // der IE die hole hupe expanded den # hier mit einer URL davor
          // deshalb klappt hier unser event (von oben) handler nicht
          html += '<li><a class="menu-'+id+'" href="#'+id+'">'+item.label+'</a></li>';
        });
        this.widget.append(html);
      },
      initWidget: function() {
        this.widget.menu({
        });
      },
      toString: function() {
        return "[Psc.UI.Menu]";
      }
    }
  });
});