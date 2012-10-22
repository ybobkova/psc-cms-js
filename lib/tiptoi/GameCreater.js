define(['Psc/Request', 'Psc/Code', 'Psc/UI/WidgetWrapper', 'Psc/UI/CodeEditor'], function() {
  Joose.Class('tiptoi.GameCreater', {
    isa: Psc.UI.WidgetWrapper,
  
    has: {
      service: { is : 'rw', required: true, isPrivate: true },
      preview: { is : 'rw', required: false, isPrivate: true },
      codeEditor: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function () {
        this.initUI();
      }
    },
    
    methods: {
      initUI: function () {
        var that = this;
        //this.$$preview = this.unwrap().find('div.content.code-preview textarea');
         this.$$preview =
          Psc.UI.WidgetWrapper.unwrapWidget(
            this.unwrap().find('div.component-for-previewCode div.psc-cms-ui-ace-editor'),
            Psc.UI.CodeEditor
          );
       
        this.$$codeEditor =
          Psc.UI.WidgetWrapper.unwrapWidget(
            this.unwrap().find('div.component-for-metaCode div.psc-cms-ui-ace-editor'),
            Psc.UI.CodeEditor
          );
        
        this.unwrap().find('button.convert-code').on('click', function (e) {
          e.preventDefault();
          
          var request = that.getService().createRequest(['game-creater', 'convert'],
                                                        'POST',
                                                        {
                                                          code: that.getMetaCode(),
                                                          pageNum: that.getPageNum()
                                                        }, 'text');
          var status = that.getService().handleAjaxRequest(request, undefined, true);
          
          status.done(function (response) {
            that.getPreview().setText(response.getBody());
            
          });
        });
        
      },
      getMetaCode: function () {
        return this.$$codeEditor.getText();
      },
      getPageNum: function () {
        return this.unwrap().find('.component-for-page-num input').val();
      },
      toString: function() {
        return "[tiptoi.GameCreater]";
      }
    }
  });
});  