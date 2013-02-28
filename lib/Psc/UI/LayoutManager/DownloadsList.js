define(['joose', 'lodash', 'Psc/UI/SplitPane', 'Psc/UI/Button', 'Psc/UI/UploadableFile', 'Psc/Numbers', 'Psc/UI/Group', 'Psc/UI/GridTable', 'Psc/UI/Table', 'Psc/UI/LayoutManagerComponent'], function(Joose, _) {
  /**
   * Events:
   *   select-files-loaded([dialog, grid])  when select dialog is opened and uploaded files were pulled
   *   select-file([file]) when a specific file is selected in the openend select dialog from the pulled, uploaded files
   */
  Joose.Class('Psc.UI.LayoutManager.DownloadsList', {
    isa: Psc.UI.LayoutManagerComponent,
  
    has: {
      uploadService: { is : 'rw', required: true, isPrivate: true },
      
      // die downloads der liste
      downloads: { is : 'rw', required: true, isPrivate: true },
      headline: { is : 'rw', required: true, isPrivate: true },
      
      // eine liste von FileUploadables
      files: { is : 'rw', required: false, isPrivate: true },
      upls: { is : 'rw', required: false, isPrivate: true },
      
      // der upload für das auswählen von downloads
      selectDialog: { is : 'rw', required: false, isPrivate: true }
    },
    
    before: {
      initialize: function () {
        this.$$type = 'DownloadsList';
      }
    },
    
    methods: {
      createContent: function () {
        var that = this;
        
        // this.$$content ist eigentlich leer
        var pane = new Psc.UI.SplitPane({
          width: 40
        });
        this.$$content = pane.html();
  

        var files = this.$$files = $('<ul class="lm-downloadslist" />');
        var upls = this.$$upls = [];
        $.each(this.$$downloads, function (i, sdownload) {
          var $li = $('<li/>');
          var upl = new Psc.UI.UploadableFile({
            uploadService: that.getUploadService(),
            widget: $li,
            url: sdownload.url,
            id: sdownload.file,
            description: sdownload.description
          });
          
          files.append($li);
          upls.push(upl);
          that.bindToDelete(upl);
        });
        this._appendNewDownload();

        var button = new Psc.UI.Button({
          label: 'bestehende Datei auswählen',
          leftIcon: 'plusthick'
        }), $button;
        
        pane.getRightTag().append(this.$$files);
        pane.getRightTag().append($button = button.create());
        
        $button.on('click', function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          
          that.openSelectDialog();
        });
        
        this.getEventManager().on('select-file', function(e, file) {
          var $li = $('<li/>');
          var upl = new Psc.UI.UploadableFile({
            uploadService: that.getUploadService(),
            widget: $li,
            url: file.url,
            id: file.id,
            description: file.description
          });
          
          files.find('li:last').before($li);
          upls.push(upl);
          that.bindToDelete(upl);
        });
        
        this.$$formBuilder.open();
        this.$$formBuilder.textField('Überschrift (kann leer gelassen werden für Standard-Text)', 'headline', this.$$headline);
        pane.getLeftTag().append(this.$$formBuilder.build());
      },
      
      _appendNewDownload: function() {
        var that = this;
        // neu
        var $li = $('<li/>');
        var upl = new Psc.UI.UploadableFile({
            uploadService: this.getUploadService(),
            widget: $li,
            url: null,
            id: null,
            description: ''
        });
        this.$$files.append($li);
        this.$$upls.push(upl);
        
        upl.getEventManager().on('file-new', function (e) {
          that._appendNewDownload();
        });
        
        this.bindToDelete(upl);
      },
      
      bindToDelete: function(upl) {
        var that = this;
        upl.getEventManager().on('file-deleted', function (e, upl) {
          e.preventDefault();
          var $li = upl.unwrap().closest('li');
          
          if ($li.length) {
            $li.remove();
            that.$$upls = _.without(that.$$upls, upl);
          }
        });
      },
      
      openSelectDialog: function() {
        var that = this;
        
        this.$$selectDialog = new Psc.UI.Dialog({
          title: 'Download auswählen',
          closeButton: "schließen",
          width: 800,
          height: 450,
          maxHeight: 600,
          onCreate: function (e, dialog) {
            
            dialog.setContent('<span class="hint small">lade Dateien..</span>');
            
            $.when(that.getUploadService().pullUploadFiles()).then(function(files) {
              var rows = [], file, i;
              
              for (i = 0; i<files.length; i++) {
                file = files[i];
                rows.push([
                  $('<a/>', {
                    html: file.name || file.originalName,
                    href: file.url,
                    target: '_blank',
                    'class': 'game-file-link'
                  }),
                  Psc.Numbers.formatBytes(file.size),
                  (new Psc.UI.Button({
                    label: 'auswählen',
                    leftIcon: 'circle-check'
                  })).create().addClass('select').data('select-file', file)
                ]);
              }
              
              var grid = new Psc.UI.GridTable({
                table: new Psc.Table({
                  columns: [
                    {name:'name', 'label':'Dateiname', type:'String'},
                    {name:'size', label: 'Größe', type: 'Integer'},
                    {name:'button', label: '', type: 'jQuery'}
                  ],
                  data: rows
                }),
                name: 'uploadedFiles'
              });
              
              var $grid;
              
              dialog.setContent(
                grid.attach($grid = grid.html())
              );
              
              $grid.on('click', 'button.select', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                
                var file = $(e.currentTarget).data('select-file');
                var ev = that._trigger('select-file', [file]);
                
                if (!ev.isDefaultPrevented()) {
                  dialog.close();
                }
              });
              
              that._trigger('select-files-loaded', [dialog, grid]);
            });
          }
        });
        
        this.$$selectDialog.open();
        
        return this;
      },
      
      serializeDownloads: function () {
        var downloads = [];
        $.each(this.$$upls, function (i, upl) {
          if (upl.getId() > 0) {
            downloads.push({
              type: 'download',
              label: 'Download',
              //url: upl.getUrl(),
              //description: upl.getDescription(),
              file: upl.getId()
            });
          }
        });
        
        return downloads;
      },
      
      toString: function() {
        return "[Psc.UI.LayoutManager.DownloadsList]";
      }
    }
  });
});