Joose.Class('Psc.UI.FilesTable', {
  isa: 'Psc.UI.WidgetWrapper',
  
  use: ['Psc.UI.GridTable', 'Psc.Table', 'Psc.Numbers', 'Psc.UI.Dialog'],

  has: {
    files: { is : 'rw', required: false, isPrivate: true },
    uploadService: { is : 'rw', required: true, isPrivate: true } // ein UploadService
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
      var that = this, $filesContainer = this.unwrap();

      this.$$files = new Psc.UI.GridTable({
        serialize: false,
        table: new Psc.Table({
          columns: [
                      {name:'name', label: 'Dateiname', type: 'String'},
                      {name:'name', label: 'Größe', type: 'Integer'}
                     ],
            data: []
        }),
        name: 'files'
      });
        
      var $set = $('<div class="psc-cms-ui-buttonset"></div>');
      
      $('<button>Dateien bearbeiten</button>')
          .addJoose.Class('psc-cms-ui-button')
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
    },
    
    pullFiles: function () {
      var that = this;
      
      $.when(this.$$uploadService.pullUploadFiles(this)).then(function (files) {
        that.getFiles().empty();
        $.each(files, function (i, file) {
          that.addFile(file);
        });
      });
    },

    //file muss mindestens string .name , string .url, string .type (mime), string .size in bytes haben
    addFile: function(file) {
      this.$$files.appendRow([
        $('<a/>', {
          html: file.name,
          href: file.url,
          target: '_blank',
          'class': 'file-link'
        }),
        Psc.Numbers.formatBytes(file.size)
      ]);
    },
    
    openFilesDialog: function () {
      var that = this;

      return this.$$uploadService.openFilesDialog({
        onClose: function (e, eventDialog, $eventDialog) {
          that.pullFiles();
        }
      });
    },
    
    toString: function() {
      return "[Psc.UI.FilesTable]";
    }
  }
});