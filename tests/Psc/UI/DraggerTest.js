define(['psc-tests-assert','Psc/UI/Dragger'], function(t) {
  
  module("Psc.UI.Dragger");
  
  var setup =  function () {
      drag = new Psc.UI.Dragger({ });
      
      // absolute + relative positionierung noch nicht gebraucht
      // vll mach ich mal features zu relativen elementen
      var $fixture = $('<div class="drag-container" style="position: relative; height: 100%;"></div>');
      
      $('#visible-fixture').empty()
        .css('position','absolute')
        .css('height', '400px')
        .css('width', '400px')
        .css('top','100px')
        .css('left','100px')
        .append($fixture);
      
      $draggable = $('<button></button>').button({label: 'i am draggable'});
      $fixture.empty().append($draggable);
      $draggable.draggable({
        cancel: false
      });
      
      oldPos = $draggable.offset();

      this.assertEquals(124,$draggable.outerWidth(), 'outerWidth fits test');
      this.assertEquals(31,$draggable.outerHeight(), 'outerHeight fits tests');
      
      return [drag, $draggable, oldPos];
  };

  test("dragsDistance on Element", function() {
    var s = setup(), drag = s[0], $draggable = s[1], oldPos = s[2], pos;
    
    drag.distance($draggable, 30, 0);
    pos = $draggable.offset();
    
    this.assertEquals(oldPos.left+30, pos.left, 'left Position goes +30');
    this.assertEquals(oldPos.top, pos.top, 'top Position does not change');
  });
  
  test("drags To Certain Position", function () {
    var s = setup(), drag = s[0], $draggable = s[1], oldPos = s[2], pos;
    
    drag.toPosition($draggable, 200, 200, 'top left'); // das top left ist einfacher zu testen als center

    pos = $draggable.offset();
    // mit paar rundungsfehlern, 100% präzisiion ist für uns aber nicht so wichtig
    this.assertEquals(Math.round(pos.top), 200, 'top position after absolute positioning'); 
    this.assertEquals(Math.round(pos.left), 200, 'left position after absolute positioning');
  });
  
  test("drags onto an Element acceptance with droppable", function () {
    // margin-top als sicherheitsabstand :)
    $droppable = $('<div style="margin-top: 20px; width: 200px; border: 1px solid red"><p>not dropped</p></div>');
    $fixture.append($droppable);
    
    $droppable.droppable({
	  drop: function( event, ui ) {
		$( this )
		  .addClass( "ui-state-highlight" )
		  .find( "p" )
			.html("dropped");
		}
	});
    
    this.assertEquals('not dropped',$droppable.find('p').text())
    drag.toElement($draggable, $droppable);
    this.assertEquals('dropped',$droppable.find('p').text())
  });
});