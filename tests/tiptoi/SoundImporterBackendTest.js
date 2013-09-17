define(['psc-tests-assert', 'tiptoi/SoundImporterBackend', 'Psc/Test/DoublesManager','tiptoi/Main'], function(t) {
  
  module("tiptoi.SoundImporterBackend");

  var setup = function (test) {
    var dm = new Psc.Test.DoublesManager();
    var soundImporterBackend = new tiptoi.SoundImporterBackend({
      uploadService: dm.getUploadService(),
      tiptoiMain: {}
    });
    
    return t.setup(test, {soundImporterBackend: soundImporterBackend});
  };
  
  test("upload and flush API", function() {
    var that = setup(this);

    this.assertNotUndefined(that.soundImporterBackend.flush);
    this.assertNotUndefined(that.soundImporterBackend.upload);
  });
});