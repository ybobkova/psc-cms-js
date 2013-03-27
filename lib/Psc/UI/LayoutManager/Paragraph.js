define(['joose', 'Psc/UI/LayoutManagerComponent', 'Psc/TextEditor', 'Psc/UI/InteractionProviding'], function(Joose) {
  Joose.Class('Psc.UI.LayoutManager.Paragraph', {
    isa: Psc.UI.LayoutManagerComponent,
    
    does: [Psc.UI.InteractionProviding],
  
    has: {
      textEditor: { is : 'rw', required: false, isPrivate: true },
      linkTemplate: { is : 'rw', required: false, isPrivate: true }
    },
    
    before: {
      initialize: function (props) {
        this.$$type = 'Paragraph';
        
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
              that.addTagWithSelection('**');
            }
          },
          'italic': {
            label: '<span class="italic">I</span>',
            click: function (e) {
              that.addTagWithSelection('//');
            }
          },
          'underlined': {
            label: '<span style="text-decoration: underline;">U</span>',
            click: function (e) {
              that.addTagWithSelection('__');
            }
          }
        });
      },

      serialize: function(s) {
        s.content = this.unwrap().find('textarea').val();
      },

      isEmpty: function() {
        return this.isEmptyText(this.unwrap().find('textarea').val());
      },

      addLink: function () {
        if (this.$$textEditor) {
          try {
            var content, url, selection;
            if (this.$$textEditor.hasSelection()) {
              selection = this.$$textEditor.getSelection();
              content = this.trimString(this.$$textEditor.getSelectionText());
            }
            
            url = this.interactivePrompt("Geben Sie die URL des Links ein", 'http://www.');
            
            if (!content) {
              content = this.interactivePrompt("Geben Sie die Beschriftung des Links ein", url.replace(/^(.*?):\/\//, ''));
            }
            
            if (selection) {
              this.$$textEditor.deleteSelection();
              this.$$textEditor.move(selection.start);
            }
            
            this.$$textEditor.insertSpaced(
              this.$$linkTemplate.replace(/%selection%/, content).replace(/%url%/, url)
            );
          
          } catch (ex) {
            // wegen caret position nicht gesetzt, könnte hier eine exception kommen
          }
        }
      },
      addTagWithSelection: function (tag) {
        if (this.$$textEditor) {
          var content;
          if (this.$$textEditor.hasSelection()) {
            var selection = this.$$textEditor.getSelection();
            content = this.trimString(this.$$textEditor.getSelectionText());
            this.$$textEditor.deleteSelection();
            this.$$textEditor.move(selection.start);
          }
          
          this.addTag(tag, content);
        }
      },
      addTag: function (tag, content) {
        if (this.$$textEditor) {
          if (!content) content = '';
          
          try {
            this.$$textEditor.insertSpaced(
              this.formatTag(tag, content)
            );
          } catch (ex) {
            throw ex;
          }
        }
      },
      formatTag: function (tag, content) {
        return tag+content+tag;
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