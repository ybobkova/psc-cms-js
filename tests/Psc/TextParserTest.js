define(['psc-tests-assert','Psc/TextParser'], function() {
  
  module("Psc.TextParser");
  
  var setup = function () {
    var textParser = new Psc.TextParser({ });
    
    var texts = [
      "sichergestellt, dass Nachhaltigkeit versprechende Lösungen aus der Region Leuchtturmwirkung erzielen und z",
      "maghrebinischen Städten ergänzt, so dass das Wissen und die Erfahrungen deutscher Kommunen,",
      "CoMun bietet für die Partner eine Kombination aus Dialog, Erfahrungsaustausch und technischer Beratung. Das Programm  arbeitet",
      "owie verschiedenen deutschen Städten, dem Marseille Center for Mediterranean Integration (CMI"
    ];
    
    return {textParser: textParser, texts: texts};
  };

  test("parser extracts test paragraph into nodes", function() {
    $.extend(this, setup());
    
    this.assertEquals([
        {value: this.texts[0], type: "paragraph"},
        {value: this.texts[1], type: "paragraph"},
        {value: this.texts[2], type: "paragraph"}
      ],
      this.textParser.parse(this.texts[0]+"\n\n"+
                            this.texts[1]+"\n\n"+
                            this.texts[2]+"\n"
                           )
    );
  });

  test("parser detects lists in texts", function() {
    $.extend(this, setup());
    
    this.assertEquals([
        {value: this.texts[0], type: "paragraph"},
        {value: this.texts[1], type: "paragraph"},
        {value: "Mit dem Vorhaben CoMun fördert die:", type: "paragraph"},
        {value: ["list1", "list2"], type: "list"},
        {value: this.texts[2], type: "paragraph"}
      ],
      this.textParser.parse(this.texts[0]+"\n\n"+
                            this.texts[1]+"\n\n"+
                            "Mit dem Vorhaben CoMun fördert die:\n"+
                            "-	list1\n"+
                            "-	list2\n"+
                            "\n"+
                            this.texts[2]
                           )
    );
  });
  
  test("parser detects list only in texts", function() {
    $.extend(this, setup());
    
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