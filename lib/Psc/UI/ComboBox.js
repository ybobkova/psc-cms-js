define(['Psc/EventManager','Psc/UI/EffectsManager','Psc/AjaxHandler','Psc/Code', 'Psc/UI/WidgetWrapper'], function() {
	/**
	 *
	 * Events:
	 *  combo-box-select({comboBox:}, [item]);   // ein item wurde gerade ausgewählt, comboBox.getSelected() ist noch nicht korrekt gesetzt (preventDefault() verhindert dass das item mit setSelected() gesetzt wird)
	 *  combo-box-selected({comboBox:}, [item]); // ein item wurde ausgewählt, comboBox.getSelected() ist korrekt gesetzt
	 *
	 * im Moment ist noch etwas dirty, dass das übergebene AutoComplete die minLength auf 0 gesetzt bekommt. Das liegt daran, damit wir beim klick auf den Pfeil immer das Menü öffnen können.
	 * @TODO schöner wäre hier einen roten Blink zu machen und ein hint-popup: "geben sie mindestens x buchstaben ein, die scheise ist sehr groß"
	 * @TODO sync disabled und options
	 */
	Joose.Class('Psc.UI.ComboBox', {
		isa: Psc.UI.WidgetWrapper,
	
		has: {
			initialText: { is : 'rw', required: false, isPrivate: true },
			initial: { is: 'rw', required: false, isPrivate: true, init: true },
			//eventManager: { is : 'rw', required: false, isPrivate: true },
			//effectsManager: { is : 'rw', required: false, isPrivate: true },
			autoComplete: { is: 'rw', required: true, isPrivate: true },
			disabled: { is: 'rw', required: false, isPrivate: true, init: false },
			button: { is: 'rw', required: false, isPrivate: true },
			
			/**
			 * Der Name für das serializieren der Value
			 */
			name: {is: 'rw', required: true, isPrivate: true}, 
			
			/**
			 * Das aktuell ausgewählte Item
			 */
			selected: { is: 'rw', required: false, isPrivate: true },
			
			/**
			 * Im Select-Mode wird beim auswählen eines Items das Label dessen in der Combo-Box angezeigt
			 */
			selectMode: { is: 'rw', required: false, isPrivate: true, init: false }
		},
		
		after: {
			initialize: function(props) {
				//if (!props.effectsManager) {
				//  this.$$effectsManager = new Psc.UI.EffectsManager();
				//}
				this.initAutoComplete();
				
				this.checkWidget();
				this.linkWidget(); // damit serialize im formular geht, siehe regression1 test
				this.initWidget();
				
				this.initButton();
				
				if (props.selected) {
					this.setInitial(false);
					this.setSelected(props.selected);
				}
			}
		},
	
		methods: {
			/**
			 * Initialisiert das AutoComplete Widget
			 */
			initAutoComplete: function() {
				var that = this;
				var evm = this.getEventManager();
				
				evm.on('auto-complete-select', function (e, item) {
					e.preventDefault();
					// nicht stopImmediate damit wir in tests auf das event noch zeug machen können
					
					var event = evm.createEvent('combo-box-select', {comboBox: that});
					evm.trigger(event, [item]);
					
					// set selected
					if (!event.isDefaultPrevented()) {
						that.setSelected(item);
						
						evm.triggerEvent('combo-box-selected', {comboBox: that}, [item]);
					}
				});
				
				this.$$autoComplete.setMinLength(0);
			},
			initWidget: function() {
				var $input = this.unwrap();
				var that = this;
				
				$input
					.val(this.$$initialText || $input.val())
					.focus(function (e) {
						if (that.isDisabled()) {
							e.preventDefault();
							$input.blur();
							return false;
						}
						
						if (that.getInitial()) {
							that.setInitial(false);
						}
						
						return true;
					})
			.addClass("ui-state-disabled ui-widget ui-widget-content ui-corner-left");
			},
			/**
			 * Der Button der das Menü öffnet + schließen kann
			 */
			initButton: function () {
				var that = this;
				var button = this.$$buton;
				var input = this.unwrap();
				var autoComplete = this.$$autoComplete;
				
				button = $("<button type='button'>&nbsp;</button>")
					.attr("tabIndex", -1)
					.attr("title", "Suchergebnisse anzeigen")
					.insertAfter(input)
					.button({
						icons: {
							primary: "ui-icon-triangle-1-s"
						},
						text: false,
						disabled: that.isDisabled() // inherit disable status, don't forget to sync
					})
					.removeClass("ui-corner-all")
					.addClass("ui-corner-right ui-button-icon")
					.click(function(e) {
						// nichts tun, falls schon ausgeklappt (wir verlassen uns aufs blur verlassen vom input?)
						if (autoComplete.isOpen()) {
							e.preventDefault();
							return;
						}
						
						// zwar passier das hier auch in input.focus() aber, wennn wir das hier nicht haben, kommt der initialtext manchmal wieder
						if (that.getInitial()) {
							that.setInitial(false);
						}
	
						// work around a bug (likely same cause as #5265)
						button.blur();
						
						autoComplete.open();
						input.focus();
					});
			},
			enable: function() {
				this.$$button.button('enable');
				this.unwrap().autocomplete('enable');
				this.$$disabled = false;
				return this;
			},
			disable: function() {
				this.$$button.button('disable');
				this.unwrap().autocomplete('disable');
				this.$$disabled = true;
				return this;
			},
			getEventManager: function() {
				return this.getAutoComplete().getEventManager();
			},    
			isDisabled: function () {
				return this.$$disabled;
			},
			toString: function() {
				return "[Psc.UI.ComboBox]";    
			},
			setSelected: function (item) {
				this.$$selected = item;
				
				if (this.getSelectMode()) {
					this.unwrap().val(item.label);
				}
				
				return this;
			},
			setInitial: function (mode) {
				this.$$initial = !!mode;
				if (this.$$initial === false) {
					if (!this.getSelected()) { // remove initial text
						this.unwrap().val('');
					}
					
					this.unwrap().removeClass('ui-state-disabled');
				}
			},
			serialize: function(data) {
				if (this.getSelectMode() === true) {
					if (this.getSelected()) {
						data[this.$$name] = this.getSelected().value;
					} else {
						data[this.$$name] = '';
					}
				}
				
				return data;
			}
		}
	});
});