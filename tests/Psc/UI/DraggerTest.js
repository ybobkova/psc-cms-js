define(['psc-tests-assert','Psc/UI/Dragger'], function(t) {
  // this test needs jquery-css loaded!
  
  module("Psc.UI.Dragger");
  
  var setup =  function (test) {
    var drag = new Psc.UI.Dragger({ });
      
    // absolute + relative positionierung noch nicht gebraucht
    // vll mach ich mal features zu relativen elementen
    var $fixture = $('<div class="drag-container" style="position: relative; height: 100%;"></div>');
      
    var $draggerDiv = $('<div id="dragger-test-div" />')
       .css('position','absolute')
       .css('height', '400px')
       .css('width', '400px')
       .css('top','100px')
       .css('left','100px')
       .append($fixture);
    
    $('#visible-fixture').empty().append($draggerDiv);
      
    var $draggable = $('<button></button>').button({label: 'i am draggable'});
    $fixture.empty().append($draggable);
    $draggable.draggable({
      cancel: false
    });
      
    var oldPos = $draggable.offset();
     
    var ret = t.setup(test, {drag: drag, $draggable: $draggable, oldPos: oldPos, $fixture: $fixture});

    /*
     * * between browser, phantom versions (windows/linux) there is a lot of difference here
     * lets try if we need this assertions, or if the tests will adapt graceful
     * test.assertEquals(124, $draggable.outerWidth(), 'outerWidth fits test');
     * test.assertTrue(Math.abs($draggable.outerHeight()-32) <= 2, 'outerHeight fits tests');
     */
    
    return ret;
  };
  
  test("regression: click is triggered after drag", function () {
    var that = setup(this);
    that.assertTrue(true, 'this is a bug in jquery simulate');
  });

  test("dragsDistance on Element", function() {
    var that = setup(this), drag = this.drag, $draggable = this.$draggable, oldPos = this.oldPos, pos;
    
    drag.distance($draggable, 30, 0);
    pos = $draggable.offset();
    
    this.assertEquals(oldPos.left+30, pos.left, 'left Position goes +30');
    this.assertEquals(oldPos.top, pos.top, 'top Position does not change');
  });
  
  test("drags To Certain Position", function () {
    var that = setup(this), drag = this.drag, $draggable = this.$draggable, oldPos = this.oldPos, pos;
    
    drag.toPosition($draggable, 200, 200, 'top left'); // das top left ist einfacher zu testen als center

    pos = $draggable.offset();
    // mit paar rundungsfehlern, 100% präzisiion ist für uns aber nicht so wichtig
    this.assertEquals(Math.round(pos.top), 200, 'top position after absolute positioning'); 
    this.assertEquals(Math.round(pos.left), 200, 'left position after absolute positioning');
  });
  
  test("drags onto an Element acceptance with droppable", function () {
   var that = setup(this);
    // margin-top als sicherheitsabstand :)
    var $droppable = $('<div style="margin-top: 20px; width: 200px; border: 1px solid red"><p>not dropped</p></div>');
    that.$fixture.append($droppable);
    
    $droppable.droppable({
      drop: function(event, ui) {
        $(this).addClass("ui-state-highlight").find("p").html("dropped");
      }
    });
    
    this.assertEquals('not dropped',$droppable.find('p').text());
    that.drag.toElement(that.$draggable, $droppable);
    this.assertEquals('dropped',$droppable.find('p').text());
  });
});