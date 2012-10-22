define(['Psc/UI/SplitPane', 'Psc/UI/UploadableFile', 'Psc/UI/Group', 'Psc/UI/FilesTable', 'Psc/UI/LayoutManagerComponent'], function() {
  Joose.Class('Psc.UI.LayoutManager.Downloadslist', {
    isa: Psc.UI.LayoutManagerComponent,
  
    has: {
      uploadService: { is : 'rw', required: true, isPrivate: true },
      
      // die downloads der liste
      downloads: { is : 'rw', required: true, isPrivate: true },
      headline: { is : 'rw', required: true, isPrivate: true },
      
      filesTable: { is : 'rw', required: false, isPrivate: true },
      
      // eine liste von FileUploadables
      files: { is : 'rw', required: false, isPrivate: true },
      upls: { is : 'rw', required: false, isPrivate: true }
    },
    
    before: {
      initialize: function () {
        this.$$type = 'downloadslist';
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
  
        //this.$$filesTable = new Psc.UI.FilesTable({
        //  uploadService: this.$$uploadService,
        //  widget: pane.getRightTag()
        //});
        var files = this.$$files = $('<ul/>');
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
        });
        this._appendNewDownload();
        
        pane.getRightTag().append(this.$$files);
        
        this.$$formBuilder.open();
        this.$$formBuilder.textField('Überschrift (kann leer gelassen werden für Standard-Text)', 'headline', this.$$headline);
        pane.getLeftTag().append(this.$$formBuilder.build());
      },
      
      _appendNewDownload: function() {
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
        return "[Psc.UI.LayoutManager.Downloadslist]";
      }
    }
  });
});