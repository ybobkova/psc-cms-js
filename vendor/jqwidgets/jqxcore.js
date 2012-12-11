/*
jQWidgets v2.5.5 (2012-Nov-28)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {
    $.jqx = $.jqx || {}

    $.jqx.define = function (namespace, classname, baseclass) {
        namespace[classname] = function () {
            if (this.baseType) {
                this.base = new namespace[this.baseType]();
                this.base.defineInstance();
            }
            this.defineInstance();
        }

        namespace[classname].prototype.defineInstance = function () { };
        namespace[classname].prototype.base = null;
        namespace[classname].prototype.baseType = undefined;

        if (baseclass && namespace[baseclass])
            namespace[classname].prototype.baseType = baseclass;
    }

    // method call
    $.jqx.invoke = function (object, args) {
        if (args.length == 0)
            return;

        var method = typeof (args) == Array || args.length > 0 ? args[0] : args;
        var methodArg = typeof (args) == Array || args.length > 1 ? Array.prototype.slice.call(args, 1) : $({}).toArray();

        while (object[method] == undefined && object.base != null)
            object = object.base;

        if (object[method] != undefined && $.isFunction(object[method]))
            return object[method].apply(object, methodArg);

        if (typeof method == 'string') {
            var methodLowerCase = method.toLowerCase();
            return object[methodLowerCase].apply(object, methodArg);
        }

        return;
    }

    $.jqx.hasFunction = function (object, args) {
        if (args.length == 0)
            return false;

        if (object == undefined)
            return false;

        var method = typeof (args) == Array || args.length > 0 ? args[0] : args;
        var methodArg = typeof (args) == Array || args.length > 1 ? Array.prototype.slice.call(args, 1) : {};

        while (object[method] == undefined && object.base != null)
            object = object.base;

        if (object[method] && $.isFunction(object[method]))
            return true;

        if (typeof method == 'string') {
            var methodLowerCase = method.toLowerCase();
            if (object[methodLowerCase] && $.isFunction(object[methodLowerCase]))
                return true;
        }

        return false;
    }

    $.jqx.isPropertySetter = function (args) {
        if (args.length == 2)
            return true;

        return args.length == 1 && typeof (args[0]) == 'object';
    }

    $.jqx.set = function (object, args) {
        if (args.length == 1 && typeof (args[0]) == 'object') {
            $.each(args[0], function (key, value) {
                var obj = object;
                while (obj[key] == undefined && obj.base != null)
                    obj = obj.base;

                if (obj[key] != undefined || obj[key] == null) {
                    $.jqx.setvalueraiseevent(obj, key, value);
                }
            });
        }
        else if (args.length == 2) {
            while (object[args[0]] == undefined && object.base)
                object = object.base;

            if (object[args[0]] != undefined || object[args[0]] == null)
                $.jqx.setvalueraiseevent(object, args[0], args[1]);
        }
    }

    $.jqx.setvalueraiseevent = function (object, key, value) {
        var oldVal = object[key];

        object[key] = value;

        if (!object.isInitialized)
            return;

        if (object.propertyChangedHandler != undefined)
            object.propertyChangedHandler(object, key, oldVal, value);

        if (object.propertyChangeMap != undefined && object.propertyChangeMap[key] != undefined)
            object.propertyChangeMap[key](object, key, oldVal, value);
    };

    $.jqx.get = function (object, args) {
        if (args == undefined || args == null)
            return undefined;

        if (object[args] != undefined)
            return object[args];

        if (args.length != 1)
            return undefined;

        while (object[args[0]] == undefined && object.base)
            object = object.base;

        if (object[args[0]] != undefined)
            return object[args[0]];
    }

    $.jqx.jqxWidgetProxy = function (controlName, element, args) {
        var host = $(element);
        var vars = $.data(element, controlName);
        if (vars == undefined) {
            return undefined;
        }

        var obj = vars.instance;

        if ($.jqx.hasFunction(obj, args))
            return $.jqx.invoke(obj, args);

        if ($.jqx.isPropertySetter(args)) {
            $.jqx.set(obj, args);
            return undefined;

        } else {
            if (typeof (args) == 'object' && args.length == 0)
                return;
            else if (typeof (args) == 'object' && args.length > 0)
                return $.jqx.get(obj, args[0]);
            else if (typeof (args) == 'string')
                return $.jqx.get(obj, args);
        }

        throw "jqxCore: Property or method does not exist.";
        return undefined;
    }

    $.jqx.jqxWidget = function (name, base, params) {
        var WinJS = false;
        try {
            jqxArgs = Array.prototype.slice.call(params, 0);
        }
        catch (e) {
            jqxArgs = '';
        }

        try
        {
            WinJS = window.MSApp != undefined;
        }
        catch (e) {
        }

        var controlName = name;
          
        var baseControl = '';
        if (base)
            baseControl = '_' + base;
        $.jqx.define($.jqx, '_' + controlName, baseControl);

        $.fn[controlName] = function () {
            var args = Array.prototype.slice.call(arguments, 0);
            var returnVal = null;

            if (args.length == 0 || (args.length == 1 && typeof (args[0]) == 'object')) {
                return this.each(function () {
                    var host = $(this);
                    var element = this; // element == this == host[0]
                    var vars = $.data(element, controlName);
                    if (vars == null) {
                        vars = {};
                        vars.element = element;
                        vars.host = host;
                        vars.instance = new $.jqx['_' + controlName]();
                        if (element.id == "") {
                            element.id = $.jqx.utilities.createId();
                        }
                        vars.instance.get = vars.instance.set = vars.instance.call = function () {
                            var args = Array.prototype.slice.call(arguments, 0);
                            return $.jqx.jqxWidgetProxy(controlName, element, args);
                        }

                        $.data(element, controlName, vars);
                        $.data(element, 'jqxWidget', vars.instance);

                        var inits = new Array();
                        var instance = vars.instance;
                        while (instance) {
                            instance.isInitialized = false;
                            inits.push(instance);
                            //instance.theme = '';
                            instance = instance.base;
                        }
                        inits.reverse();
                        inits[0].theme = '';

                        $.jqx.jqxWidgetProxy(controlName, this, args);

                        for (var i in inits) {
                            instance = inits[i];
                            if (i == 0) {
                                instance.host = host;
                                instance.element = element;
                                instance.WinJS = WinJS;
                            }
                            if (instance != undefined) {
                                if (instance.createInstance != null) {
                                    if (WinJS) {
                                        MSApp.execUnsafeLocalFunction(function () {
                                            instance.createInstance(args);
                                        });
                                    }
                                    else {
                                        instance.createInstance(args);
                                    }
                                }
                            }
                        }

                        for (var i in inits) {
                            if (inits[i] != undefined) {
                                inits[i].isInitialized = true;
                            } 
                        }

                        if (WinJS) {
                            MSApp.execUnsafeLocalFunction(function () {
                                vars.instance.refresh(true);
                            });
                        }
                        else {
                            vars.instance.refresh(true);
                        }

                        returnVal = this;
                    }
                    else {
                        $.jqx.jqxWidgetProxy(controlName, this, args);
                    }
                }); // each
            }
            else {
                this.each(function () {
                    var result = $.jqx.jqxWidgetProxy(controlName, this, args);

                    if (returnVal == null)
                        returnVal = result;
                }); // each
            }

            return returnVal;
        }

        try {
            $.extend($.jqx['_' + controlName].prototype, Array.prototype.slice.call(params, 0)[0]);
        }
        catch (e) {
        }

        $.extend($.jqx['_' + controlName].prototype, {
            toThemeProperty: function (propertyName, override) {
                if (this.theme == '')
                    return propertyName;

                if (override != null && override) {
                    return propertyName + '-' + this.theme;
                }

                return propertyName + ' ' + propertyName + '-' + this.theme;
            }
        });

        $.jqx['_' + controlName].prototype.refresh = function () {
            if (this.base)
                this.base.refresh();
        }
        $.jqx['_' + controlName].prototype.createInstance = function () {
        }
        $.jqx['_' + controlName].prototype.propertyChangeMap = {};

        $.jqx['_' + controlName].prototype.addHandler = function (source, event, func, data) {
            switch (event) {
                case 'mousewheel':
                    if (window.addEventListener) {
                        if ($.browser.mozilla) {
                            source[0].addEventListener('DOMMouseScroll', func, false);
                        }
                        else {
                            source[0].addEventListener('mousewheel', func, false);
                        }
                        return false;
                    }
                    break;
                case 'mousemove':
                    if (window.addEventListener && !data) {
                        source[0].addEventListener('mousemove', func, false);
                        return false;
                    }
                    break;
            }

            if (data == undefined || data == null) {
                source.bind(event, func);
            }
            else {
                source.bind(event, data, func);
            }
        };

        $.jqx['_' + controlName].prototype.removeHandler = function (source, event, func) {
            switch (event) {
                case 'mousewheel':
                    if (window.removeEventListener) {
                        if ($.browser.mozilla) {
                            source[0].removeEventListener('DOMMouseScroll', func, false);
                        }
                        else {
                            source[0].removeEventListener('mousewheel', func, false);
                        }
                        return false;
                    }
                    break;
                case 'mousemove':
                    if ($.browser.msie && $.browser.version >= 9) {
                        if (window.removeEventListener) {
                            source[0].removeEventListener('mousemove', func, false);
                        }
                    }
                    break;
            }

            if (event == undefined) {
                source.unbind();
                return;
            }

            if (func == undefined) {
                source.unbind(event);
            }
            else source.unbind(event, func);
        };
    } // jqxWidget

    // jqxUtilities
    $.jqx.utilities = $.jqx.utilities || {};
    $.extend($.jqx.utilities,
    {
        createId: function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return "jqxWidget" + S4() + S4() + S4();
        },

        setTheme: function (oldTheme, theme, element) {
            if (typeof element === 'undefined') {
                return;
            }
            var classNames = element[0].className.split(' '),
                oldClasses = [], newClasses = [],
                children = element.children();
            for (var i = 0; i < classNames.length; i += 1) {
                if (classNames[i].indexOf(oldTheme) >= 0) {
                    if (oldTheme.length > 0) {
                        oldClasses.push(classNames[i]);
                        newClasses.push(classNames[i].replace(oldTheme, theme));
                    }
                    else {
                        newClasses.push(classNames[i] + '-' + theme);
                    }
                }
            }
            this._removeOldClasses(oldClasses, element);
            this._addNewClasses(newClasses, element);
            for (var i = 0; i < children.length; i += 1) {
                this.setTheme(oldTheme, theme, $(children[i]));
            }
        },

        _removeOldClasses: function (classes, element) {
            for (var i = 0; i < classes.length; i += 1) {
                element.removeClass(classes[i]);
            }
        },

        _addNewClasses: function (classes, element) {
            for (var i = 0; i < classes.length; i += 1) {
                element.addClass(classes[i]);
            }
        },

        getOffset: function(el)
        {
            var left = $.jqx.mobile.getLeftPos(el[0]);
            var top = $.jqx.mobile.getTopPos(el[0]);
            return { top: top, left: left };
        },

        hasTransform: function (el) {
            var transform = "";
            transform = el.css('transform');

            if (transform == "" || transform == 'none') {
                transform = el.parents().css('transform');
                if (transform == "" || transform == 'none') {
                    var browserInfo = $.jqx.utilities.getBrowser();
                    if (browserInfo.browser == 'msie') {
                        transform = el.css('-ms-transform');
                        if (transform == "" || transform == 'none') {
                            transform = el.parents().css('-ms-transform');
                        }
                    }
                    else if (browserInfo.browser == 'chrome') {
                        transform = el.css('-webkit-transform');
                        if (transform == "" || transform == 'none') {
                            transform = el.parents().css('-webkit-transform');
                        }
                    }
                    else if (browserInfo.browser == 'opera') {
                        transform = el.css('-o-transform');
                        if (transform == "" || transform == 'none') {
                            transform = el.parents().css('-o-transform');
                        }
                    }
                    else if (browserInfo.browser == 'mozilla') {
                        transform = el.css('-moz-transform');
                        if (transform == "" || transform == 'none') {
                            transform = el.parents().css('-moz-transform');
                        }
                    }
                } else {
                    return transform != "" && transform != 'none';
                }
            }
            if (transform == "" || transform == 'none') {
                transform = $(document.body).css('transform');
            }
            return transform != "" && transform != 'none' && transform != null;
        },

        getBrowser: function () {
            var ua = navigator.userAgent.toLowerCase();

            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
		        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
		        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
		        /(msie) ([\w.]+)/.exec(ua) ||
		        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
		        [];

            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        }
    });

    $.jqx.mobile = $.jqx.mobile || {};

    $.extend($.jqx.mobile,
    {
        _touchListener: function (e, me) {
            var createTouchEvent = function (name, e) {
                var event = document.createEvent('MouseEvents');

                event.initMouseEvent(
                    name,
                    e.bubbles,
                    e.cancelable,
                    e.view,
                    e.detail,
                    e.screenX,
                    e.screenY,
                    e.clientX,
                    e.clientY,
                    e.ctrlKey,
                    e.altKey,
                    e.shiftKey,
                    e.metaKey,
                    e.button,
                    e.relatedTarget
                );
                event._pageX = e.pageX;
                event._pageY = e.pageY;

                return event;
            }

            var eventMap = { 'mousedown': 'touchstart', 'mouseup': 'touchend', 'mousemove': 'touchmove' };
            var event = createTouchEvent(eventMap[e.type], e);
            e.target.dispatchEvent(event);

            var fn = e.target['on' + eventMap[e.type]];
            if (typeof fn === 'function') fn(e);
        },

        setMobileSimulator: function (element, value) {
            if (this.isTouchDevice()) {
                return;
            }

            this.simulatetouches = true;
            if (value == false) {
                this.simulatetouches = false;
            }

            var eventMap = { 'mousedown': 'touchstart', 'mouseup': 'touchend', 'mousemove': 'touchmove' };

            var self = this;
            if (window.addEventListener) {
                var subscribeToEvents = function () {
                    for (var key in eventMap) {
                        if (element.addEventListener) {
                            element.removeEventListener(key, self._touchListener);
                            element.addEventListener(key, self._touchListener, false);
                        }

                        //  document.removeEventListener(key, self._touchListener);
                        //  document.addEventListener(key, self._touchListener, false);
                    }
                }

                if ($.browser.msie) {
                    subscribeToEvents();
                }
                else {
                    window.addEventListener('load', function () {
                        subscribeToEvents();
                    }, false);
                }
            }
        },

        isTouchDevice: function () {
            if (this.touchDevice != undefined)
                return this.touchDevice;

            var txt = "Browser CodeName: " + navigator.appCodeName + "";
            txt += "Browser Name: " + navigator.appName + "";
            txt += "Browser Version: " + navigator.appVersion + "";
        //    txt += "Cookies Enabled: " + navigator.cookieEnabled + "";
            txt += "Platform: " + navigator.platform + "";
            txt += "User-agent header: " + navigator.userAgent + "";

            if (txt.indexOf('Android') != -1)
                return true;

            if (txt.indexOf('IEMobile') != -1)
                return true;

            if (txt.indexOf('Windows Phone OS') != -1)
                return true;

            if (txt.indexOf('Windows Phone 6.5') != -1)
                return true;

            if (txt.indexOf('BlackBerry') != -1 && txt.indexOf('Mobile Safari') != -1)
                return true;

            if (txt.indexOf('ipod') != -1)
                return true;

            if (txt.indexOf('nokia') != -1 || txt.indexOf('Nokia') != -1)
                return true;

            if (txt.indexOf('Chrome/17') != -1)
                return false;

            if (txt.indexOf('Opera') != -1 && txt.indexOf('Platform: Win') != -1) {
                return false;
            }

            // check for IPad, IPhone, IE and Chrome
            try {
                if (this.touchDevice != undefined)
                    return this.touchDevice;

                this.touchDevice = true;
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                this.touchDevice = false;
                return false;
            }
        },

        getLeftPos: function (inputObj) {
            var returnValue = inputObj.offsetLeft;
            while ((inputObj = inputObj.offsetParent) != null) {
                if (inputObj.tagName != 'HTML') {
                    returnValue += inputObj.offsetLeft;
                    if (document.all) returnValue += inputObj.clientLeft;
                }
            }
            return returnValue;
        },

        getTopPos: function (inputObj) {
            var returnValue = inputObj.offsetTop;
            while ((inputObj = inputObj.offsetParent) != null) {
                if (inputObj.tagName != 'HTML') {
                    returnValue += (inputObj.offsetTop - inputObj.scrollTop);
                    if (document.all) returnValue += inputObj.clientTop;
                }
            }

            if (this.isSafariMobileBrowser()) {
                if (this.isSafari4MobileBrowser() && this.isIPadSafariMobileBrowser()) {
                    return returnValue;
                }

                returnValue = returnValue + $(window).scrollTop();
            }

            return returnValue;
        },

        isChromeMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('android') != -1;
            return result;
        },

        isOperaMiniMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('opera mini') != -1 || agent.indexOf('opera mobi') != -1;
            return result;
        },

        isOperaMiniBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('opera mini') != -1;
            return result;
        },

        isNewSafariMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('ipad') != -1 || agent.indexOf('iphone') != -1 || agent.indexOf('ipod') != -1;
            result = result && (agent.indexOf('version/5') != -1);
            return result;
        },

        isSafari4MobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('ipad') != -1 || agent.indexOf('iphone') != -1 || agent.indexOf('ipod') != -1;
            result = result && (agent.indexOf('version/4') != -1);
            return result;
        },

        isSafariMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('ipad') != -1 || agent.indexOf('iphone') != -1 || agent.indexOf('ipod') != -1;
            return result;
        },

        isIPhoneSafariMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('iphone') != -1;
            return result;
        },

        isIPadSafariMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('ipad') != -1;
            return result;
        },

        isMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('ipad') != -1 || agent.indexOf('iphone') != -1 || agent.indexOf('android') != -1;
            return result;
        },

        // Get the touch points from this event
        getTouches: function (e) {
            if (e.originalEvent) {
                if (e.originalEvent.touches && e.originalEvent.touches.length) {
                    return e.originalEvent.touches;
                } else if (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
                    return e.originalEvent.changedTouches;
                }
            }

            if (!e.touches) {
                e.touches = new Array();
                e.touches[0] = e.originalEvent;
            }

            return e.touches;
        },

        // Dispatches a fake mouse event from a touch event
        dispatchMouseEvent: function (name, touch, target) {
            if (this.simulatetouches)
                return;

            var e = document.createEvent('MouseEvent');
            e.initMouseEvent(name, true, true, touch.view, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
            if (target != null) {
                target.dispatchEvent(e);
            }
        },

        // Find the root node of this target
        getRootNode: function (target) {
            while (target.nodeType !== 1) {
                target = target.parentNode;
            }
            return target;
        },

        setTouchScroll: function (enable, key) {
            if (!this.enableScrolling) this.enableScrolling = [];
            this.enableScrolling[key] = enable;
        },

        touchScroll: function (element, scrollHeight, callback, key) {
            if (element == null)
                return;

            var me = this;
            var scrollY = 0;
            var touchY = 0;
            var movedY = 0;
            var scrollX = 0;
            var touchX = 0;
            var movedX = 0;
            if (!this.scrolling) this.scrolling = [];
            this.scrolling[key] = false;
            var moved = false;
            var $element = $(element);
            var touchTags = ['select', 'input', 'textarea'];
            var touchStart = 0;
            var touchEnd = 0;
            if (!this.enableScrolling) this.enableScrolling = [];
            this.enableScrolling[key] = true;
            var key = key;

            $element.bind('touchstart.touchScroll', function (event) {
                if (!me.enableScrolling[key])
                    return true;

                // Allow certain HTML tags to receive touch events
                if ($.inArray(event.target.tagName.toLowerCase(), touchTags) !== -1) {
                    return;
                }

                var touches = me.getTouches(event);
                var touch = touches[0];
                if (touches.length == 1) {
                    me.dispatchMouseEvent('mousedown', touch, me.getRootNode(touch.target));
                }

                me.scrolling[key] = true;
                moved = false;
                touchY = touch.pageY;
                touchX = touch.pageX;
                if (me.simulatetouches) {
                    touchY = touch._pageY;
                    touchX = touch._pageX;
                }

                scrollY = 0;
                scrollX = 0;
                return true;
            });

            $element.bind('touchmove.touchScroll', function (event) {
                if (!me.enableScrolling[key])
                    return true;

                if (!me.scrolling[key]) {
                    return true;
                }
                var touches = me.getTouches(event);
                if (touches.length > 1) {
                    return true;
                }

                var pageY = touches[0].pageY;
                var pageX = touches[0].pageX;

                if (me.simulatetouches) {
                    pageY = touches[0]._pageY;
                    pageX = touches[0]._pageX;
                }

                var dy = pageY - touchY;
                var dx = pageX - touchX;
                touchEnd = pageY;
                touchHorizontalEnd = pageX;
                movedY = dy - scrollY;
                movedX = dx - scrollX;
                moved = true;
                scrollY = dy;
                scrollX = dx;
                callback(-movedX * 3, -movedY * 3, dx, dy, event);
                event.preventDefault();
                event.stopPropagation();

                return false;
            });

            if (this.simulatetouches) {
                $(window).bind('mouseup.touchScroll', function (event) {
                    me.scrolling[key] = false;
                });

                if (window.frameElement) {
                    if (window.top != null) {
                        var eventHandle = function (event) {
                            me.scrolling[key] = false;
                        };

                        if (window.top.document.addEventListener) {
                            window.top.document.removeEventListener('mouseup', eventHandle, false);
                            window.top.document.addEventListener('mouseup', eventHandle, false);
                        } else if (window.top.document.attachEvent) {
                            window.top.document.attachEvent("on" + 'mouseup', eventHandle);
                        }
                    }
                }

                $(document).bind('touchend', function (event) {
                    if (!me.scrolling[key]) {
                        return true;
                    }
                    me.scrolling[key] = false;
                    var touch = me.getTouches(event)[0],
						target = me.getRootNode(touch.target);

                    // Dispatch fake mouse up and click events if this touch event did not move
                    me.dispatchMouseEvent('mouseup', touch, target);
                    me.dispatchMouseEvent('click', touch, target);
                });
            }

            $element.bind('touchend.touchScroll touchcancel.touchScroll', function (event) {
                if (!me.enableScrolling[key])
                    return true;

                var touch = me.getTouches(event)[0];
                if (!me.scrolling[key]) {
                    return true;
                }
                me.scrolling[key] = false;
                if (moved) {
                    me.dispatchMouseEvent('mouseup', touch, target);
                } else {
                    var touch = me.getTouches(event)[0],
						target = me.getRootNode(touch.target);

                    //        event.preventDefault();
                    //         event.stopPropagation();
                    // Dispatch fake mouse up and click events if this touch event did not move
                    me.dispatchMouseEvent('mouseup', touch, target);
                    me.dispatchMouseEvent('click', touch, target);
                }
            });
        }
    });

    $.jqx.cookie = $.jqx.cookie || {};
    $.extend($.jqx.cookie,
    {
        cookie: function (key, value, options) {
            // set cookie.
            if (arguments.length > 1 && String(value) !== "[object Object]") {
                options = jQuery.extend({}, options);

                if (value === null || value === undefined) {
                    options.expires = -1;
                }

                if (typeof options.expires === 'number') {
                    var days = options.expires, t = options.expires = new Date();
                    t.setDate(t.getDate() + days);
                }

                value = String(value);

                return (document.cookie = [
                encodeURIComponent(key), '=',
                options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
        ].join(''));
            }
            // get cookie...
            options = value || {};
            var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
            return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
        }
    });

    // stringutilities
    $.jqx.string = $.jqx.string || {};
    $.extend($.jqx.string,
    {
        contains: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            return fullString.indexOf(value) != -1;
        },

        containsIgnoreCase: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            return fullString.toUpperCase().indexOf(value.toUpperCase()) != -1;
        },

        equals: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            fullString = this.normalize(fullString);

            if (value.length == fullString.length) {
                return fullString.slice(0, value.length) == value;
            }

            return false;
        },

        equalsIgnoreCase: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            fullString = this.normalize(fullString);

            if (value.length == fullString.length) {
                return fullString.toUpperCase().slice(0, value.length) == value.toUpperCase();
            }

            return false;
        },

        startsWith: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            return fullString.slice(0, value.length) == value;
        },

        startsWithIgnoreCase: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            return fullString.toUpperCase().slice(0, value.length) == value.toUpperCase();
        },

        normalize: function (fullString) {
            if (fullString.charCodeAt(fullString.length - 1) == 65279) {
                fullString = fullString.substring(0, fullString.length - 1);
            }

            return fullString;
        },

        endsWith: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            fullString = this.normalize(fullString);
            return fullString.slice(-value.length) == value;
        },

        endsWithIgnoreCase: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            fullString = this.normalize(fullString);

            return fullString.toUpperCase().slice(-value.length) == value.toUpperCase();
        }
    });

    $.extend(jQuery.easing, {
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInQuad: function (x, t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeInOutCirc: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInCubic: function (x, t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInSine: function (x, t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function (x, t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    });
})(jQuery);
(function ($) {
    $.fn.extend({
        ischildof: function (filter_string) {
            var parents = $(this).parents().get();

            for (j = 0; j < parents.length; j++) {
                if ($(parents[j]).is(filter_string)) {
                    return true;
                }
            }

            return false;
        }
    });
})(jQuery);
