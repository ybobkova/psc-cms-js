/** 
 * Dieser InputProvider lauscht in container auf das "tiptoi-tip" event
 * mit erstem parameter oid (required: oid.oid als int)
 *
 * Events:
 *  input-provider-listening  {provider: this} [$container]  kurz nachdem der EventHandler attached wird und getippt werden kann
 *  input-provider-got-input {provider: this} [input, $container] auch im Fehlerfall
 * diese beiden Events können für den GUI benutzt werden um zu zeigen, dass der User was machen muss
 * got-input wird auch getriggered wenn ein unerwarteter Fehler auftritt
 */
Joose.Class('tiptoi.InteractiveInputProvider', {
  isa: Psc.UI.WidgetWrapper,
  
  does: 'Psc.EventDispatching',
  
  define(['Psc.Code'], function() {

  has: {
    handlers: { is : 'rw', required: false, isPrivate: true, init:1 },
    deferred: { is : 'rw', required: false, isPrivate: true }
  },
  
  after: {
    initialize: function () {
      var that = this, container = this.unwrap(), evm = this.getEventManager();
      
      // wir attachen einen wegwerf event handler mit genau diesem passenden deferred
      container.on('tiptoi-tip', function (e, oid) {
        var deferred = that.getDeferred(); // hier geht nicht nicht direkt deferred zu referenzieren
        if (deferred !== undefined) { 
          e.preventDefault();
          e.stopPropagation();
          
          evm.triggerEvent('input-provider-got-input', {provider: this}, [oid, container]);
  
          if (oid && oid.oid) {
            deferred.resolve(oid.oid);
          } else {
            deferred.reject('unbekanntes tiptoi-tip event');
          }
        } else {
          Psc.Code.warning('Deferred ist nicht gesetzt gewesen, dropping event');
        }
      });
    }
  },
  
  methods: {
    
    /**
     *
     * Mein erster Ansatz war:
     *  einen wegwerf-handler (mit one) an den container zu hängen
     *  und dann jeweils das deferred in den eventhandler zu closuren
     *
     *  das Problem dabei ist, wenn das Spiel neugestartet wird, wird ein weitere one-Handler attached
     *  deshalb werden dann 2 deferreds resolved mit dem selben input
     *
     *
     * deshalb speicher ich jetzt ein deferred im object, sodass es immer nur ein listening und ein deferred gibt
     */
    getInput: function () {
      var that = this, container = this.unwrap(), evm = this.getEventManager();
      var handler = this.$$handlers++;
      
      this.$$deferred = $.Deferred();

      setTimeout(function () {
        evm.triggerEvent('input-provider-listening', {provider: that, handler: handler}, [container]);
      },1);
      
      return this.$$deferred.promise();
    },
    
    toString: function() {
      return "[tiptoi.InteractiveInputProvider]";
    }
  }
});