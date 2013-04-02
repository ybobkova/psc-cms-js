define(['psc-tests-assert','Psc/TextParser'], function(t) {
  
  // aktueller test siehe sce:
  module("Psc.TextParser");
  
  var setup = function(test) {
    var textParser = new Psc.TextParser({ });
    
    var lines = [
      "sichergestellt, dass Nachhaltigkeit versprechende Lösungen aus der Region Leuchtturmwirkung erzielen und",
      "maghrebinischen Stödten ergönzt, so dass das Wissen und die Erfahrungen deutscher Kommunen,",
      "CoMun bietet för die Partner eine Kombination aus Dialog, Erfahrungsaustausch und technischer Beratung. Das Programm  arbeitet",
      "sowie verschiedenen deutschen Stödten, dem Marseille Center for Mediterranean Integration (CMI"
    ];
    
    var listPoints = [
      "Familienunternehmen mit mehr als 30 Jahren Erfahrung und Wissen",
      "Unternehmergeist durch und durch ö langfristige Fortföhrung des Unternehmens durch Söhne des Firmengrönders",
      "Mehr als 12 000 zufriedene Kunden weltweit",
      "Umfangreiche Innovationskraft und Erfindertum"
    ];
    
    var numberedListText =
      "1\tFamilienunternehmen mit mehr als 30 Jahren Erfahrung und Wissen \n"+
      "2\tUnternehmergeist durch und durch langfristige Fortföhrung des Unternehmens durch Söhne des Firmengrönders\n"+
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
        {value: "Mit dem Vorhaben CoMun fördert die:", type: "paragraph"},
        {value: ["list1", "list2"], type: "list"},
        {value: this.lines[2], type: "paragraph"}
      ],

      this.lines[0]+"\n\n"+
      this.lines[1]+"\n\n"+
      "Mit dem Vorhaben CoMun fördert die:\n"+
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

  test("test parser detects a simpler list", function () {
    setup (this);

    this.assertParsing([
        {value: ["point1", "point2"], type:"list"}
      ],
      "- point1\n"+
      "- point2"
    );
  });

  test("numbered list with tabs", function () {
    setup(this);

    var text = '';
    text += "Mehrwerte, die Sie überzeugen werden: \n";
    text += "\n";
    text += "1  Familienunternehmen mit mehr als 30 Jahren Erfahrung und Wissen \n";
    text += "2  Unternehmergeist durch und durch – langfristige Fortführung des Unternehmens durch Söhne des Firmengründers    \n";
    text += "3  Mehr als 12 000 zufriedene Kunden weltweit\n";
    text += "14  Umfangreiche Innovationskraft und Erfindertum      \n";

    this.assertParsing([
        {value: "Mehrwerte, die Sie überzeugen werden:", type:"paragraph"},
        {type: "list", value: [
          "Familienunternehmen mit mehr als 30 Jahren Erfahrung und Wissen",
          "Unternehmergeist durch und durch – langfristige Fortführung des Unternehmens durch Söhne des Firmengründers",
          "Mehr als 12 000 zufriedene Kunden weltweit",
          "Umfangreiche Innovationskraft und Erfindertum"
        ]}
      ],
     
      text
    );
  });

  test("bullet list tabbed", function () {
    setup(this);

    var text = '';
    text += "Mehrwerte, die Sie überzeugen werden: \n";
    text += "\n";
    text += "•  Familienunternehmen mit mehr als 30 Jahren Erfahrung und Wissen \n";
    text += "•  Unternehmergeist durch und durch – langfristige Fortführung des Unternehmens durch Söhne des Firmengründers    \n";
    text += "•  Mehr als 12 000 zufriedene Kunden weltweit\n";
    text += "•  Umfangreiche Innovationskraft und Erfindertum      \n";

    this.assertParsing([
        {value: "Mehrwerte, die Sie überzeugen werden:", type:"paragraph"},
        {type: "list", value: [
          "Familienunternehmen mit mehr als 30 Jahren Erfahrung und Wissen",
          "Unternehmergeist durch und durch – langfristige Fortführung des Unternehmens durch Söhne des Firmengründers",
          "Mehr als 12 000 zufriedene Kunden weltweit",
          "Umfangreiche Innovationskraft und Erfindertum"
        ]}
      ],
     
      text
    );
  });
});

