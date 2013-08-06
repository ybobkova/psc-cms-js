define(['joose', 'jquery', 'Psc/InvalidArgumentException','Psc/Code'], function(Joose, $) {
  Joose.Class('Psc.EventManager', {
    
    has: {
      logging: { is : 'rw', required: false, isPrivate: true, init: false },
      jq: { is: 'r', required: false, handles: [ 'bind', 'on', 'one', 'off' ] } // one wird in matrix-manager von tiptoi benutzt
    },
    
    after: {
      initialize: function () {
        // nicht init: für attribute jq benutzen, denn das geht nicht richtig - bindet dann an window oder so
        this.jq = $(this);
      }
    },
    
    methods: {
      trigger: function (event, handlerData) {
        if (this.$$logging) {
          Psc.Code.info('[evm] triggerEvent: '+event.type+(event.namespace ? '.'+event.namespace : ''), event, handlerData);
        }
        return this.jq.trigger(event, handlerData);
      },
      /*
        bevor ich hier mit den komischen event namespaces von jQuery hier rum mache, gebe ich die API einfach weiter (first make it work ....)
        man kann überprüfen mit hasEvent ob das event zum EventManager gehört(e)
        
        die einträge von data werden in das event objekt kopiert (dies ist kein eintrag von data)
      */
      createEvent: function (name, data) {
        data = data || {};
        data.isPscEvent = true;
        return jQuery.Event(name, data);
      },
      
      hasEvent: function (event) {
        return event.isPscEvent;
      },
  
      /**
       * @param object eventData
       * @param array handlerData
       * @return event
       */
      triggerEvent: function(name, eventData, handlerData) {
        if (typeof(name) !== 'string') {
          throw new Psc.InvalidArgumentException('name','string', name, 'EventManager::triggerEvent()');
        }
        
        var event;
        this.trigger(
          event = this.createEvent(name, eventData),
          handlerData
        );
        
        return event;
      },
      toString: function() {
        return "[Psc.EventManager]";
      }
    }
  });
});