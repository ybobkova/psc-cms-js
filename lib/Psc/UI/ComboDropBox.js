Joose.Class('Psc.UI.ComboDropBox', {
  
  define(['Psc.CMS.FastItem','Psc.CMS.ComboDropBoxable','Psc.UI.DropBoxButton'], function() {
  
  has: {
    /**
     * Die Widgets (html elemente) der Elemente an die mit data() die beiden Joose elemente angefügt wurden
     */
    dropBoxWidget: { is : 'rw', required: true, isPrivate: true },
    dropBox: { is : 'rw', required: false, isPrivate: true },

    /**
     * Die Widgets (html elemente) der Elemente an die mit data() die beiden Joose elemente angefügt wurden
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
        var boxable = new Psc.CMS.FastItem(
          $.extend({
              widget: $('<button></button>') // das ist nur um cms item glücklich zu machen
            },
            item
          )
        );
        
        dropBox.addButton(boxable);
      });
    },
    initDependencies: function () {
      this.$$comboBox = this.$$comboBoxWidget.data('joose');
      this.$$dropBox = this.$$dropBoxWidget.data('joose');
    },
    toString: function() {
      return "[Psc.UI.ComboDropBox]";
    }
  }
});