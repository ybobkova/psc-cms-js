define(['psc-tests-assert', 'jquery', 'tiptoi/Main', 'tiptoi/SoundImporter', 'tiptoi/Sound','Psc/Test/DoublesManager'], function(t, $) {
  
  module("tiptoi.SoundImporter");
  
  var setup = function (test) {
    var dm = new Psc.Test.DoublesManager();

    var hs = "Pascal Breuer";

    var $fixture = $('#visible-fixture').empty();
    var $widget = $('<div class="sound-importer-widget"></div>').appendTo($fixture);

    var createSound =  function (content, number, speakers, status, done, details) {
      return {
            status: status,
            'do': done,
            details: details || [],
            sound: {
              content: content,
              number: number,
              speakers: speakers
            }
          };
    };

     var fakeSounds = [
       createSound("Dieser Sound ist neu ohne Soundnummer", null, [hs], "new", undefined),
       createSound("Dieser Sound ist neu mit Soundnummer", "2-HRF-002", [hs], "new", undefined),
       createSound("Dieser Sound ist vorhanden mit Soundnummer", "2-TEST-201", ["Paul"], "existing", undefined),
       createSound("Dieser Sound ist vorhanden mit falscher Soundnummer", "2-TEST-2001", ["Paul"], "wrong_number", ["Der Inhalt wurde in der Datenbank unter einer anderen Nummer gefunden. Gefundene Nummer: 2-TEST-201]"], undefined),
       createSound("Dieser Sound ist vorhanden mit falschen Sprechern", "2-TEST-201", [hs], "wrong_speakers", ["Der Sound mit der Nummer 2-TEST-201 hat als Sprecher 'Pascal Breuer' eingetragen, der Sprecher in der Datenbank ist jedoch 'Paul'"], undefined)
    ];

    /*
    var backed = new tiptoi.SoundImporterBackend({
      uploadService: dm.getUploadService(),
      tiptoiMain: new tiptoi.Main({main: { register: function () {}}, productName: 'TEST', widget: $('<div />')})
    */

    var backend = {
      imports: null,

      upload: function (callback) {
        window.setTimeout(function () {
          callback(fakeSounds);
        }, 20);
      },

      flush: function (soundImports) {
        this.imports = soundImports;
      }
    };

    var soundImporter = new tiptoi.SoundImporter({ 
      backend: backend,
      widget: $widget,
      container: dm.getContainer()
    });
    
    return t.setup(test, {importer: soundImporter, backend: backend, $table: $widget.find('> .psc-cms-ui-group > div.content > table:first')});
  };

  test("widget is rendered", function() {
    var that = setup(this);
    var $widget = this.importer.unwrap();

    var $group = this.assertjQueryLength(1, $widget.find('> .psc-cms-ui-group'));
    var $table = this.assertjQueryLength(1, $group.find('> div.content > table:first'));

    this.assertSame(that.$table.get(0), $table.get(0));
  });

  asyncTest("table contains all rows from backend rows when button is clicked for upload", function () {
    var that = setup(this);

    that.importer.getViewModel().openUpload();

    window.setTimeout(function () {
      start();

      that.assertjQueryLength(5, that.$table.find('> tbody > tr'));
  
    }, 60);
  });

  asyncTest("sounds are exported the way they are imported", function () {
    var that = setup(this);

    that.importer.getViewModel().openUpload();

    window.setTimeout(function () {
      start();

      that.assertjQueryLength(5, that.$table.find('> tbody > tr'));

      that.importer.getViewModel().flush();

      that.assertLength(5, that.backend.imports);

      for (var i = 0, jsonImport; i < that.backend.imports.length; i++) {
        jsonImport = that.backend.imports[i];

        that.assertNotUndefined(jsonImport.status, 'status is defined');
        that.assertTrue(jsonImport.hasOwnProperty('do'), 'do is an attribute');
        that.assertNotUndefined(jsonImport.sound, 'sound is defined');
        that.assertNotUndefined(jsonImport.sound.content, 'sound.content is defined');
        that.assertNotUndefined(jsonImport.sound.speakers, 'sound.speakers is defined');
        that.assertNotUndefined(jsonImport.sound.number, 'sound.number is defined');
      }

    }, 60);
    

  });
});