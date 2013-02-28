define(['psc-tests-assert', 'Psc/UI/LayoutManager/Paragraph', 'Psc/UI/LayoutManager/CollectionWidget'], function(t) {
  
  module("Psc.UI.LayoutManager.CollectionWidget");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();

    var $container = $('<div/>');
    $('#visible-fixture').empty().append($container);

    var collectionWidget = new Psc.UI.LayoutManager.CollectionWidget({
      label: 'multiple paragraphs',
      collectionable: {
        constructor: Psc.UI.LayoutManager.Paragraph
      },
      content: [
        new Psc.UI.LayoutManager.Paragraph({
          label: 'Absatz',
          content: "Familienunternehmen mit mehr als 30 Jahren Erfahrung und Wissen"
        }), 
        new Psc.UI.LayoutManager.Paragraph({
          label: 'Absatz',
          content: "Unternehmergeist durch und durch – langfristige Fortführung des Unternehmens durch Söhne des Firmengründers"
        })
      ]
    });

    $container.append(collectionWidget.create());
    
    return t.setup(test, {collectionWidget: collectionWidget, $container: $container});
  };
  
  test("html is rendered somehow", function() {
    var that = setup(this);
    
    this.assertjQueryLength(2, this.$container.find('textarea'), 'both paragraphs are rendered as textarea');
    
  });

  test("empty collectionable can be added with api (button)", function() {
    var that = setup(this);
    
    var $button = this.assertjQueryLength(1, this.$container.find('button.add-new'));
    $button.trigger('click');
    
    this.assertjQueryLength(3, this.$container.find('textarea'), 'both paragraphs and a new are rendered as textarea');
    
  });
  
  
  test("the collection is sortable (acceptance)", function () {
    setup(this);
    
    var $collection = this.assertjQueryLength(1, this.$container.find('.collection-container'));
    this.assertjQueryHasWidget("sortable", $collection);
    
  });
});