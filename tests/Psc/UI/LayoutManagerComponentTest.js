define(['psc-tests-assert','Psc/UI/LayoutManagerComponent'], function(t) {
  
  module("Psc.UI.LayoutManagerComponent");
  
  var setup = function(test) {
    var layoutManagerComponentClass = Joose.Class('SomeComponent', {
        isa: Psc.UI.LayoutManagerComponent,
        
        has: {
          testContent: { is : 'rw', required: false, isPrivate: true }
        },
        
        methods: {
          createWithMiniPanel: function(buttons) {
            var panel = this.createMiniButtonPanel(buttons);
            
            this.$$testContent = panel.html();
          },
          
          createContent: function() {
            return this.$$testContent;
          }
        }
      }
    );
    
    var layoutManagerComponent = new layoutManagerComponentClass({
      'label':'someComponent'
    });
    
    test = t.setup(test, {component: layoutManagerComponent});
    
    var buildContent = function (component) {
      if (!component) component = test.component;
      
      var html = component.create();
      
      test.widget.html(html);
      
      return html;
    };
    
    test.$widget.css('width', '730px');
    
    return test;
  };

  test("returnsAMiniButtonPanelOnCreate", function() {
    expect(0);
    setup(this);
    
    this.component.createWithMiniPanel();
    var html = this.buildContent(this.component);
    

  });
});