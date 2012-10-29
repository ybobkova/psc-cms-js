define(['jquery', 'Psc/UI/Tabs', 'Psc/UI/Main'], function ($) {
	var baseAssertions = {
		
		formatMessage: function(message, result) {
			if (message) {
				if (result) {
					return "asserted that "+String(message);
				} else {
					return "failed asserting that "+String(message);
				}
			}
			return null;
		},
		
		debug: function(item) {
			return QUnit.jsDump.parse(item);
		},
		
		/**
		 * Sicherstellen, dass "Exception" vor dieser Funktion geladen wurde (asyncTest?)
		 */
		assertException: function(expectedException, block, expectedMessage, debugMessage, assertions) {
			var assert = function assertException(e) {
				var isException = e instanceof Psc.Exception;
				
				//assertTrue(isException, this.formatMessage("e ist eine (sub-)instanz von Exception", isException));
				QUnit.push( isException, isException, true, baseAssertions.formatMessage(baseAssertions.debug(e)+" is instanceof Psc.Exception", isException) );
			
				if (isException) {
					baseAssertions.assertEquals(expectedException, e.getName(), "Name ist '"+expectedException+"'");
			
					if (expectedMessage) {
						QUnit.equal(e.getMessage(), expectedMessage, "Message ist '"+expectedMessage+"'");
					}
				
					if (assertions) {
						assertions(e);
					}
					
					return true;
				}
				
				return false;
			};
			
			return raises(block, assert, debugMessage);
			
			ok(false, "Es wurde eine Exception "+expectedException+" erwartet. Aber keine gecatched");
		},
		
		assertEquals: function(expected, actual, message) {
			var result = QUnit.equiv(actual, expected);
			QUnit.push( result, actual, expected, this.formatMessage(message || "two values are equal", result));
		},
	
		assertSame: function(expected, actual, message) {
			var result = (actual === expected);
			QUnit.push( result, actual, expected, this.formatMessage(message || "objects reference the same instance", result));
		},
		
		assertContains: function(expected, actual, message) {
			var result = actual.search(expected) > 0;
			QUnit.push( result, actual, expected, this.formatMessage(message) || "string/object contains "+this.debug(expected), result);
		},
	
		assertNotSame: function(expected, actual, message) {
			var result = actual !== expected;
			QUnit.push( result, actual, expected, this.formatMessage(message || "objects reference not the same instance", result));
		},
		
		assertTrue: function(actual, message) {
			var result = actual === true;
			QUnit.push( result, actual, true, this.formatMessage(message || this.debug(actual)+" is true ", result) );
		},
	
		assertFalse: function(actual, message) {
			var result = actual === false;
			QUnit.push( result, actual, false, this.formatMessage(message || this.debug(actual)+" is false ", result) );
		},
	
		assertNotFalse: function(actual, message) {
			var result = actual !== false;
			QUnit.push( result, actual, 'something not false', this.formatMessage(message || this.debug(actual)+" is not false ", result) );
		},
	
		assertNotUndefined: function(actual, message) {
			var result = actual !== undefined;
			QUnit.push( result, actual, 'something not undefined', this.formatMessage(message || this.debug(actual)+" is not undefined ", result) );
		},
		
		assertAttributeEquals: function(expected, actualAttribute, actualObject, message) {
			var actual;
			var result = actualObject[actualAttribute] && QUnit.equiv(expected, actual = actualObject[actualAttribute]);
			QUnit.push( result, actual, expected, this.formatMessage(message || this.debug(actualObject)+"["+actualAttribute+"] equals value ", result) );
		},
	
		assertAttributeNotUndefined: function(actualAttribute, actualObject, message) {
			var actual = actualObject[actualAttribute];
			var result = actual !== undefined;
			QUnit.push( result, actual, "something not undefined", this.formatMessage(message || this.debug(actualObject)+"["+actualAttribute+"] equals value ", result) );
		},
	
		fail: function(message) {
			//QUnit.push( false, message , sourceFromStacktrace(2));
			QUnit.pushFailure( "failed: "+message );
		},
		
		assertType: function(expectedType, actual, message) {
			var result;
			if (expectedType === 'array') {
				result = Object.prototype.toString.apply(actual) === '[object Array]';
			} else {
				result = expectedType === typeof actual;
			}

			return QUnit.push( result, typeof actual, expectedType, this.formatMessage(message || this.debug(actual)+" is typeof "+expectedType+".", result) );
		},
		
		assertEmptyObject: function(actual, message) {
			var result = Joose.O.isEmpty(actual);
			return QUnit.push( result, true, true, this.formatMessage(message || this.debug(actual)+" is an empty object.", result) );
		},
		
		// expected muss der Constructor sein, kein String!
		assertInstanceOf: function(expected, actual, message) {
			if (!Joose.O.isClass(expected)) {
				fail(this.debug(expected)+" is NOT a valid Class. Is this a Constructor-Function?");
				return;
			}
			if (!Joose.O.isInstance(actual)) {
				fail(this.debug(actual)+" is not an object-instance");
				return;
			}
			
			var result = actual instanceof expected;
			// hier ist das diff überflüssig
			
			return QUnit.push(result, "Instance of Class "+String(actual.meta.name), "Instance of Class "+String(expected), this.formatMessage(message || String(actual)+" is instanceof '"+String(expected)+"'", result));
		},
			
	
		// expected muss der Constructor sein, kein String!
		assertDoesRole: function(expectedRole, actual, message) {
			if (!Joose.O.isClass(expectedRole)) {
				fail(this.debug(expected)+" is NOT a valid Class. Is this a Constructor-Function for a Role?");
			}
			if (!Joose.O.isInstance(actual)) {
				fail(this.debug(actual)+" is not an object-instance");
			}
			
			var result = Psc.Code.isRole(actual, expectedRole);
			
			var roles = actual.meta.getRoles();
	
			return QUnit.push(result, "Instance of Class "+String(actual.meta.name)+" Roles: "+roles, "Role "+String(expectedRole), this.formatMessage(message || String(actual)+" does '"+String(expectedRole)+"'", result));
		}
  }; // var baseAssertions

	var helpers = {
		visibleFixture: function (html) {
			var $html = $(html);
			
			$('#visible-fixture').empty().append($html);
			
			return $html;
		},
		setup: function(test, testSetups) {
			
			$.extend(test, {$widget: $('#visible-fixture')}, baseAssertions, testSetups || {});
			
			return test;
		}
	};
  

	// $.extend({}, baseAssertions, helpers);  
  return helpers;
});