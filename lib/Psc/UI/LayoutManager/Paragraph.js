define(['Psc/UI/LayoutManagerComponent', 'Psc/TextEditor'], function () {
  Joose.Class('Psc.UI.LayoutManager.Paragraph', {
    isa: Psc.UI.LayoutManagerComponent,
  
    has: {
      textEditor: { is : 'rw', required: false, isPrivate: true },
      linkTemplate: { is : 'rw', required: false, isPrivate: true }
    },
    
    before: {
      initialize: function (props) {
        this.$$type = 'paragraph';
        
        if (!this.$$linkTemplate) {
          this.$$linkTemplate = '[[http://www.|Link-Beschreibung]]';
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
            this.$$textEditor.insertSpaced(
              this.$$linkTemplate
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
            content = this.$$textEditor.getSelectionText();
            this.$$textEditor.move(this.$$textEditor.getSelection().start);
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
      toString: function() {
        return "[Psc.UI.LayoutManager.Paragraph]";
      }
    }
  });
});