define(['joose', 'Psc/CMS/FastItem','Psc/CMS/ComboDropBoxable','Psc/UI/WidgetWrapper','Psc/UI/DropBoxButton'], function(Joose) {
  Joose.Class('Psc.UI.ComboDropBox', {
    
    has: {
      /**
       * Die Widgets (html elemente) der Elemente an die mit data() die beiden Joose elemente angefügt wurden
       */
      dropBoxWidget: { is : 'rw', required: true, isPrivate: true },
      dropBox: { is : 'rw', required: false, isPrivate: true },
  
      /**
       * Die Joose-Widgets der (html-)Elemente an die mit data() die beiden Joose elemente angefügt wurden
       */
      comboBoxWidget: { is : 'rw', required: true, isPrivate: true },
      comboBox: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function () {
        this.initDependencies();
        
        this.initHandlers();
      }
    },
  
    methods: {
      initHandlers: function () {
        var that = this, dropBox = this.$$dropBox, comboBox = this.$$comboBox;
        
        // combobox fügt der dropbox ein item hinzu, wenn das item ausgewählt wird
        comboBox.getEventManager().on('combo-box-selected', function(e, item) { // selected oder select?
          var fastItem = new Psc.CMS.FastItem(item);
          var $button = fastItem.createButton();
          fastItem.init($button);
        
          // in $button lebt unter data.joose unser item weiter, und hat damit dann die eigenschaften, wie in der comboBox
          dropBox.addButton(fastItem.getDropBoxButton(), $button);
        });
      },
      initDependencies: function () {
        if (!this.$$comboBox) {
          this.$$comboBox = Psc.UI.WidgetWrapper.unwrapWidget(this.$$comboBoxWidget);
        }
        
        if (!this.$$dropBox) {
          this.$$dropBox = Psc.UI.WidgetWrapper.unwrapWidget(this.$$dropBoxWidget);
        }
      },
      toString: function() {
        return "[Psc.UI.ComboDropBox]";
      }
    }
  });
});