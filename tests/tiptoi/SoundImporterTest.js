define(['psc-tests-assert', 'jquery', 'tiptoi/SoundImporter', 'tiptoi/Sound','Psc/Test/DoublesManager'], function(t, $) {
  
  module("tiptoi.SoundImporter");
  
  var setup = function (test) {
    var dm = new Psc.Test.DoublesManager();

    var hs = "Pascal Breuer";

    var $widget = $('#visible-fixture').empty();

    var Backend = function () {
      var that = this;

      $.extend(this, {

        createSound: function (content, number, speakers, status, details) {
          return {
            status: status,
            details: details || [],
            sound: new tiptoi.Sound({
              content: content,
              number: number,
              speakers: speakers
            })
          };
        },

        fakeGetParsedSounds: function () {
          return [
            that.createSound("Dieser Sound ist neu ohne Soundnummer", null, [hs], "new"),
            that.createSound("Dieser Sound ist neu mit Soundnummer", "2-HRF-002", [hs], "new"),

            that.createSound("Dieser Sound ist vorhanden mit Soundnummer", "2-TEST-201", ["Paul"], "existing"),
            that.createSound("Dieser Sound ist vorhanden mit falscher Soundnummer", "2-TEST-2001", ["Paul"], ["wrong_number"], ["Der Inhalt wurde in der Datenbank unter einer anderen Nummer gefunden. Gefundene Nummer: 2-TEST-201]"]),

            that.createSound("Dieser Sound ist vorhanden mit falschen Sprechern", "2-TEST-201", [hs], ["wrong_speakers"], ["Der Sound mit der Nummer 2-TEST-201 hat als Sprecher 'Pascal Breuer' eingetragen, der Sprecher in der Datenbank ist jedoch 'Paul'"])
          ];
        }
      });
    };

    var backend = new Backend();

    var soundImporter = new tiptoi.SoundImporter({ 
      backend: backend,
      widget: $widget,
      container: dm.getContainer(),
      inputSounds: backend.fakeGetParsedSounds()
    });
    
    return t.setup(test, {importer: soundImporter, $table: $widget.find('> .psc-cms-ui-group > div.content > table:first')});
  };

  test("widget is rendered", function() {
    var that = setup(this);
    var $widget = this.importer.unwrap();

    var $group = this.assertjQueryLength(1, $widget.find('> .psc-cms-ui-group'));
    var $table = this.assertjQueryLength(1, $group.find('> div.content > table:first'));

    this.assertSame(that.$table.get(0), $table.get(0));
  });

  test("table contains all rows from inputSounds", function () {
    var that = setup(this);

    this.assertjQueryLength(5, that.$table.find('> tbody > tr'));
  });
});