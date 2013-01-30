define(['joose', 'Psc/UI/Dialog', 'Psc/CalendarEvent'], function(Joose) {
  Joose.Class('CoMun.CalendarEvent', {
    isa: Psc.CalendarEvent,
    
    has: {
      region: { is : 'rw', required: true, isPrivate: true },
      i18nDescription: { is : 'rw', required: false, isPrivate: true },
      i18nLocation: { is : 'rw', required: false, isPrivate: true },
      dialog: { is : 'rw', required: false, isPrivate: true },
      labels: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function () {
        this.$$labels = {
          de: {
            'location': 'Ort',
            'time': 'Zeit'
          },
          fr: {
            'location': 'lieu',
            'time': 'heure'
          }
        };
      }
    },
    
    methods: {
      on: function (type, e) {
        if (type === 'click') {
          this.openPopup();
        }
      },
      openPopup: function () {
        var that = this;
        this.$$dialog = new Psc.UI.Dialog({
          title: this.getTitle(),
          //guid: 'my-test-dialog',
          onCreate: function (e, eventDialog) {
            eventDialog.setContent(
              that.createPopupHTML()
            );
          },
          buttons: []
        });
        
        this.$$dialog.open();
      },
      createPopupHTML: function () {
        var html = '';
        
        //html += '<h2>'+this.getTitle()+'</h2>';
        html += '<p><strong>'+this.$$labels[this.$$region].time+':</strong>&nbsp;'+this.formatRange()+'<br />';
        if (this.$$location) {
          html += '<strong>'+this.$$labels[this.$$region].location+':</strong>&nbsp;'+this.getLocation()+'';
        }
        html += '</p>';
        html += '<div class="event-description"><p>'+this.getDescription().replace(/\n/g, '<br />')+'</p></div>';
        
        return html;
      },
      
      getDescription: function () {
        return this.$$i18nDescription[this.$$region];
      },
      getLocation: function () {
        return this.$$i18nLocation[this.$$region];
      },
      
      toString: function() {
        return "[CoMun.CalendarEvent]";
      }
    }
  });
});