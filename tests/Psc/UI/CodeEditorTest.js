define(['psc-tests-assert', 'text!test-files/tiptoi/tito-program.tito', 'Psc/UI/CodeEditor'], function(t, titoCode) {
  var $html;

  module("Psc.UI.CodeEditor", {
    setup: function() {
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

      $html = $('#visible-fixture').html(html);
    }
  });

  test("acceptance", function() {
    expect(0);

    var codeEditor = new Psc.UI.CodeEditor({
      widget: $html.find('.editor')
    });
  });

  test("load editor in tito mode", function() {
    expect(0);

    var $editor;

    $('#visible-fixture').empty().append(
      $editor = $('<div class="editor" />').append(titoCode)
    );

    var codeEditor = new Psc.UI.CodeEditor({
      widget: $editor,
      mode: 'tito'
    });
  });
});