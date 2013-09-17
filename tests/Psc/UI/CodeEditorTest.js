define(['psc-tests-assert', 'text!test-files/tiptoi/tito-program.tito', 'Psc/UI/CodeEditor'], function(t, titoCode) {

  module("Psc.UI.CodeEditor");

  var setup = function(test) {
    var html = '<div class="editor">  public function testHTML() {' + "\n" +
        '    $this->setFixtureValues();' + "\n" +
        '    ' + "\n" +
        '    $html = $this->component->getHTML();' + "\n" +
        '    ' + "\n" +
        '    $input = $this->test->css(\'textarea\', $html)' + "\n" +
        '      ->count(1, \'keine textarea gefunden\')' + "\n" +
        "      ->hasAttribute('name', 'testName')" + "\n" +
        "      ->hasAttribute('cols')" + "\n" +
        "      ->hasAttribute('rows')" + "\n" +
        "      ->hasStyle('width','90%')" + "\n" +
        "      ->hasText($this->testValue)" + "\n" +
        "      ->getJQuery();" + "\n" +
        '</div>';

    var $html = $('#visible-fixture').html(html);

    return t.setup(test, {html: html, $html: $html});
  };

  test("acceptance", function() {
    var that = setup(this), $html = this.$html, $widget;

    var codeEditor = new Psc.UI.CodeEditor({
      widget: $widget = $html.find('.editor')
    });

    this.assertHasJooseWidget(Psc.UI.CodeEditor, $widget);
  });

  test("load editor in tito mode", function() {
    var that = setup(this);
    var $editor;

    $('#visible-fixture').empty().append(
      $editor = $('<div class="editor" />').append(titoCode)
    );

    var codeEditor = new Psc.UI.CodeEditor({
      widget: $editor,
      mode: 'tito'
    });

    this.assertHasJooseWidget(Psc.UI.CodeEditor, $editor);
  });
});