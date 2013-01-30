define(['Psc/UI/LayoutManagerComponent', 'Psc/TextEditor', 'Psc/UI/InteractionProviding'], function () {
  Joose.Class('Psc.UI.LayoutManager.Paragraph', {
    isa: Psc.UI.LayoutManagerComponent,
    
    does: [Psc.UI.InteractionProviding],
  
    has: {
      textEditor: { is : 'rw', required: false, isPrivate: true },
      linkTemplate: { is : 'rw', required: false, isPrivate: true }
    },
    
    before: {
      initialize: function (props) {
        this.$$type = 'paragraph';
        
        if (!this.$$linkTemplate) {
          this.$$linkTemplate = '[[%url%|%selection%]]';
        }
      }
    },
    
    methods: {
      createContent: function () {
        var content = this.$$content, $ta;
        
        this.$$content = [];
        this.$$content.push(this.createButtonPanel().html());
        this.$$content.push($ta = this.createTextarea(content));
        
        this.$$textEditor = new Psc.TextEditor({widget: $ta});
        
        return this.$$content;
      },
      
      createButtonPanel: function () {
        var that = this;
        return this.createMiniButtonPanel({
          'add-link': {
            leftIcon: 'link',
            label: 'Link einfügen',
            click: function (e) {
              that.addLink();
            }
          },
          'bold': {
            label: '<strong>B</strong>',
            click: function (e) {
              that.addTagWithSelection('b');
            }
          },
          'italic': {
            label: '<span class="italic">I</span>',
            click: function (e) {
              that.addTagWithSelection('i');
            }
          },
          'underlined': {
            label: '<span style="text-decoration: underline;">U</span>',
            click: function (e) {
              that.addTagWithSelection('u');
            }
          }
        });
      },
      
      addLink: function () {
        if (this.$$textEditor) {
          try {
            var content, url;
            if (this.$$textEditor.hasSelection()) {
              var selection = this.$$textEditor.getSelection();
              content = this.trimString(this.$$textEditor.getSelectionText());
              this.$$textEditor.deleteSelection();
              this.$$textEditor.move(selection.start);
            }
            
            url = this.interactivePrompt("Geben Sie die URL des Links ein", 'http://www.');
            
            if (!content) {
              content = this.interactivePrompt("Geben Sie die Beschriftung des Links ein", url.replace(/^(.*?):\/\//, ''));
            }
            
            this.$$textEditor.insertSpaced(
              this.$$linkTemplate.replace(/%selection%/, content).replace(/%url%/, url)
            );
          
          } catch (ex) {
            // wegen caret position nicht gesetzt, könnte hier eine exception kommen
          }
        }
      },
      addTagWithSelection: function (tagName) {
        if (this.$$textEditor) {
          var content;
          if (this.$$textEditor.hasSelection()) {
            var selection = this.$$textEditor.getSelection();
            content = this.trimString(this.$$textEditor.getSelectionText());
            this.$$textEditor.deleteSelection();
            this.$$textEditor.move(selection.start);
          }
          
          this.addTag(tagName, content);
        }
      },
      addTag: function (tagName, content) {
        if (this.$$textEditor) {
          if (!content) content = '';
          
          try {
            this.$$textEditor.insertSpaced(
              '['+tagName+']'+content+'[/'+tagName+']'
            );
          } catch (ex) {
            throw ex;
          }
        }
      },
      trimString: function (string) {
        return string.replace(/^\s+|\s+$/g, '');
      },
      toString: function() {
        return "[Psc.UI.LayoutManager.Paragraph]";
      }
    }
  });
});