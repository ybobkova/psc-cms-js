define(['joose', 'jquery-ui', 'Psc/Date'], function(Joose) {
	Joose.Class('Psc.CalendarCalculation', {
		
		has: {
			/* settings */
			date: { is : 'rw', required: true, isPrivate: true },
			region: { is : 'rw', required: true, isPrivate: true },
			
			/* infos */
			firstDay: { is : 'rw', required: false, isPrivate: false },
			lastDay: { is : 'rw', required: false, isPrivate: false },
			
			/**
			 * .top
			 * .height
			 * .isLast
			 * .bottom
			 *
			 * .days[
			 *  
			 * ]
			 */
			monthRows: { is : 'rw', required: false, isPrivate: false },
			monthNames: { is : 'rw', required: false, isPrivate: false },
			// [year][month[day] = {row: 0-based , column: 0-based }
			cellIndex: { is : 'rw', required: false, isPrivate: false },
			lastCellPosition: { is : 'rw', required: false, isPrivate: false },
			
			/**
			 * .dow (num 1-based)
			 * .isWeekend
			 * .shortName (3 literals)
			 * .minName (2 literals)
			 * [.date, .name] ?
			 */
			weekDays: { is : 'rw', required: false, isPrivate: false }
		},
		
		after: {
			initialize: function () {
				this.refresh();
			}
		},
		
		methods: {
			/**
			 * recalculates all Settings for the whole object
			 */
			refresh: function () {
				this.monthNames = $.datepicker.regional[this.$$region].monthNames;
				
				var weekDays = $.datepicker.regional[this.$$region].dayNamesShort,
						weekDaysMin = $.datepicker.regional[this.$$region].dayNamesMin,
						regionFirstWeekDay = $.datepicker.regional[this.$$region].firstDay,
						rdow; // region dow
				
				
				this.weekDays = [];
				for (var dow = 0; dow < 7; dow++) { 
					rdow = (dow + regionFirstWeekDay) % 7; // day of the week => region day of the week
					this.weekDays.push({
						dow: rdow,
						shortName: weekDays[rdow],
						minName: weekDaysMin[rdow],
						isWeekend: (dow + regionFirstWeekDay + 6) % 7 >= 5
					});
				}
				
				var days, monthRow, d, daysFromPrevMonth, startDay, weekDate, firstDayOfMonth, position;
				this.monthRows = [];
				this.cellIndex = {};
				for (var m = 0; m < 5; m++) {
					monthRow = {
						//startDate: new Psc.Date()
						//endDate: new Psc.Date()
						days: [],
						top: (m*20)+'%',
						height: '21%',
						
						isLast: (m === 4),
						bottom: '0'
					};
	
					
					// the days shown from the month before
					if (m === 0) {
						firstDayOfMonth = this.$$date.getFirstDayOfMonth();
						daysFromPrevMonth = (firstDayOfMonth.getDow() - regionFirstWeekDay + this.weekDays.length) % this.weekDays.length;
						weekDate = firstDayOfMonth.add({days:-(daysFromPrevMonth+1)});
					}
					//console.log(startDate.toString());
					//endDate = startDate.add({days: this.weekDays.length});
					
					/* calculate the days in this (week)row of the month*/
					monthRow.startDate = weekDate;
					for (d = 0; d < this.weekDays.length; d++) {
						weekDate = weekDate.add({days:1});
						monthRow.days.push(weekDate);
						position = this._storeCellIndex(weekDate, m, d);
					}
					monthRow.endDate = weekDate;
					if (m === 4) {
						this.lastCellPosition = position;
					}
					
					this.monthRows.push(monthRow);
				}
			},
			_storeCellIndex: function (date, row, column) {
				var position = {row: row, column: column, date: date};
				
				if (!this.cellIndex[date.getYear()]) {
					this.cellIndex[date.getYear()] = {};
				}
	
				if (!this.cellIndex[date.getYear()][date.getMonth()]) {
					this.cellIndex[date.getYear()][date.getMonth()] = {};
				}
	
				this.cellIndex[date.getYear()][date.getMonth()][date.getDay()] = position;
				return position;
			},
			
			/*
			 * Achtung: dies geht nur für das aktuelle Kalenderblatt
			 */
			getCellPosition: function (date) {
				if (this.cellIndex[date.getYear] && this.cellIndex[date.getYear()][date.getMonth()]) {
					return this.cellIndex[date.getYear()][date.getMonth()][date.getDay()];
				}
			},
			canBeDisplayed: function(date) {
				return this.getCellPosition(date) !== undefined; // cellIndex hat netterweise auch alle tage der anderen Monate
			},
			
			setDate: function (date) {
				this.$$date = date;
				this.refresh();
			},
			
			toString: function() {
				return "[Psc.CalendarCalculation]";
			}
		}
	});
});