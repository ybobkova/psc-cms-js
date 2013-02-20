define(['psc-tests-assert','Psc/TextParser'], function(t) {
  
  module("Psc.TextParser");
  
  var setup = function(test) {
    var textParser = new Psc.TextParser({ });
    
    var lines = [
      "sichergestellt, dass Nachhaltigkeit versprechende Lösungen aus der Region Leuchtturmwirkung erzielen und z",
      "maghrebinischen Städten ergänzt, so dass das Wissen und die Erfahrungen deutscher Kommunen,",
      "CoMun bietet für die Partner eine Kombination aus Dialog, Erfahrungsaustausch und technischer Beratung. Das Programm  arbeitet",
      "owie verschiedenen deutschen Städten, dem Marseille Center for Mediterranean Integration (CMI"
    ];
    
    test = t.setup(test, {textParser: textParser, lines: lines});
    
    test.assertParsing = function(expectedParsedStructure, text) {
      test.assertEquals(
        expectedParsedStructure,
        textParser.parse(text)
      );
    };
  };

  test("parser extracts test paragraph into nodes", function() {
    setup(this);
    
    this.assertParsing(
      [
        {value: this.lines[0], type: "paragraph"},
        {value: this.lines[1], type: "paragraph"},
        {value: this.lines[2], type: "paragraph"}
      ],
      
      this.lines[0]+"\n\n"+
      this.lines[1]+"\n\n"+
      this.lines[2]+"\n"
    );
  });

  test("parser detects a list surrounded from text", function() {
    setup(this);
    
    this.assertParsing([
        {value: this.lines[0], type: "paragraph"},
        {value: this.lines[1], type: "paragraph"},
        {value: "Mit dem Vorhaben CoMun fördert die:", type: "paragraph"},
        {value: ["list1", "list2"], type: "list"},
        {value: this.lines[2], type: "paragraph"}
      ],

      this.lines[0]+"\n\n"+
      this.lines[1]+"\n\n"+
      "Mit dem Vorhaben CoMun fördert die:\n"+
      "-	list1\n"+
      "-	list2\n"+
      "\n"+
      this.lines[2]
    );
  });
  
  test("parser detects list only in lines", function() {
    setup(this);
    
    this.assertEquals([
      {value: ["list1", "list2", "list3"], type:"list"}
      ],
      
      this.textParser.parse(
        "\n"+
        " - list1\n"+
        " - list2\n"+
        " - list3\n"
      )
    );
  });
});