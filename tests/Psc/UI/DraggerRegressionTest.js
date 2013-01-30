define(['psc-tests-assert','jquery-simulate'], function(t) {
  module("Psc.UI.Dragger");
  
  var setup =  function (test) {
    var $fixture = $('#visible-fixture').empty();
    
    var $someDiv = $('<div />')
       .css('height', '110px')
       .css('width', '550px');
       
    
    var $draggable = $('<button class="child-class"></button>')
                      .button({label: 'i am draggable'})
                      .draggable({
                       cancel: false
                      });
                      
    $someDiv.append($draggable);
    $fixture.append($someDiv);
    
    test.findCenter = function findCenter( elem ) {
      var offset, document = $( elem.ownerDocument ); elem = $( elem ); offset =
      elem.offset();

      return {
        x: offset.left + elem.outerWidth() / 2 - document.scrollLeft(), y:
        offset.top + elem.outerHeight() / 2 - document.scrollTop()
      };
    };
    
    return $.extend(test, {
      $draggable: $draggable,
      $someDiv: $someDiv,
      $fixture: $fixture
    });
  };
  
  test("regression: click is triggered after drag", function () {
    setup(this);
    expect(1);
    
    var clicked = false;
    
    this.$someDiv.on('click', function (e) {
      clicked = true;
    });

    this.$someDiv.on('click', '.child-class', function (e) {
      clicked = true;
    });
    
    this.$draggable.on('click', function (e) {
    });
    
    
    this.$draggable.simulate('drag', {dx: 0, dy: +20});
    
    QUnit.equal(clicked, false, 'someDiv click is not triggered');
  });
});