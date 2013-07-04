define(['jquery', 'joose'], function ($, Joose) {
  Joose.Class('tiptoi.SoundImporterBackend', {

    
    has: {
      uploadService: { is: 'rw', required: true, isPrivate: true},
      tiptoiMain: { is: 'rw', required: true, isPrivate: true}
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      flush: function (soundImports, callback) {
        var status = this.$$tiptoiMain.dispatch(
          this.$$tiptoiMain.createRequest(
            ['import', 'sounds'],
            'PUT',
            soundImports,
            'json',
            'json'
          )
        );

        status.done(function (response) {
          callback(response.getBody());
        });
      },

      upload: function (callback) {
        this.$$uploadService.openSingleDialog(
          this.$$tiptoiMain.createRequest(
            ['import', 'sounds'],
            'POST'
          ),
          {
            form: {
              hint: 'Spalten Namen der Tabelle lauten: Nummer, Inhalt, Sprecher, Wenn, Dann',
              filename: 'excelFile'
            },
            title: 'Sound Import Datei hochladen',
            dataCallback: callback
          }
        );
      },

      toString: function () {
        return '[tiptoi.SoundImporterBackend]';
      }
    }
  });
});