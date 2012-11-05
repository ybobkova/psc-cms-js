define(['Psc/UI/GridTable', 'Psc/Table', 'Psc/Numbers', 'Psc/UI/Dialog', 'Psc/UI/WidgetWrapper'], function() {
  Joose.Class('tiptoi.GameEditor', {
    isa: Psc.UI.WidgetWrapper,
  
    has: {
      files: { is : 'rw', required: false, isPrivate: true },
      service: { is : 'rw', required: true, isPrivate: true }, // ein UploadService
      codeEditordialog: { is : 'rw', required: false, isPrivate: true }, // der dialog mit dem upload-manager drin
      // CodeEditor Url
      codeEditorUrl: { is : 'rw', required: false, isPrivate: true },
      hasFiles: { is : 'rw', required: false, isPrivate: true, init: false }
    },
    
    after: {
      initialize: function (props) {
        this.checkWidget();
        this.linkWidget();
        
        this.initUI();
      }
    },
    
    methods: {
      initUI: function () {
        var that = this, $panel = this.unwrap(), $filesContainer = $panel.find('fieldset div.content.game-files').first();
        //
        //$panel.find('.open-code-editor').on('click', function () {
        //  that.openCodeEditor();
        //});
        
        if (this.$$hasFiles) {
          this.$$files = new Psc.UI.GridTable({
            serialize: false,
            table: new Psc.Table({
              columns: [
                        {name:'name', label: 'Dateiname', type: 'String'},
                        {name:'name', label: 'Größe', type: 'Integer'}
                       ],
              data: []
            }),
            name: 'gameFiles'
          });
          
          var $set = $('<div class="psc-cms-ui-buttonset"></div>');
          $('<button>Dateien bearbeiten</button>')
            .addClass('psc-cms-ui-button')
            .button({
              icons: {primary: 'ui-icon-wrench'}
            })
            .click(function (e) {
              e.preventDefault();
              
              that.openFilesDialog();
            })
            .appendTo($set);
          
          var $grid = this.$$files.attach(this.$$files.html());
          
          $filesContainer.append($grid);
          $set.insertAfter($grid);
          
          this.pullFiles();
        }
      },
      
      pullFiles: function () {
        var that = this;
        
        $.when(this.$$service.pullUploadFiles(this)).then(function (files) {
          that.getFiles().empty();
          $.each(files, function (i, file) {
            that.addFile(file);
          });
        });
      },
  
      openFilesDialog: function () {
        var that = this;
  
        return this.$$service.openFilesDialog({
          onClose: function (e, eventDialog, $eventDialog) {
            that.pullFiles();
          }
        });
      },
      
      openCodeEditor: function () {
        var that = this;
        
        //this.$$codeEditorDialog = new Psc.UI.Dialog({
        //  title: 'Spiel-Logik bearbeiten',
        //  width: 1280,
        //  height: 1024,
        //  //guid: 'file-manager-game-editor-',
        //  onCreate: function (e, eventDialog) {
        //    var iframeHTML = $('<iframe/>', {
        //      src: that.getCodeEditorUrl(),
        //      width: '100%',
        //      height: '100%',
        //      border: 0,
        //      'class': 'code-editor-iframe'
        //    });
        //    
        //    eventDialog.setContent(iframeHTML);
        //  },
        //  onClose: function (e, eventDialog, $eventDialog) {
        //    //that.unwrap()
        //  }
        //});
        //
        //this.$$codeEditorDialog.addCloseButton('schließen');
        //
        //this.$$codeEditorDialog.open();
        
        //this.$$codeEditorDialog = window.open(this.getCodeEditorUrl(), "code-editor");
      },
      
      //file muss mindestens string .name , string .url, string .type (mime), string .size in bytes haben
      addFile: function(file) {
        this.$$files.appendRow([
          $('<a/>', {
            html: file.name,
            href: file.url,
            target: '_blank',
            'class': 'game-file-link'
          }),
          Psc.Numbers.formatBytes(file.size)
        ]);
      },
      
      toString: function() {
        return "[tiptoi.GameEditor]";
      }
    }
  });
});