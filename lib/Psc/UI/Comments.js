define(['jquery-tmpl', 'Psc/UI/WidgetWrapper'], function() {
  Joose.Class('Psc.UI.Comments', {
    isa: Psc.UI.WidgetWrapper,
  
    has: {
      comments: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Array },
      
      /**
       * ein Psc.UI.Template
       */
      commentTemplate: { is : 'rw', required: true, isPrivate: true },
  
      /**
       * ein Psc.UI.Template
       * %d Kommentare als anzeige (optional)
       */
      countTemplate: { is : 'rw', required: false, isPrivate: true },
      
      /**
       * .pullComments() returns: commentData[]
       */
      service: { is : 'rw', required: true, isPrivate: true }
    },
    
    after: {
      initialize: function() {
        this.checkWidget();
        this.linkWidget();
        
        this.initUI();
      }
    },
    
    methods: {
      initUI: function () {
        var that = this;
        
        // das triggered in jquery.main.js nach dem ajax posten des Formulares
        this.unwrap().on('new-comment', function (e, commentData) {
          that.addComment(commentData);
          that.updateCount();
        });
        
        // comments laden
        $.when(this.$$service.pullComments()).then(function (comments) {
          $.each(comments, function (i, commentData) {
            that.addComment(commentData);
          });
          
          that.updateCount();
        });
      },
      
      updateCount: function () {
        if (this.$$countTemplate) {
          var $count = this.unwrap().find('.comments-count');
          if ($count.length) {
            this.$$countTemplate.replace($count, {count: this.$$comments.length});
          }
        }
      },
      
      addComment: function (commentData) {
        /*if (!this.$$comments[commentData.id]) {
          this.$$comments[commentData.id] = commentData;
        */
        this.$$comments.push(commentData);
          
        var $comment = this.$$commentTemplate.render(commentData);
        
        this.findList().append($comment);
      },
      
      findList: function() {
        return this.unwrap().find('ul.comments');
      },
      toString: function() {
        return "[Psc.UI.Comments]";
      }
    }
  });
});