define(['joose', 'knockout', 'tiptoi/Sound', 'Psc/Code', 'Psc/Request', 'Psc/UI/WidgetInitializer', 'Psc/UI/TemplateWidgetWrapper', 'Psc/ContainerDepending'], function(Joose, ko) {
  Joose.Class('tiptoi.SoundImporter', {
    isa: Psc.UI.TemplateWidgetWrapper,

    has: {
      viewModel: { is : 'rw', required: false, isPrivate: true },
      templateName: { is: 'rw', required: false, isPrivate: true, init: 'tiptoi.SoundImporter'},

      backend: { is: 'rw', required: true, isPrivate: true},

      msgs: {is: 'r', required: false, isPrivate: true}
    },
    
    after: {
      initialize: function () {
        this.$$msgs = {
          noStatus: "noch nicht bearbeitet"
        };

        var initializer = new Psc.UI.WidgetInitializer();
        ko.bindingHandlers.jQueryUIWidget = {
          init: function(element) {
            initializer.init($(element));
          }
        };

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
        var joose = this, backend = this.$$backend;

        return function () {
          var that = this;

          this.label = "Sounds importieren";
          this.importInfos = ko.observableArray();

          this.openUpload = function () {
            backend.upload(function (importInfos) {
              that.importInfos.removeAll();
              joose.convertImports(importInfos, that.importInfos);
            });
          };

          this.flush = function () {
            var js = ko.toJS(that);

            backend.flush(
              js.importInfos,
              function (importInfos) {
                that.importInfos.removeAll();
                joose.convertImports(importInfos, that.importInfos);
              }
            );
          };
        };
      },

      convertImports: function (importInfos, observableArray) {
        var msgs = this.$$msgs;


        var SoundModel = function (sound) {
          var that = this;

          /*
          if (!Psc.Code.isInstanceOf(input.sound, tiptoi.Sound)) {
            input.sound = new tiptoi.Sound(input.sound);
          }
          */

          this.number = ko.observable(sound.number);
          this.content = ko.observable(sound.content);
          this.speakers = ko.observableArray(sound.speakers || []);

          this.formatSpeakers = ko.computed(function () {
            return ko.utils.unwrapObservable(that.speakers).join(", ");
          });

          this.formatContent = ko.computed(function () {
            var content = that.content(), cut = 72;

            if (content.length > 72) {
              return content.substr(0,72)+'[...]';
            } else {
              return content;
            }
          });

        };

        var ImportInfoModel = function (input) {
          var that = this;

          this.status = ko.observable(input.status);
          this['do'] = ko.observable(input['do']);
          this.details = ko.observableArray(input.details || []);

          this.sound = new SoundModel(input.sound);

          this.formatDetails = ko.computed(function () {
            return ko.utils.unwrapObservable(that.details).join("\n");
          });

          this.formatStatus = ko.computed(function () {
            var status = that.status();

            if (!status) {
              return msgs.noStatus;
            }

            return status;
          });
        };


        for (var i = 0; i < importInfos.length; i++) {
          observableArray.push(new ImportInfoModel(importInfos[i]));
        }
      },

      getViewModel: function () {
        if (!this.$$viewModel) {
          var Model = this.compileViewModel();

          this.$$viewModel = new Model();
        }

        return this.$$viewModel;
      },
      toString: function() {
        return "[tiptoi.SoundImporter]";
      }
    }
  });
});