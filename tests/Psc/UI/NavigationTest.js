define(['psc-tests-assert','Psc/UI/Navigation'], function(t) {
  
  
  module("Psc.UI.Navigation");
  
  var setup = function (test) {
    $('#qunit-fixture').html('<div class="psc-cms-ui-navigation-container"><fieldset class="psc-cms-ui-navigation"><legend>Navigation</legend><div class="content"><ul class="ui-widget"></ul></div></fieldset></div>');

    var uiController = {};
      
    var navigation = new Psc.UI.Navigation({
      languages: ['de', 'en'],
      uiController: uiController,
        widget: $('#qunit-fixture div.psc-cms-ui-navigation-container'),
        /* das hier lässt sich mit
          $em->getRepository('Entities\NavigationNode')->getTreeForUI()
          in Psc\CMS\Navigation\RepositoryTest erzeugen
          
          der Tree ist ca so:
            - autos
              - bmw
              - mercedes
            - lautsprecher
              - quadral
                - platinum
                - aurum
                  - vier
                  - titan MK VII
              -canton
        */
        //tree: [{"id":1,"title":"Autos","slug":"autos","lft":1,"rgt":6,"root":1,"depth":0,"created":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"updated":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"__children":[{"id":2,"title":"BMW","slug":"bmw","lft":2,"rgt":3,"root":1,"depth":1,"created":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"updated":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"__children":[]},{"id":3,"title":"Mercedes Benz","slug":"mercedes-benz","lft":4,"rgt":5,"root":1,"depth":1,"created":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"updated":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"__children":[]}]},{"id":4,"title":"Lautsprecher","slug":"lautsprecher","lft":1,"rgt":14,"root":4,"depth":0,"created":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"updated":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"__children":[{"id":5,"title":"Quadral","slug":"quadral","lft":2,"rgt":11,"root":4,"depth":1,"created":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"updated":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"__children":[{"id":6,"title":"Platinum","slug":"platinum","lft":3,"rgt":4,"root":4,"depth":2,"created":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"updated":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"__children":[]},{"id":7,"title":"Aurum","slug":"aurum","lft":5,"rgt":10,"root":4,"depth":2,"created":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"updated":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"__children":[{"id":8,"title":"Vier","slug":"vier","lft":6,"rgt":7,"root":4,"depth":3,"created":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"updated":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"__children":[]},{"id":9,"title":"Titan MK VII","slug":"titan-mk-vii","lft":8,"rgt":9,"root":4,"depth":3,"created":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"updated":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"__children":[]}]}]},{"id":10,"title":"Canton","slug":"canton","lft":12,"rgt":13,"root":4,"depth":1,"created":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"updated":{"date":"2012-04-25 13:49:16","timezone_type":3,"timezone":"Europe\/Berlin"},"__children":[]}]}],
        
        flat: [
  {
    "id":1,
    "title":{
      "de":"Autos",
      "en":"Cars"
    },
    "slug":{
      "de":"autos"
    },
    "depth":0,
    "pageId":1,
    locale:"de",
    "languages":['de','en']
  },
  {
    "id":2,
    "title":{
      "de":"BMW",
      "en":"en BMW"
    },
    "slug":{
      "de":"bmw"
    },
    "depth":1,
    "pageId":2,
    locale:"de",
    "languages":['de','en']
  },
  {
    "id":3,
    "title":{
      "de":"Mercedes Benz",
      "en":"en mercedes benz"
    },
    "slug":{
      "de":"mercedes-benz"
    },
    "depth":1,
    "pageId":null,
    locale:"de",
    "languages":['de','en']
  },
  {
    "id":4,
    "title":{
      "de":"Lautsprecher",
      "en":"Speakers"
    },
    "slug":{
      "de":"lautsprecher"
    },
    "depth":0,
    "pageId":null,
    locale:"de",
    "languages":['de','en']
    
  },
  {
    "id":5,
    "title":{
      "de":"Quadral",
      "en":"en quadral"
    },
    "slug":{
      "de":"quadral"
    },
    "depth":1,
    "pageId":null,
    locale:"de",
    "languages":['de','en']
  },
  {
    "id":6,
    "title":{
      "de":"Platinum",
      "en":"en platinum"
    },
    "slug":{
      "de":"platinum"
    },
    "depth":2,
    "pageId":null,
    locale:"de",
    "languages":['de','en']
  },
  {
    "id":7,
    "title":{
      "de":"Aurum",
      "en":"en aurum"
    },
    "slug":{
      "de":"aurum"
    },
    "depth":2,
    "pageId":null,
    locale:"de",
    "languages":['de','en']
  },
  {
    "id":8,
    "title":{
      "de":"Vier",
      "en":"four"
    },
    "slug":{
      "de":"vier"
    },
    "depth":3,
    "pageId":null,
    locale:"de",
    "languages":['de','en']
  },
  {
    "id":9,
    "title":{
      "de":"Titan MK VII",
      "en":"en Titan MK VII"
    },
    "slug":{
      "de":"titan-mk-vii"
    },
    "depth":3,
    "pageId":null,
    locale:"de",
    "languages":['de','en']
    
  },
  {
    "id":10,
    "title":{
      "de":"Canton",
      "en":"en Canton"
    },
    "slug":{
      "de":"canton"
    },
    "depth":1,
    "pageId":null,
    locale:"de",
    "languages":['de','en']
  }
]
    });
    
    return t.setup(test, {navigation: navigation});
  };

  test("serialize", function() {
    var that = setup(this), navigation = this.navigation;
    
    /**
     * reduziert den flat array zu einem Array nur mit den werten label und depth
     */
    var reduce = function(flat, attr) {
      var ret = [];
      $.each(flat, function (i, node) {
        ret.push({
          title: node.getTitle(),
          depth: node.getDepth(),
          id: node.getId(),
          parent: (node.getParent() ? node.getParent().getTitle() : null)
        });
      });
      return ret;
    };
    
    var data = {};
    var flat = navigation.serialize(data);
    

    this.assertEquals(10,flat.length, 'all items are included in flat');
    this.assertEquals(
      // expected
      [
        {
          title: 'Autos', 
          depth: 0,
          parent: null,
          id: 1
        },
        {
          title: 'BMW',
          depth: 1,
          parent: 'Autos',
          id: 2
        },
        {
          title: 'Mercedes Benz',
          depth: 1,
          parent: 'Autos',
          id: 3
        },
        {
          title: 'Lautsprecher',
          depth: 0,
          parent: null,
          id: 4
        },
        {
          title: 'Quadral',
          depth: 1,
          parent: 'Lautsprecher',
          id: 5
        },
        {
          title: 'Platinum',
          depth: 2,
          parent: 'Quadral',
          id: 6
        },
        {
          title: 'Aurum',
          depth: 2,
          parent: 'Quadral',
          id: 7
        },
        {
          title: 'Vier',
          depth: 3,
          parent: 'Aurum',
          id: 8
        },
        {
          title: 'Titan MK VII',
          depth: 3,
          parent: 'Aurum',
          id: 9
        },
        {
          title: 'Canton',
          depth: 1,
          parent: 'Lautsprecher',
          id: 10
        }
      ],
    
      // actual             
      reduce(flat),
      
      // message
      'serialize() equals expected flatted navigation array'
    );
    
    $.each(flat, function (i, node) {
      that.assertTrue(node.getGuid().length > 0);
    });
    //onsole.log(JSON.stringify(flat));
  });
  
  test("TODO: if a navigation point is added and edited, than added a new, the new one does not clone the title of the edited one", function() {
    var that = setup(this), navigation = this.navigation;
    that.assertTrue(true, 'test incomplete');
  });
});