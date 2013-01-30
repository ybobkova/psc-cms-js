define(['jquery', 'joose', 'Psc/UI/InteractionProvider', 'Psc/Exception'], function ($) {
  Joose.Class('Psc.UI.TestInteractionProvider', {
    isa: Psc.UI.InteractionProvider,

    has: {
      matchers: { is: 'rw', required: true, isPrivate: true, init: Joose.I.Array},
      matcherId: { is: '', required: false, isPrivate: true, init: 0}
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    override: {
      confirm: function (message) {
        return this.matchingAnswerFor(
          message,
          new Psc.Exception("confirm() is called but no matcher is matching the message: "+message)
        );
      },
      prompt: function (message, defaultValue) {
        return this.matchingAnswerFor(
          message,
          new Psc.Exception("prompt() is called but no matcher is matching the message: "+message)
        );
      }
    },
    
    methods: {
      /**
       * adds an answer for the next confirm, no matter what the confirm is
       *
       * @api
       */
      answerToConfirm: function (answer) {
        answer = !!answer;
        
        this.$$matchers.push({
          answer: answer,
          matched: 0,
          times: 1,
          matches: /./
          //id: this.newMatcherId()
        });
        
        return this;
      },
      /**
       * adds an answer for the next prompt, no matter what the prompt is
       *
       * @api
       */
      answerToPrompt: function(answer) {
        this.$$matchers.push({
          answer: answer,
          matched: 0,
          times: 1,
          matches: /./
          //id: this.newMatcherId()
        });
      },
      matchingAnswerFor: function (message, exception) {
        var matcher = this.findMatcher(message);
        
        if (matcher) {
          this.housekeep(matcher);
          return matcher.answer;
        }
        
        throw exception;
      },
      findMatcher: function (message) {
        for(var i = 0, matcher; i<this.$$matchers.length; i++) {
          matcher = this.$$matchers[i];
          if (matcher.matched < matcher.times && this.matcherMatches(matcher, message)) {
            return matcher;
          }
        }
        
        return undefined;
      },
      matcherMatches: function(matcher, message) {
        return !!message.match(matcher.matches);
      },
      housekeep: function(matcher) {
        matcher.matched++;
      },
      //removeMatcher: function(matcher) {
      //  for (var i; i<this.$$matchers.length; i++) {
      //    if (matcher.id === this.$$matchers[i].id) {
      //      this.$$matchers.splice(i, 1);
      //      break;
      //    }
      //  }
      //},
      //newMatcherId: function () {
      //  this.$$matcherId++;
      //  return this.$$matcherId;
      //},
      toString: function () {
        return '[Psc.UI.TestInteractionProvider]';
      }
    }
  });
});