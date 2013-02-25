define(['psc-tests-assert', 'joose', 'Psc/UI/LayoutManagerComponent'], function(t, Joose) {
  
  module("Psc.UI.LayoutManagerComponent");
  
  var setup = function(test) {
    var LayoutManagerComponentClass = Joose.Class({
        isa: Psc.UI.LayoutManagerComponent,
        
        has: {
          testContent: { is : 'rw', required: false, isPrivate: true },
          testType: { is : 'rw', required: false, isPrivate: true, init: "some-widget" }
        },
        
        before: {
          initialize: function () {
            this.$$type = this.$$testType;
          }
        },
        
        methods: {
          createWithMiniPanel: function(buttons) {
            var panel = this.createMiniButtonPanel(buttons);
            
            this.$$testContent = panel.html();
          },
          
          createContent: function() {
            return this.$$content = this.$$testContent;
          }
        }
      }
    );

    var BadLayoutManagerComponentClass = Joose.Class({
        isa: Psc.UI.LayoutManagerComponent,
        
        before: {
          initialize: function () {
            // missing:  this.$$type = 'some-widget';
            
          }
        },
        
        methods: {
          createContent: function() {
          }
        }
      }
    );
    
    var layoutManagerComponent = new LayoutManagerComponentClass({
      'label':'someComponent'
    });
    
    test = t.setup(test, {
      component: layoutManagerComponent,
      LayoutManagerComponentClass: LayoutManagerComponentClass,
      BadLayoutManagerComponentClass: BadLayoutManagerComponentClass
    });
    
    test.buildContent = function (component) {
      if (!component) component = test.component;
      
      var html = component.create();
      
      test.$widget.html(html);
      
      return html;
    };
    
    test.$widget.css('width', '730px');
    
    return test;
  };

  test("returnsAMiniButtonPanelOnCreate", function() {
    expect(0);
    setup(this);
    
    this.component.createWithMiniPanel({
      'add-link': {
        leftIcon: 'link',
        title: 'add a link',
        click: function () {
          // do something
        }
      },
      'bold': {
        label: 'B'
      },
      'strong': {
        label: 'K'
      }
    });
    
    var html = this.buildContent(this.component);
  });
  
  test("cannot be constructed without type", function () {
    setup(this);
    
    try {
      var lc = new this.BadLayoutManagerComponentClass();
    } catch (e) {
      this.assertTrue(true, "exception caught, that says: type is required");
      return;
    }
    
    this.fail("expected exception is not caught");
  });
  
  test("can be constructed without label - it uses the type as label", function () {
    setup(this);
    
    try {
      var lc = new this.LayoutManagerComponentClass({
        testType: "some-widget"
      });
      
      this.assertEquals("some-widget", lc.getLabel());
    } catch (e) {
      this.fail(e);
    }
  });

  test("can be constructed without label - it uses the language labels", function () {
    setup(this);
    
    try {
      var lc = new this.LayoutManagerComponentClass({
        testType: 'paragraph'
      });
      
      this.assertEquals("Absatz", lc.getLabel());
    } catch (e) {
      this.fail(e);
    }
  });
});