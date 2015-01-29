define(['joose', 'Psc/UI/LayoutManagerComponent', 'Psc/TextEditor', 'Psc/UI/InteractionProviding', 'Psc/UI/Translating'], function(Joose) {
  Joose.Class('Psc.UI.LayoutManager.Paragraph', {
    isa: Psc.UI.LayoutManagerComponent,
    
    does: [Psc.UI.InteractionProviding, Psc.UI.Translating],
  
    has: {
      textEditor: { is : 'rw', required: false, isPrivate: true },
      navigationService: { is : 'rw', required: true, isPrivate: true },

      linkTemplate: { is : 'rw', required: false, isPrivate: true },
      internalLinkTemplate: { is : 'rw', required: false, isPrivate: true }
    },
    
    before: {
      initialize: function (props) {
        this.$$type = 'Paragraph';
        
        if (!this.$$linkTemplate) {
          this.$$linkTemplate = '[[%url%|%selection%]]';
        }

        if (!this.$$internalLinkTemplate) {
          this.$$internalLinkTemplate = '[[#%id%|%selection%]]';
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
            label: this.trans('textEditor.buttons.ext-link'),
            click: function (e) {
              that.addHttpLink();
            }
          },
          'add-internal-link': {
            leftIcon: 'link',
            label: this.trans('textEditor.buttons.int-link'),
            click: function (e) {
              that.addInternalLink(that.$$navigationService);
            }
          },
          'add-email-link': {
            leftIcon: 'mail-closed',
            label: this.trans('textEditor.buttons.email-link'),
            click: function (e) {
              that.addEmailLink();
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

      addPromptLink: function (prefill) {
        if (this.$$textEditor) {
          try {
            var content, url, selection, at;

            // save everything FIRST because IE loses focus and caret position
            if (this.$$textEditor.hasSelection()) {
              selection = this.$$textEditor.getSelection();
              content = this.trimString(this.$$textEditor.getSelectionText());
              at = selection.start;
            } else {
              at = this.$$textEditor.getCaret();
            }
            
            url = this.interactivePrompt(this.trans('textEditor.prompt.url'), prefill);
            
            if (!content) {
              content = this.interactivePrompt(this.trans('textEditor.prompt.linkLabel'), url.replace(/^(.*?):\/\//, ''));
            }
            
            if (selection) {
              this.$$textEditor.deleteText(selection.start, selection.end); // dont refactor to use deleteSelection
              this.$$textEditor.move(selection.start);
            }
            
            this.$$textEditor.insertSpaced(
              this.$$linkTemplate.replace(/%selection%/, content).replace(/%url%/, url),
              at
            );
          
          } catch (ex) {
            // wegen caret position nicht gesetzt, könnte hier eine exception kommen
          }
        }
      },

      addHttpLink: function () {
        return this.addPromptLink('http://www.');
      },

      addEmailLink: function () {
        return this.addPromptLink('mailto:email@example.com');
      },

      addInternalLink: function (navigationService) {
        var that = this;
        if (this.$$textEditor) {
          try {
            var content, url, selection, at;

            // save everything FIRST because IE loses focus and caret position
            if (this.$$textEditor.hasSelection()) {
              selection = this.$$textEditor.getSelection();
              content = this.trimString(this.$$textEditor.getSelectionText());
              at = selection.start;
            } else {
              at = this.$$textEditor.getCaret();
            }

            $.when(
              navigationService.getNavigationSelect({
                widget: $('<div />'),
                displayLocale: this.getDisplayLocale()
              })
            ).then(function (navigationSelect) {
              var dialog = new Psc.UI.Dialog({
                title: that.trans('textEditor.dialog.chooseLinkTarget'),
                //closeButton: "schließen",
                width: '60%',
                onCreate: function (e, dialog) {
                  dialog.setContent(navigationSelect.unwrap());
                },
                onSubmit: function (e, dialog, $dialog) {
                  var node = navigationSelect.getSelectedNode();

                  if (node) {
                    window.setTimeout(function () {

                      if (selection) {
                        that.$$textEditor.deleteText(selection.start, selection.end); // dont refactor to use deleteSelection
                        that.$$textEditor.move(selection.start);
                      }

                      /* we could do that to confirm for the label of the node */
                      if (!content) {
                        content = that.interactivePrompt(that.trans('textEditor.promp.linkLabel'), node.getTitle());
                      }

                      that.$$textEditor.insertSpaced(
                        that.$$internalLinkTemplate.replace(/%selection%/, content).replace(/%id%/, node.getId()),
                        at
                      );
                    }, 10);
                  }
                }
              });

              dialog.open();
            });

          } catch (ex) {
            throw ex;
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
            var info = this.$$textEditor.insertSpaced(
              this.formatTag(tag, content)
            );

            if (!content) {
              this.$$textEditor.move(info.position+info.text.indexOf(tag)+tag.length);
            }

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