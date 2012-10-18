Joose.Class('tiptoi.Program', {
  //isa: 'Psc.UI.WidgetWrapper',
  
  has: {
    code: { is : 'rw', required: true, isPrivate: true },
    tables: { is: 'rw', required: false, isPrivate: true, init: Joose.I.Object },
    //options: { is: 'rw', required: false, isPrivate: true, init: Joose.I.Object },
    sounds: { is: 'rw', required: false, isPrivate: true, init: Joose.I.Object },
    name: { is: 'rw', required: false, isPrivate: true }
  },
  
  //after: {
  //  initialize: function (props) {
  //    if (props.soundList) {
  //      this.setSoundList(props.soundList);
  //    }
  //    
  //  }
  //},
  
  methods: {
    setTable: function(name, table) {
      this.$$tables[name] = table;
      return this;
    },
    
    //new tiptoi.Sound({number: '2-STA_0596', content: 'Die Universität'})
    setSound: function(name, sound) {
      this.$$sounds[name] = sound;
      return this;
    },
    
    //[ new tiptoi.Sound(...), new tiptoi.Sound(...) ]
    setSounds: function (name, sounds) {
      this.$$sounds[name] = sounds;
      return this;
    },
    
    /**
     *
     *[
     *  ['Game-Button-Sound', '091104ak009'],
     *  ['0,3 sec. Silent-Pause', '091104ak000'],
     *  ['Jetzt spielen wir ein Suchspiel.','2-STA_0618']
     *]
     */
    setSoundsList: function (name, array) {
      return this.setSounds(name, tiptoi.Sound.list(array));
    }
  }
});