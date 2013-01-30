define(['joose', 'jquery-fileupload','Psc/UI/GridTable', 'Psc/Code', 'Psc/Request', 'Psc/UI/Dialog','Psc/FormRequest'], function(Joose) {
  Joose.Class('Psc.UI.GridTableEditor', {
  
    has: {
      grid: { is : 'rw', required: true, isPrivate: true },
      service: { is : 'rw', required: true, isPrivate: true },
      exportFilename: { is : 'rw', required: false, isPrivate: true, init: 'export' },
      dialog: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function () {
        //Psc.Code.debug(this);
      }
    },
    
    methods: {
      attach: function ($grid) {
        var that = this;
        var $set = $('<div class="psc-cms-ui-buttonset"></div>');
        this.$$grid.attach($grid);
        
        $('<button>Daten herunterladen</button>')
          .addClass('psc-cms-ui-button').addClass('grid-download-data')
          .button({
            icons: {primary: 'ui-icon-arrowthickstop-1-s'}
          })
          .click(function (e) {
            e.preventDefault();
            
            Psc.Code.info('trigger download');
            that.downloadData();
          })
          .appendTo($set);
  
        $('<button>Daten hochladen</button>')
          .addClass('psc-cms-ui-button').addClass('grid-upload-data')
          .button({
            icons: {primary: 'ui-icon-arrowthickstop-1-n'}
          })
          .click(function (e) {
            e.preventDefault();
            
            Psc.Code.info('trigger upload');
            that.openUploadDialog();
          })
          .appendTo($set);
  
        //$set.buttonset({});
        $set.insertAfter($grid);
        //$('<small class="hint">daten:</small>').css('display','inline-block').css('margin-right', '12px').insertAfter($grid);a
      },
      downloadData: function () {
        var request = new Psc.Request({
          url: '/cms/excel/'+this.$$exportFilename,
          method: 'POST',
          format: 'xlsx',
          body: this.$$grid.getExport()
        });
        
        Psc.Code.info('downloading: ', request);
        this.$$service.download(request);
      },
      
      openUploadDialog: function () {
        var that = this;
        var dialog = this.$$dialog = new Psc.UI.Dialog({
          title: 'Daten der Tabelle bearbeiten'
        });
        
        dialog.addCloseButton();
        
        // content
        dialog.setContent(this._createForm());
        
        // open
        dialog.open();
      },
      
      /**
       * Bekommt einen Array mit Zeilen:
       *  Spalten als GroßBuchstaben => werte
       */
      processUploadResult: function(excelData) {
        var grid = this.$$grid;
        var cols = grid.getColumns().length;
        
        Psc.Code.group('GridTableEditor: upload', true);
        grid.empty();
        
        Psc.Code.info((excelData.length-1)+' Zeilen gefunden');
        Psc.Code.debug(excelData);
        $.each(excelData.slice(1), function (i, row) { // header abschneiden, sollen wir das checken?
          // columns slicen, alles was übersteht kommt weg
          var sliceRow = row.slice(0, cols);
          grid.appendRow(sliceRow);
        });
        Psc.Code.endGroup();
        
        return this;
      },
      
      _createForm: function () {
        var $form =
          $('<form action="/cms/excel/convert" />', {'enctype':'multipart/form-data', 'method':'post'}) // weitere attribute brauchen wir nicht, das wird per ajax überschrieben
            .append('<input type="file" name="excelFile" /><br />')
            .append('<small class="hint">Hier die modifizierte Excel Datei auswählen, die man unter "Daten herunterladen" erhält.<br /></small>');
            
        var dialog = this.$$dialog, that = this;
        
        var formRequest = new Psc.FormRequest({
            form: $form,
            url: '/cms/excel/convert', // siehe form[action] das hier hat keine bewandnis
            method: 'POST',
            format: 'json',
            body: this.$$grid.getExport() // das liefert zwar die daten mit, macht aber nix
          });
        
        var $file = $form.find('input[type="file"]').fileupload({
          dataType: formRequest.getFormat(),
          form: $form,
          type: formRequest.getMethod(),
          formData: function () {
            return [{name: 'bodyAsJSON', value: JSON.stringify(formRequest.getBody())}];
          },
          done: function (e, data) {
            try {
              that.processUploadResult(data.result);
            } catch (err) {
              require(['app/main'], function (main) {
                main.processException(err);
              });
            }
            
            dialog.close();
          },
          fail: function (e, fileupload) {
            var err = fileupload.errorThrown;
            Psc.Code.warning(err);
            
            require(['app/main'], function (main) {
              err.description = "ResponseCode: "+fileupload.jqXHR.status+" ResponseText: "+(fileupload.jqXHR.responseText || fileupload.jqXHR.responseXML)+" ";
              main.processException(err);
            });
          }
        });
        
        return $form;
      },
      
      toString: function() {
        return "[Psc.UI.GridTableEditor]";
      }
    }
  });
});