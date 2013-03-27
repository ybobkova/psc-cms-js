define(['psc-tests-assert', 'Psc/UI/LayoutManager/Li'], function(t) {
  
  module("Psc.UI.LayoutManager.Li");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();

    var $container = $('<div/>');
    $('#visible-fixture').empty().append($container);

    var li = new Psc.UI.LayoutManager.Li({
      label: 'Aufzählung',
      content: [
        "Familienunternehmen mit mehr als 30 Jahren Erfahrung und Wissen",
        "Unternehmergeist durch und durch – langfristige Fortführung des Unternehmens durch Söhne des Firmengründers"
      ]
    });

    var emptyLi = new Psc.UI.LayoutManager.Li({
      label: 'Aufzählung'
    });
    
    $container.append(li.create());
    
    return t.setup(test, {li: li, $container: $container});
  };
  
  test("html is rendered somehow", function() {
    var that = setup(this);
    
    this.assertjQueryLength(1, this.$container.find('.widget.li'));
    this.assertjQueryLength(2, this.$container.find('textarea'), 'both list points are rendered as textarea');
    
  });

  test("when cleanup is called before isEmpty reflects if li has items", function () {
    var that = setup(this);

    this.li.cleanup();
    this.assertFalse(this.li.isEmpty());

    this.$container.find('div.li textarea').val(''); // empty all
    this.li.cleanup();
    this.assertTrue(this.li.isEmpty());
  });

  test("when cleanup is called before searlize returns the listitems as content", function () {
    var that = setup(this), s = {type: 'li', 'label': 'none'};

    this.li.cleanup();
    this.li.serialize(s);

    this.assertLength(2, s.content);
  });

  test("when cleanup is called before serialize returns the current listitems as content", function () {
    var that = setup(this), s = {type: 'li', 'label': 'none'};

    this.$container.find('div.li textarea:last').val(''); // empty last (1of2)

    this.li.cleanup();
    this.li.serialize(s);
    
    this.assertLength(1, s.content);
  });
});