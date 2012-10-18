Joose.Class('CoMun.Curver', {
  isa: 'Psc.UI.WidgetWrapper',
  
  does: 'Psc.EventDispatching',
  
  use: ['CoMun.City'],
  
  has: {
    raphael: { is : 'rw', required: false, isPrivate: true },
    map: { is : 'rw', required: false, isPrivate: true },
    editMode: { is : 'rw', required: false, isPrivate: true, init:false }
  },
  
  after: {
    initialize: function() {
    }
  },
  
  methods: {
    initUI: function () {
      var $widget = this.unwrap();
      var r = this.$$raphael = Raphael($widget.get(0), '100%', '100%');
      
      //this.curve(70, 100, 110, 100, 130, 200, 170, 200, "hsb(0, .75, .75)");
      //this.curve(170, 100, 210, 100, 230, 200, 270, 200, "hsb(.8, .75, .75)");
      //this.curve(270, 100, 310, 100, 330, 200, 370, 200, "hsb(.3, .75, .75)");
      //this.curve(370, 100, 410, 100, 430, 200, 470, 200, "hsb(.6, .75, .75)");
      //this.curve(470, 100, 510, 100, 530, 200, 570, 200, "hsb(.1, .75, .75)");
      this.connect(34, 19, "hsb(.8, .75, .75)");
      this.connect(34, 16, "hsb(.8, .75, .75)");
      this.connect(25, 8, "hsb(.3, .75, .75)");
      this.connect(32, 9, "hsb(.6, .75, .75)");
      this.connect(32, 12, "hsb(.11, .75, .75)");
    },
    
    connect: function(germanCity, otherCity, color) {
      var city1 = this.$$map.city(germanCity);
      var city2 = this.$$map.city(otherCity);
      
      city1.refresh();
      city2.refresh();
      
      var c1x = city1.getPosition().left+4, c1y = city1.getPosition().top+4;
      var c2x = city2.getPosition().left+4, c2y = city2.getPosition().top+4;
      
      this.curve(c1x, c1y, c1x+60, c1y,
                 c2x-60, c2y, c2x, c2y, color);
    },
    
    
    // xy ecke oben links (punkt A)
    // ax ay der controll neben der ecke oben links
    // bx by der controlle unten links 
    // zx zy der controller unten rechts (punkt B)
    curve: function(x, y, ax, ay, bx, by, zx, zy, color) {
      var r = this.$$raphael, discattr = {fill: "#777", stroke: "none"}, size=6;
      
      var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy]],
          path2 = [["M", x, y], ["L", ax, ay], ["M", bx, by], ["L", zx, zy]],
          curve = r.path(path).attr({stroke: color || Raphael.getColor(), "stroke-width": 4, "stroke-linecap": "round"});
      
      if (this.$$editMode) {
        controls = r.set(
            r.path(path2).attr({stroke: "#000", "stroke-dasharray": ". "}), // das ist die linie für die controls
            r.circle(x, y, size).attr(discattr),
            r.circle(ax, ay, size).attr(discattr),
            r.circle(bx, by, size).attr(discattr),
            r.circle(zx, zy, size).attr(discattr)
          );
          
        controls[1].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[0][1] = X;
            path[0][2] = Y;
            path2[0][1] = X;
            path2[0][2] = Y;
            controls[2].update(x, y);
        };
        
        controls[2].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[1][1] = X;
            path[1][2] = Y;
            path2[1][1] = X;
            path2[1][2] = Y;
            curve.attr({path: path});
            controls[0].attr({path: path2});
        };
        
        controls[3].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[1][3] = X;
            path[1][4] = Y;
            path2[2][1] = X;
            path2[2][2] = Y;
            curve.attr({path: path});
            controls[0].attr({path: path2});
        };
        
        controls[4].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[1][5] = X;
            path[1][6] = Y;
            path2[3][1] = X;
            path2[3][2] = Y;
            controls[3].update(x, y);
        };
        
        controls.drag(this.move, this.up);
      }
    },
    
    move: function(dx, dy) {
      this.update(dx - (this.dx || 0), dy - (this.dy || 0));
      this.dx = dx;
      this.dy = dy;
    },
    
    up: function() {
      this.dx = this.dy = 0;
    },
    
    toString: function() {
      return "[CoMun.Curver]";
    }
  }
});