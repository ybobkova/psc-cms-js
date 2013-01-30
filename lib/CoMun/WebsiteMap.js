define(['joose', 'Psc/UI/Button', 'CoMun/City', 'CoMun/Curver', 'CoMun/Relation', 'Psc/Code', 'Psc/UI/Group', 'Psc/UI/WidgetWrapper', 'Psc/EventDispatching'], function(Joose) {
  /**
   * events:
   *   relation-active [relation]
   *
   */
  Joose.Class('CoMun.WebsiteMap', {
    isa: Psc.UI.WidgetWrapper,
    
    does: Psc.EventDispatching,
  
    has: {
      eventManager: { is : 'rw', required: false, isPrivate: true, handles: ['on','off'] },
      
      imgUrl: { is : 'rw', required: true, isPrivate: true },
      imgUrlBlank: { is : 'rw', required: true, isPrivate: true },
      img: { is : 'rw', required: false, isPrivate: true },
      editMode: { is : 'rw', required: false, isPrivate: true, init: false},
      
      cities: { is : 'rw', required: false, isPrivate: true },
      
      curver: { is : 'rw', required: false, isPrivate: true },
      
      // required im editMode = true
      controlWidget: { is : 'rw', required: false, isPrivate: true },
      
      // alle möglichen html elemente
      el: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
  
      // die gerade zu bearbeitende Relation
      activeRelation: { is : 'rw', required: false, isPrivate: true },
      relations: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object }, // index: [germanCity.id][otherCity.id]
      
      // info popups
      showTimers: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
      hideTimers: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object }
    },
    
    after: {
      initialize: function(props) {
        this.checkWidget();
        this.linkWidget();
  
        if (props.main) {
          props.main.getEventManager().triggerEvent('collapse-right'); // pli-pla-platz
        }
        
        // das zuerst damit
        this.initUI();
        
        // das darüber liegen kann
        this.$$curver = new CoMun.Curver({
          widget: this.unwrap(),
          map: this,
          editMode: this.$$editMode,
          eventManager: this.$$eventManager
        });
        
        this.$$eventManager.setLogging(true);
      }
    },
    
    methods: {
      initUI: function () {
        var that = this;
  
        //this.unwrap().append(
          //this.$$img = $('<img class="map" />').attr('src', this.$$imgUrlBlank)
        //);
        
        this.unwrap().find('.info-left, .info-bottom, .info-right').css('opacity', 0.8);
        
        if (this.$$editMode) {
          that.unwrap()
          .css('width','100%')
          .css('height',1200)
          .css('background-image', 'url('+this.$$imgUrlBlank+')')
          .css('background-repeat', 'no-repeat');
        } else {
          that.unwrap()
          .css('width','920px')
          .css('height','836px')
          .css('background-image', 'url('+this.$$imgUrlBlank+')')
          .css('background-repeat', 'no-repeat');
        }
        
        if (this.$$editMode) {
          this.unwrap().addClass('psc-cms-ui-serializable');
        
          // temporärer switchbutton für die platzierung:
          var switchButton = new Psc.UI.Button({label: 'toggle Städte'});
          this.unwrap().append(
            switchButton
              .create()
              .addClass('switch-map')
          );
          this.getSwitchButton().on('click', function (e) {
            var img = that.unwrap();
            e.preventDefault();
            if (img.css('background-image') === 'url('+that.getImgUrlBlank()+')') {
              img.css('background-image', 'url('+this.$$imgUrl+')');
            } else {
              img.css('background-image', 'url('+this.$$imgUrlBlank+')');
            }
          });
        }
        
        // städte
        this.initCities();
        
        if (this.$$editMode && this.$$controlWidget) {
          
          if (this.$$controlWidget.hasClass('psc-cms-ui-accordion')) {
            this.on('relation-active', function(e) {
              that.getControlWidget().accordion('activate', 1);
            });
          }
          
          this.initControlWidget();
        }
        
        this.initHandlers();
      },
      
      
      initHandlers: function () {
        var that = this;
        
        this.unwrap().on('mouseenter', 'area', function (e) {
          var position = $(this).attr('alt');
          that.showInfo(position);
        });
  
        this.unwrap().on('mouseleave', 'area', function (e) {
          var position = $(this).attr('alt');
          that.hideInfo(position);
        });
      },
      
      initCities: function() {
        var that = this;
        
        //var city = function(name, x, y, labelPosition) {
        //  return new CoMun.City({
        //    name: name,
        //    position: {
        //      x: x,
        //      y: y
        //    },
        //    labelPosition: labelPosition || 'r',
        //    widget: that.unwrap()
        //  });
        //};
        //
        var city;
        for(var i = 0, l = this.$$cities.length; i < l; i++) {
          city = this.$$cities[i];
          city.setWidget(this.unwrap());
          city.setGuid(i);
          city.setEditMode(this.$$editMode);
          city.draw();
          //city.disableDragging();
        }
      },
      
      initControlWidget: function() {
        var that = this,
            $control = this.$$controlWidget.find('.map-control'),
            $relationContainer = this.$$controlWidget.find('.map-relation');
          
        var selectContainers = {
          german: new Psc.UI.Group({label: 'Deutsche Städte'}),
          other: new Psc.UI.Group({label: 'Partner Städte'})
        };
        
        $control.append(selectContainers.german.html());
        $control.append(selectContainers.other.html());
        
        selectContainers.german.getContentTag().append(this.$$el['selects.german'] =  this.createCitySelect('german'));
        selectContainers.other.getContentTag().append(this.$$el['selects.other'] = this.createCitySelect('other'));
        
        var $editButton;
        $control.append($editButton = (new Psc.UI.Button({label: 'bearbeiten','leftIcon':'wrench'})).create());
        $editButton.on('click', function (e) {
          e.preventDefault();
          that.createAndChangeActiveRelation(
            that.getSelect('german').val(),
            that.getSelect('other').val()
          );
        });
      },
      getSelect: function(type) {
        return this.$$el['selects.'+type];
      },
  
      /**
       * Triggered, dass das Info-Popup angezeigt werden soll
       * 
       * @param position bottom|left|right
       */
      showInfo: function (position) {
        var $info = this.unwrap().find('.info-'+position), that = this;
        
        if (this.$$hideTimers[position]) {
          window.clearTimeout(this.$$hideTimers[position]);
          this.$$hideTimers[position] = undefined;
        }
        
        if (!this.$$showTimers[position]) {
          this.$$showTimers[position] = window.setTimeout(function () {
            $info.stop().show('fade', {}, 200);
            that.$$showTimers[position] = undefined;
          }, 200);
        }
      },
      hideInfo: function(position) {
        var $info = this.unwrap().find('.info-'+position), that = this;
        
        if (this.$$showTimer) {
          window.clearTimeout(this.$$showTimers[position]);
          this.$$showTimers[position] = undefined;
        }
        
        if (!this.$$hideTimers[position]) {
          this.$$hideTimers[position] = window.setTimeout(function () {
            $info.stop().hide('fade', {}, 200);
            that.$$hideTimers[position] = undefined;
          }, 1000);
        }
      },
      createAndChangeActiveRelation: function(id1, id2) {
        var germanCity = this.city(id1), otherCity = this.city(id2);
        
        var relation = this.relation(germanCity,otherCity);
        
        this.changeActiveRelation(relation);
      },
      
      changeActiveRelation: function (relation) {
        this.$$activeRelation = relation;
        
        this._trigger('relation-active', [relation]);
        
        
      },
      
      createCitySelect: function(type) {
        var $select = $('<select class="city-select"></select>');
        
        var city;
        for(var i = 0, l = this.$$cities.length; i < l; i++) {
          city = this.$$cities[i];
          
          if (city.getType() === type) {
            $select.append('<option value="'+city.getId()+'">'+city.getName()+'</option>');
          }
        }
        
        return $select;
      },
      
      city: function(id) {
        if (Psc.Code.isInstanceOf(id, CoMun.City)) {
          return id;
        }
        
        var city;
        
        for(var i = 0, l = this.$$cities.length; i < l; i++) {
          city = this.$$cities[i];
          if (city.getId() === id) {
            return city;
          }
        }
        
        return undefined;
      },
      
      relation: function(germanCity, otherCity) {
        var ownRelations, relation;
        if (this.$$relations[germanCity.getId()]) {
          ownRelations = this.$$relations[germanCity.getId()];
        } else {
          this.$$relations[germanCity.getId()] = ownRelations = {};
        }
        
        if (ownRelations[otherCity.getId()]) {
          return ownRelations[otherCity.getId()];
        }
        
        // geht das wohl so? setting by ref?
        ownRelations[otherCity.getId()] = relation = new CoMun.Relation({
          germanCity: germanCity,
          otherCity: otherCity,
          color: this.getRelationColor()
        });
        
        relation.draw(this.$$curver);
        
        return relation;
      },
      
      getRelationColor: function() {
        return "hsb(.8, .75, .75)";
      },
      
      serialize: function (data) {
        data.cities = [];
        
        var city;
        for(var i = 0, l = this.$$cities.length; i < l; i++) {
          city = this.$$cities[i];
          
          data.cities.push(city.serialize());
        }
        
        Psc.Code.debug('map serialized cities', data.cities);
        return data;
      },
      getSwitchButton: function () {
        return this.unwrap().find('button.switch-map');
      },
      
      _trigger: function (eventName, data) {
        return this.$$eventManager.triggerEvent(eventName, {map: this}, data);
      },
      
      toString: function() {
        return "[CoMun.WebsiteMap]";
      }
    }
  });
});