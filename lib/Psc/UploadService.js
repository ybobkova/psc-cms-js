define(['joose', 'Psc/Request', 'jquery-fileupload', 'jquery-iframe-transport', 'Psc/UI/FormFields', 'Psc/Code', 'Psc/UI/Dialog', 'Psc/UI/Spinner'], function(Joose) {
  // unbedingt jquery-iframe-transport als requirement, sonst gehts im IE nicht
  Joose.Class('Psc.UploadService', {
    
    has: {
      apiUrl: { is : 'rw', required: true, isPrivate: true },
      uiUrl: { is : 'rw', required: true, isPrivate: true },
      
      // .handleAjaxRequest(request, ajaxHandler, bool handleDefaultFailure)
      ajaxService: { is : 'rw', required: true, isPrivate: true },
      
      // .processException(e)
      exceptionProcessor: { is : 'rw', required: false, isPrivate: true },
      
      dialog: { is : 'rw', required: false, isPrivate: true }, // der dialog mit dem upload-manager drin
      singleDialog: { is : 'rw', required: false, isPrivate: true } // der dialog mit dem einzelnen upload (single)
    },
    
    after: {
      initialize: function (props) {
        var that = this;
        
        if (!props.exceptionProcessor) {
          require(['app/main'], function (main) {
            that.setExceptionProcessor(main);    
          });
        }
      }
    },
    
    methods: {
      // requester ist das objekt, welches die files will
      pullUploadFiles: function (requester) {
        var d = $.Deferred();
        
        var status = this.$$ajaxService.handleAjaxRequest(
          this.createRequest('GET', {'orderby': {'name': 'ASC'}}),
          undefined,
          true // handleDefaultFailure
        );
        
        status.done(function (response) {
          /* response ist dann sowas 
          [{"name":"emptyColumn.xlsx",
            "size":9126,
            "type":"application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "url":"/files/uploads/game/3emptyColumn.xlsx",
            "delete_url":"/upload-manager/api/game/3/?file=emptyColumn.xlsx&_method=DELETE",
            "delete_type":"POST"}
          ]
         */
          d.resolve(response.getBody());
        }, function (response) {
          d.reject();  // status fail macht der service, da müssen wir uns nicht mehr drum kümmern
        });
        
        return d.promise();
      },
      
      /**
       * Öffnet einen Single-File-Upload
       *
       * der body wird mit dem POST "bodyAsJSON" json encodiert verschickt
       * der upload ist multipart/form-data
       *
       * options.title die BEschriftung des Dialogs
       * options.form.hint der Hint der unter der Upload Box angezeigt wird
       * options.form.filename der Dateiname des Formular Inputs im Formular
       * options.form.fields = Psc.UI.FormFields Felder die zusätzlich gerendert werden un mit dem body gemerged werden
       * alle optionen in options.form werden an _createSingleForm als options übergeben
       *
       * options.closeButton die Beschriftung des Buttons zum abbrechen
       * options.dataCallback function(result) das ergebnis des uploads im success-fall - result ist hier die response von data.result von jquery fileupload
       *
       * exceptions bei der übertragung werden an den $$exceptionProcessor weitergeleitet
       * nur im success-fall wird dataCallback aufgerufen
       *
        var dialog = this.$$uploadService.openSingleDialog(
          new Psc.Request({
            url: '/cms/images/',
            method: 'POST',
            body: {
              types: ['jpg', 'png', 'gif']
              // usw
            },
            format: 'json'
          }),
          {
            form: {
              hint: 'Es können nur Bilder hochgeladen werden.'
            },
            title: this.$$url ? 'Bild ersetzen' : 'neues Bild hochladen',
            dataCallback: function (result) {
              var image = result;
              that.refreshImage(image);
            }
          }
        );
      },

       * @return dialog
       */
      openSingleDialog: function (request, options) {
        options = $.extend({}, {
            title: 'Datei hochladen',
            closeButton: 'abbrechen'
          },
          options || {}
        );
        
        var dialog = this.$$singleDialog = new Psc.UI.Dialog(options);
        
        // formular im dialog
        dialog.setContent(this._createSingleForm(
                            request,
                            $.extend({}, {
                              filename: 'uploadFile',
                              hint: '',
                              method: 'post',
                              dataCallback: options.dataCallback
                            },
                            options.form || {}
                          )
                         ));
        // open
        dialog.open();
        return dialog;
      },
      
      _createSingleForm: function (request, options) {
        var dialog = this.$$singleDialog, that = this, exceptionProcessor = that.getExceptionProcessor();
        
        var formFields = options.fields || new Psc.UI.FormFields();
        var $form = formFields.createForm();
        
        $form.attr('action', request.getUrl());
        $form.attr('enctype', 'multipart/form-data');
        $form.attr('method', options.method);
        
        // schöner wäre vorher formfields dafür zu benutzen, aber das haben wir noch nicht gebaut
        $form.append('<input type="file" name="'+options.filename+'" /><br />');
          
        if (options.hint) {
          $form.append('<small class="hint">'+options.hint+'<br /></small>');
        }
        
        var spinner = new Psc.UI.Spinner({
          container: $form
        });
        
        var $file = $form.find('input[type="file"]').fileupload({
          dataType: request.getFormat(),
          form: $form,
          type: request.getMethod(),
          formData: function () {
            var body = $.extend( {},
                                formFields.readFrom($form), // möglich gesetzte felder über optionen aus dem formular serialisieren
                                request.getBody()
                              );
            
            return [{name: 'bodyAsJSON', value: JSON.stringify(body)}];
          },
          done: function (e, data) {
            try {
              dialog.close();
              
              if (options.dataCallback) {
                options.dataCallback(data.result);
              }
            } catch (err) {
              dialog.close();
              
              if (exceptionProcessor) {
                exceptionProcessor.processException(err);
              } else {
                throw err;
              }
            }
          },
          fail: function (e, fileupload) {
            var err = {
              msg: fileupload.errorThrown,
              description: "ResponseCode: "+fileupload.jqXHR.status+" ResponseText: "+(fileupload.jqXHR.responseText || fileupload.jqXHR.responseXML)+" "
            };
            
            Psc.Code.warning(err);
            
            dialog.close();
  
            if (exceptionProcessor) {
              exceptionProcessor.processException(err);
            } else {
              throw err;
            }
          },
          
          send: function (e, data) {
            spinner.show(data);
          },
          always: function (e, data) {
            spinner.remove(data);
          }
        });
        
        return $form;
      },
      
  
      openFilesDialog: function (options) {
        var that = this;
        
        var args = $.extend({}, {
            title: 'Datei Manager',
            width: 650,
            height: 550,
            onCreate: function (e, eventDialog) {
              var iframeHTML = $('<iframe/>', {
                src: that.getUiUrl(),
                width: '100%',
                height: '100%',
                border: 0,
                'class': 'upload-manager-iframe'
              });
            
              eventDialog.setContent(iframeHTML);
            },
            closeButton: "schließen"
          },
          options
        );
  
        this.$$dialog = new Psc.UI.Dialog(args);
        this.$$dialog.open();
      },
      
      createRequest: function (method, body) {
        return new Psc.Request({
            url: this.$$apiUrl,
            method: method,
            body: body,
            format: 'json'
        });
      },
      
      toString: function() {
        return "[Psc.UploadService]";
      }
    }
  });
});