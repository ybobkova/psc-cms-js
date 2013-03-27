define(['psc-tests-assert','Psc/TextParser'], function(t) {
  
  // aktueller test siehe sce:
  module("Psc.TextParser");
  
  var setup = function(test) {
    var textParser = new Psc.TextParser({ });
    
    var lines = [
      "sichergestellt, dass Nachhaltigkeit versprechende L�sungen aus der Region Leuchtturmwirkung erzielen und",
      "maghrebinischen St�dten erg�nzt, so dass das Wissen und die Erfahrungen deutscher Kommunen,",
      "CoMun bietet f�r die Partner eine Kombination aus Dialog, Erfahrungsaustausch und technischer Beratung. Das Programm  arbeitet",
      "sowie verschiedenen deutschen St�dten, dem Marseille Center for Mediterranean Integration (CMI"
    ];
    
    var listPoints = [
      "Familienunternehmen mit mehr als 30 Jahren Erfahrung und Wissen",
      "Unternehmergeist durch und durch � langfristige Fortf�hrung des Unternehmens durch S�hne des Firmengr�nders",
      "Mehr als 12 000 zufriedene Kunden weltweit",
      "Umfangreiche Innovationskraft und Erfindertum"
    ];
    
    var numberedListText =
      "1\tFamilienunternehmen mit mehr als 30 Jahren Erfahrung und Wissen \n"+
      "2\tUnternehmergeist durch und durch � langfristige Fortf�hrung des Unternehmens durch S�hne des Firmengr�nders    \n"+
      "3\tMehr als 12 000 zufriedene Kunden weltweit\n"+
      "4\tUmfangreiche Innovationskraft und Erfindertum      \n";
  
    test = t.setup(test, {textParser: textParser, lines: lines, listPoints: listPoints, numberedListText: numberedListText});
    
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

  test("parser detects a list surounded by text", function() {
    setup(this);
    
    this.assertParsing([
        {value: this.lines[0], type: "paragraph"},
        {value: this.lines[1], type: "paragraph"},
        {value: "Mit dem Vorhaben CoMun f�rdert die:", type: "paragraph"},
        {value: ["list1", "list2"], type: "list"},
        {value: this.lines[2], type: "paragraph"}
      ],

      this.lines[0]+"\n\n"+
      this.lines[1]+"\n\n"+
      "Mit dem Vorhaben CoMun f�rdert die:\n"+
      "-\tlist1\n"+
      "-\tlist2\n"+
      "\n"+
      this.lines[2]
    );
  });
  
  test("parser detects list only in lines", function() {
    setup(this);
    
    this.assertParsing([
        {value: ["list1", "list2", "list3"], type:"list"}
      ],
      
      "\n"+
      " - list1\n"+
      " - list2\n"+
      " - list3\n"
    );	
	});
	
	test("parser detects two lists following each other", function() {
    setup(this);
    
    this.assertParsing([
        {value: ["list1", "list2", "list3"], type:"list"},
			  {value: ["list4", "list5", "list6"], type:"list"}
      ],
      
      "\n"+
      " - list1\n"+
      " - list2\n"+
      " - list3\n"+
			"\n"+
      " - list4\n"+
      " - list5\n"+
      " - list6\n"
    );
  });
});
