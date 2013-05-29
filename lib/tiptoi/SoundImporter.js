define(['joose', 'knockout', 'Psc/UI/TemplateWidgetWrapper', 'Psc/ContainerDepending'], function(Joose, ko) {
  Joose.Class('tiptoi.SoundImporter', {
    isa: Psc.UI.TemplateWidgetWrapper,

    has: {
      inputSounds: { is : 'rw', required: true, isPrivate: true },

      viewModel: { is : 'rw', required: false, isPrivate: true },
      templateName: { is: 'rw', required: false, isPrivate: true, init: 'tiptoi.SoundImporter'}
    },
    
    after: {
      initialize: function () {
        this.initUI();        
      }
    },
    
    methods: {
      initUI: function () {
        this.checkWidget();

        var $widget = this.unwrap();

        $widget.append(
          this.render({})
        );

        ko.applyBindings(this.getViewModel(), $widget.get(0));
      },

      compileViewModel: function () {
        var model = this;

        return function (inputSounds) {
          var that = this;

          this.label = "Sounds importieren";
          this.sounds = model.convertSounds(inputSounds);
        };
      },

      convertSounds: function (inputSounds) {
        var modelSounds = ko.observableArray();

        var SoundModel = function (input) {
          var that = this;

          this.number = ko.observable(input.sound.getNumber());
          this.content = ko.observable(input.sound.getContent());
          this.speakers = ko.observableArray(input.sound.getSpeakers() || []);
          this.status = ko.observable(input.status);

          this.formatSpeakers = ko.computed(function () {
            return ko.utils.unwrapObservable(that.speakers).join(", ");
          });

          this.formatErrors = ko.computed(function () {
            return that.status();
          });
        };

        for (var i = 0; i < inputSounds.length; i++) {
          modelSounds.push(new SoundModel(inputSounds[i]));
        }

        return modelSounds;
      },

      getViewModel: function () {
        if (!this.$$viewModel) {
          var Model = this.compileViewModel();

          this.$$viewModel = new Model(this.$$inputSounds);
        }

        return this.$$viewModel;
      },
      toString: function() {
        return "[tiptoi.SoundImporter]";
      }
    }
  });
});