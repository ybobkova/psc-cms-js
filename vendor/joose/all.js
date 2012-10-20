        
    ;!function () {;
    var Joose = {}
    
    // configuration hash
    
    Joose.C             = typeof JOOSE_CFG != 'undefined' ? JOOSE_CFG : {}
    
    Joose.is_IE         = '\v' == 'v'
    Joose.is_NodeJS     = Boolean(typeof process != 'undefined' && process.pid)
    
    Joose.top           = Joose.is_NodeJS && global || this
    
    Joose.stub          = function () {
        return function () { throw new Error("Modules can not be instantiated") }
    }
    
    
    Joose.VERSION       = ({ /*PKGVERSION*/VERSION : '3.50.0' }).VERSION
    
    
    if (typeof module != 'undefined') module.exports = Joose
    /*if (!Joose.is_NodeJS) */
    this.Joose = Joose
    
    
    // Static helpers for Arrays
    Joose.A = {
    
        each : function (array, func, scope) {
            scope = scope || this
            
            for (var i = 0, len = array.length; i < len; i++) 
                if (func.call(scope, array[i], i) === false) return false
        },
        
        
        eachR : function (array, func, scope) {
            scope = scope || this
    
            for (var i = array.length - 1; i >= 0; i--) 
                if (func.call(scope, array[i], i) === false) return false
        },
        
        
        exists : function (array, value) {
            for (var i = 0, len = array.length; i < len; i++) if (array[i] == value) return true
                
            return false
        },
        
        
        map : function (array, func, scope) {
            scope = scope || this
            
            var res = []
            
            for (var i = 0, len = array.length; i < len; i++) 
                res.push( func.call(scope, array[i], i) )
                
            return res
        },
        
    
        grep : function (array, func) {
            var a = []
            
            Joose.A.each(array, function (t) {
                if (func(t)) a.push(t)
            })
            
            return a
        },
        
        
        remove : function (array, removeEle) {
            var a = []
            
            Joose.A.each(array, function (t) {
                if (t !== removeEle) a.push(t)
            })
            
            return a
        }
        
    }
    
    // Static helpers for Strings
    Joose.S = {
        
        saneSplit : function (str, delimeter) {
            var res = (str || '').split(delimeter)
            
            if (res.length == 1 && !res[0]) res.shift()
            
            return res
        },
        
    
        uppercaseFirst : function (string) { 
            return string.substr(0, 1).toUpperCase() + string.substr(1, string.length - 1)
        },
        
        
        strToClass : function (name, top) {
            var current = top || Joose.top
            
            Joose.A.each(name.split('.'), function (segment) {
                if (current) 
                    current = current[ segment ]
                else
                    return false
            })
            
            return current
        }
    }
    
    var baseFunc    = function () {}
    
    // Static helpers for objects
    Joose.O = {
    
        each : function (object, func, scope) {
            scope = scope || this
            
            for (var i in object) 
                if (func.call(scope, object[i], i) === false) return false
            
            if (Joose.is_IE) 
                return Joose.A.each([ 'toString', 'constructor', 'hasOwnProperty' ], function (el) {
                    
                    if (object.hasOwnProperty(el)) return func.call(scope, object[el], el)
                })
        },
        
        
        eachOwn : function (object, func, scope) {
            scope = scope || this
            
            return Joose.O.each(object, function (value, name) {
                if (object.hasOwnProperty(name)) return func.call(scope, value, name)
            }, scope)
        },
        
        
        copy : function (source, target) {
            target = target || {}
            
            Joose.O.each(source, function (value, name) { target[name] = value })
            
            return target
        },
        
        
        copyOwn : function (source, target) {
            target = target || {}
            
            Joose.O.eachOwn(source, function (value, name) { target[name] = value })
            
            return target
        },
        
        
        getMutableCopy : function (object) {
            baseFunc.prototype = object
            
            return new baseFunc()
        },
        
        
        extend : function (target, source) {
            return Joose.O.copy(source, target)
        },
        
        
        isEmpty : function (object) {
            for (var i in object) if (object.hasOwnProperty(i)) return false
            
            return true
        },
        
        
        isInstance: function (obj) {
            return obj && obj.meta && obj.constructor == obj.meta.c
        },
        
        
        isClass : function (obj) {
            return obj && obj.meta && obj.meta.c == obj
        },
        
        
        wantArray : function (obj) {
            if (obj instanceof Array) return obj
            
            return [ obj ]
        },
        
        
        // this was a bug in WebKit, which gives typeof / / == 'function'
        // should be monitored and removed at some point in the future
        isFunction : function (obj) {
            return typeof obj == 'function' && obj.constructor != / /.constructor
        }
    }
    
    
    //initializers
    
    Joose.I = {
        Array       : function () { return [] },
        Object      : function () { return {} },
        Function    : function () { return arguments.callee },
        Now         : function () { return new Date() }
    };
    Joose.Proto = Joose.stub()
    
    Joose.Proto.Empty = Joose.stub()
        
    Joose.Proto.Empty.meta = {};
    ;(function () {
    
        Joose.Proto.Object = Joose.stub()
        
        
        var SUPER = function () {
            var self = SUPER.caller
            
            if (self == SUPERARG) self = self.caller
            
            if (!self.SUPER) throw "Invalid call to SUPER"
            
            return self.SUPER[self.methodName].apply(this, arguments)
        }
        
        
        var SUPERARG = function () {
            return this.SUPER.apply(this, arguments[0])
        }
        
        
        
        Joose.Proto.Object.prototype = {
            
            SUPERARG : SUPERARG,
            SUPER : SUPER,
            
            INNER : function () {
                throw "Invalid call to INNER"
            },                
            
            
            BUILD : function (config) {
                return arguments.length == 1 && typeof config == 'object' && config || {}
            },
            
            
            initialize: function () {
            },
            
            
            toString: function () {
                return "a " + this.meta.name
            }
            
        }
            
        Joose.Proto.Object.meta = {
            constructor     : Joose.Proto.Object,
            
            methods         : Joose.O.copy(Joose.Proto.Object.prototype),
            attributes      : {}
        }
        
        Joose.Proto.Object.prototype.meta = Joose.Proto.Object.meta
    
    })();
    ;(function () {
    
        Joose.Proto.Class = function () {
            return this.initialize(this.BUILD.apply(this, arguments)) || this
        }
        
        var bootstrap = {
            
            VERSION             : null,
            AUTHORITY           : null,
            
            constructor         : Joose.Proto.Class,
            superClass          : null,
            
            name                : null,
            
            attributes          : null,
            methods             : null,
            
            meta                : null,
            c                   : null,
            
            defaultSuperClass   : Joose.Proto.Object,
            
            
            BUILD : function (name, extend) {
                this.name = name
                
                return { __extend__ : extend || {} }
            },
            
            
            initialize: function (props) {
                var extend      = props.__extend__
                
                this.VERSION    = extend.VERSION
                this.AUTHORITY  = extend.AUTHORITY
                
                delete extend.VERSION
                delete extend.AUTHORITY
                
                this.c = this.extractConstructor(extend)
                
                this.adaptConstructor(this.c)
                
                if (extend.constructorOnly) {
                    delete extend.constructorOnly
                    return
                }
                
                this.construct(extend)
            },
            
            
            construct : function (extend) {
                if (!this.prepareProps(extend)) return
                
                var superClass = this.superClass = this.extractSuperClass(extend)
                
                this.processSuperClass(superClass)
                
                this.adaptPrototype(this.c.prototype)
                
                this.finalize(extend)
            },
            
            
            finalize : function (extend) {
                this.processStem(extend)
                
                this.extend(extend)
            },
            
            
            //if the extension returns false from this method it should re-enter 'construct'
            prepareProps : function (extend) {
                return true
            },
            
            
            extractConstructor : function (extend) {
                var res = extend.hasOwnProperty('constructor') ? extend.constructor : this.defaultConstructor()
                
                delete extend.constructor
                
                return res
            },
            
            
            extractSuperClass : function (extend) {
                if (extend.hasOwnProperty('isa') && !extend.isa) throw new Error("Attempt to inherit from undefined superclass [" + this.name + "]")
                
                var res = extend.isa || this.defaultSuperClass
                
                delete extend.isa
                
                return res
            },
            
            
            processStem : function () {
                var superMeta       = this.superClass.meta
                
                this.methods        = Joose.O.getMutableCopy(superMeta.methods || {})
                this.attributes     = Joose.O.getMutableCopy(superMeta.attributes || {})
            },
            
            
            initInstance : function (instance, props) {
                Joose.O.copyOwn(props, instance)
            },
            
            
            defaultConstructor: function () {
                return function (arg) {
                    var BUILD = this.BUILD
                    
                    var args = BUILD && BUILD.apply(this, arguments) || arg || {}
                    
                    var thisMeta    = this.meta
                    
                    thisMeta.initInstance(this, args)
                    
                    return thisMeta.hasMethod('initialize') && this.initialize(args) || this
                }
            },
            
            
            processSuperClass: function (superClass) {
                var superProto      = superClass.prototype
                
                //non-Joose superclasses
                if (!superClass.meta) {
                    
                    var extend = Joose.O.copy(superProto)
                    
                    extend.isa = Joose.Proto.Empty
                    // clear potential value in the `extend.constructor` to prevent it from being modified
                    delete extend.constructor
                    
                    var meta = new this.defaultSuperClass.meta.constructor(null, extend)
                    
                    superClass.meta = superProto.meta = meta
                    
                    meta.c = superClass
                }
                
                this.c.prototype    = Joose.O.getMutableCopy(superProto)
                this.c.superClass   = superProto
            },
            
            
            adaptConstructor: function (c) {
                c.meta = this
                
                if (!c.hasOwnProperty('toString')) c.toString = function () { return this.meta.name }
            },
        
            
            adaptPrototype: function (proto) {
                //this will fix weird semantic of native "constructor" property to more intuitive (idea borrowed from Ext)
                proto.constructor   = this.c
                proto.meta          = this
            },
            
            
            addMethod: function (name, func) {
                func.SUPER = this.superClass.prototype
                
                //chrome don't allow to redefine the "name" property
                func.methodName = name
                
                this.methods[name] = func
                this.c.prototype[name] = func
            },
            
            
            addAttribute: function (name, init) {
                this.attributes[name] = init
                this.c.prototype[name] = init
            },
            
            
            removeMethod : function (name) {
                delete this.methods[name]
                delete this.c.prototype[name]
            },
        
            
            removeAttribute: function (name) {
                delete this.attributes[name]
                delete this.c.prototype[name]
            },
            
            
            hasMethod: function (name) { 
                return Boolean(this.methods[name])
            },
            
            
            hasAttribute: function (name) { 
                return this.attributes[name] !== undefined
            },
            
        
            hasOwnMethod: function (name) { 
                return this.hasMethod(name) && this.methods.hasOwnProperty(name)
            },
            
            
            hasOwnAttribute: function (name) { 
                return this.hasAttribute(name) && this.attributes.hasOwnProperty(name)
            },
            
            
            extend : function (props) {
                Joose.O.eachOwn(props, function (value, name) {
                    if (name != 'meta' && name != 'constructor') 
                        if (Joose.O.isFunction(value) && !value.meta) 
                            this.addMethod(name, value) 
                        else 
                            this.addAttribute(name, value)
                }, this)
            },
            
            
            subClassOf : function (classObject, extend) {
                return this.subClass(extend, null, classObject)
            },
        
        
            subClass : function (extend, name, classObject) {
                extend      = extend        || {}
                extend.isa  = classObject   || this.c
                
                return new this.constructor(name, extend).c
            },
            
            
            instantiate : function () {
                var f = function () {}
                
                f.prototype = this.c.prototype
                
                var obj = new f()
                
                return this.c.apply(obj, arguments) || obj
            }
        }
        
        //micro bootstraping
        
        Joose.Proto.Class.prototype = Joose.O.getMutableCopy(Joose.Proto.Object.prototype)
        
        Joose.O.extend(Joose.Proto.Class.prototype, bootstrap)
        
        Joose.Proto.Class.prototype.meta = new Joose.Proto.Class('Joose.Proto.Class', bootstrap)
        
        
        
        Joose.Proto.Class.meta.addMethod('isa', function (someClass) {
            var f = function () {}
            
            f.prototype = this.c.prototype
            
            return new f() instanceof someClass
        })
    })();
    Joose.Managed = Joose.stub()
    
    Joose.Managed.Property = new Joose.Proto.Class('Joose.Managed.Property', {
        
        name            : null,
        
        init            : null,
        value           : null,
        
        definedIn       : null,
        
        
        initialize : function (props) {
            Joose.Managed.Property.superClass.initialize.call(this, props)
            
            this.computeValue()
        },
        
        
        computeValue : function () {
            this.value = this.init
        },    
        
        
        //targetClass is still open at this stage
        preApply : function (targetClass) {
        },
        
    
        //targetClass is already open at this stage
        postUnApply : function (targetClass) {
        },
        
        
        apply : function (target) {
            target[this.name] = this.value
        },
        
        
        isAppliedTo : function (target) {
            return target[this.name] == this.value
        },
        
        
        unapply : function (from) {
            if (!this.isAppliedTo(from)) throw "Unapply of property [" + this.name + "] from [" + from + "] failed"
            
            delete from[this.name]
        },
        
        
        cloneProps : function () {
            return {
                name        : this.name, 
                init        : this.init,
                definedIn   : this.definedIn
            }
        },
    
        
        clone : function (name) {
            var props = this.cloneProps()
            
            props.name = name || props.name
            
            return new this.constructor(props)
        }
        
        
    }).c;
    Joose.Managed.Property.ConflictMarker = new Joose.Proto.Class('Joose.Managed.Property.ConflictMarker', {
        
        isa : Joose.Managed.Property,
    
        apply : function (target) {
            throw new Error("Attempt to apply ConflictMarker [" + this.name + "] to [" + target + "]")
        }
        
    }).c;
    Joose.Managed.Property.Requirement = new Joose.Proto.Class('Joose.Managed.Property.Requirement', {
        
        isa : Joose.Managed.Property,
    
        
        apply : function (target) {
            if (!target.meta.hasMethod(this.name)) 
                throw new Error("Requirement [" + this.name + "], defined in [" + this.definedIn.definedIn.name + "] is not satisfied for class [" + target + "]")
        },
        
        
        unapply : function (from) {
        }
        
    }).c;
    Joose.Managed.Property.Attribute = new Joose.Proto.Class('Joose.Managed.Property.Attribute', {
        
        isa : Joose.Managed.Property,
        
        slot                : null,
        
        
        initialize : function () {
            Joose.Managed.Property.Attribute.superClass.initialize.apply(this, arguments)
            
            this.slot = this.name
        },
        
        
        apply : function (target) {
            target.prototype[ this.slot ] = this.value
        },
        
        
        isAppliedTo : function (target) {
            return target.prototype[ this.slot ] == this.value
        },
        
        
        unapply : function (from) {
            if (!this.isAppliedTo(from)) throw "Unapply of property [" + this.name + "] from [" + from + "] failed"
            
            delete from.prototype[this.slot]
        },
        
        
        clearValue : function (instance) {
            delete instance[ this.slot ]
        },
        
        
        hasValue : function (instance) {
            return instance.hasOwnProperty(this.slot)
        },
            
            
        getRawValueFrom : function (instance) {
            return instance[ this.slot ]
        },
        
        
        setRawValueTo : function (instance, value) {
            instance[ this.slot ] = value
            
            return this
        }
        
    }).c;
    Joose.Managed.Property.MethodModifier = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier', {
        
        isa : Joose.Managed.Property,
    
        
        prepareWrapper : function () {
            throw "Abstract method [prepareWrapper] of " + this + " was called"
        },
        
        
        apply : function (target) {
            var name            = this.name
            var targetProto     = target.prototype
            var isOwn           = targetProto.hasOwnProperty(name)
            var original        = targetProto[name]
            var superProto      = target.meta.superClass.prototype
            
            
            var originalCall = isOwn ? original : function () { 
                return superProto[name].apply(this, arguments) 
            }
            
            var methodWrapper = this.prepareWrapper({
                name            : name,
                modifier        : this.value, 
                
                isOwn           : isOwn,
                originalCall    : originalCall, 
                
                superProto      : superProto,
                
                target          : target
            })
            
            if (isOwn) methodWrapper.__ORIGINAL__ = original
            
            methodWrapper.__CONTAIN__   = this.value
            methodWrapper.__METHOD__    = this
            
            targetProto[name] = methodWrapper
        },
        
        
        isAppliedTo : function (target) {
            var targetCont = target.prototype[this.name]
            
            return targetCont && targetCont.__CONTAIN__ == this.value
        },
        
        
        unapply : function (from) {
            var name = this.name
            var fromProto = from.prototype
            var original = fromProto[name].__ORIGINAL__
            
            if (!this.isAppliedTo(from)) throw "Unapply of method [" + name + "] from class [" + from + "] failed"
            
            //if modifier was applied to own method - restore it
            if (original) 
                fromProto[name] = original
            //otherwise - just delete it, to reveal the inherited method 
            else
                delete fromProto[name]
        }
        
    }).c;
    Joose.Managed.Property.MethodModifier.Override = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier.Override', {
        
        isa : Joose.Managed.Property.MethodModifier,
    
        
        prepareWrapper : function (params) {
            
            var modifier        = params.modifier
            var originalCall    = params.originalCall
            var superProto      = params.superProto
            var superMetaConst  = superProto.meta.constructor
            
            //call to Joose.Proto level, require some additional processing
            var isCallToProto = (superMetaConst == Joose.Proto.Class || superMetaConst == Joose.Proto.Object) && !(params.isOwn && originalCall.IS_OVERRIDE) 
            
            var original = originalCall
            
            if (isCallToProto) original = function () {
                var beforeSUPER = this.SUPER
                
                this.SUPER  = superProto.SUPER
                
                var res = originalCall.apply(this, arguments)
                
                this.SUPER = beforeSUPER
                
                return res
            }
    
            var override = function () {
                
                var beforeSUPER = this.SUPER
                
                this.SUPER  = original
                
                var res = modifier.apply(this, arguments)
                
                this.SUPER = beforeSUPER
                
                return res
            }
            
            override.IS_OVERRIDE = true
            
            return override
        }
        
        
    }).c;
    Joose.Managed.Property.MethodModifier.Put = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier.Put', {
        
        isa : Joose.Managed.Property.MethodModifier.Override,
    
    
        prepareWrapper : function (params) {
            
            //if (params.isOwn) throw "Method [" + params.name + "] is applying over something [" + params.originalCall + "] in class [" + params.target + "]"
            
            return Joose.Managed.Property.MethodModifier.Put.superClass.prepareWrapper.call(this, params)
        }
        
        
    }).c;
    Joose.Managed.Property.MethodModifier.After = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier.After', {
        
        isa : Joose.Managed.Property.MethodModifier,
    
        
        prepareWrapper : function (params) {
            
            var modifier        = params.modifier
            var originalCall    = params.originalCall
            
            return function () {
                var res = originalCall.apply(this, arguments)
                modifier.apply(this, arguments)
                return res
            }
        }    
    
        
    }).c;
    Joose.Managed.Property.MethodModifier.Before = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier.Before', {
        
        isa : Joose.Managed.Property.MethodModifier,
    
        
        prepareWrapper : function (params) {
            
            var modifier        = params.modifier
            var originalCall    = params.originalCall
            
            return function () {
                modifier.apply(this, arguments)
                return originalCall.apply(this, arguments)
            }
        }
        
    }).c;
    Joose.Managed.Property.MethodModifier.Around = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier.Around', {
        
        isa : Joose.Managed.Property.MethodModifier,
    
        prepareWrapper : function (params) {
            
            var modifier        = params.modifier
            var originalCall    = params.originalCall
            
            var me
            
            var bound = function () {
                return originalCall.apply(me, arguments)
            }
                
            return function () {
                me = this
                
                var boundArr = [ bound ]
                boundArr.push.apply(boundArr, arguments)
                
                return modifier.apply(this, boundArr)
            }
        }
        
    }).c;
    Joose.Managed.Property.MethodModifier.Augment = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier.Augment', {
        
        isa : Joose.Managed.Property.MethodModifier,
    
        
        prepareWrapper : function (params) {
            
            var AUGMENT = function () {
                
                //populate callstack to the most deep non-augment method
                var callstack = []
                
                var self = AUGMENT
                
                do {
                    callstack.push(self.IS_AUGMENT ? self.__CONTAIN__ : self)
                    
                    self = self.IS_AUGMENT && (self.__ORIGINAL__ || self.SUPER[self.methodName])
                } while (self)
                
                
                //save previous INNER
                var beforeINNER = this.INNER
                
                //create new INNER
                this.INNER = function () {
                    var innerCall = callstack.pop()
                    
                    return innerCall ? innerCall.apply(this, arguments) : undefined
                }
                
                //augment modifier results in hypotetical INNER call of the same method in subclass 
                var res = this.INNER.apply(this, arguments)
                
                //restore previous INNER chain
                this.INNER = beforeINNER
                
                return res
            }
            
            AUGMENT.methodName  = params.name
            AUGMENT.SUPER       = params.superProto
            AUGMENT.IS_AUGMENT  = true
            
            return AUGMENT
        }
        
    }).c;
    Joose.Managed.PropertySet = new Joose.Proto.Class('Joose.Managed.PropertySet', {
        
        isa                       : Joose.Managed.Property,
    
        properties                : null,
        
        propertyMetaClass         : Joose.Managed.Property,
        
        
        initialize : function (props) {
            Joose.Managed.PropertySet.superClass.initialize.call(this, props)
            
            //XXX this guards the meta roles :)
            this.properties = props.properties || {}
        },
        
        
        addProperty : function (name, props) {
            var metaClass = props.meta || this.propertyMetaClass
            delete props.meta
            
            props.definedIn     = this
            props.name          = name
            
            return this.properties[name] = new metaClass(props)
        },
        
        
        addPropertyObject : function (object) {
            return this.properties[object.name] = object
        },
        
        
        removeProperty : function (name) {
            var prop = this.properties[name]
            
            delete this.properties[name]
            
            return prop
        },
        
        
        haveProperty : function (name) {
            return this.properties[name] != null
        },
        
    
        haveOwnProperty : function (name) {
            return this.haveProperty(name) && this.properties.hasOwnProperty(name)
        },
        
        
        getProperty : function (name) {
            return this.properties[name]
        },
        
        
        //includes inherited properties (probably you wants 'eachOwn', which process only "own" (including consumed from Roles) properties) 
        each : function (func, scope) {
            Joose.O.each(this.properties, func, scope || this)
        },
        
        
        eachOwn : function (func, scope) {
            Joose.O.eachOwn(this.properties, func, scope || this)
        },
        
        
        //synonym for each
        eachAll : function (func, scope) {
            this.each(func, scope)
        },
        
        
        cloneProps : function () {
            var props = Joose.Managed.PropertySet.superClass.cloneProps.call(this)
            
            props.propertyMetaClass     = this.propertyMetaClass
            
            return props
        },
        
        
        clone : function (name) {
            var clone = this.cleanClone(name)
            
            clone.properties = Joose.O.copyOwn(this.properties)
            
            return clone
        },
        
        
        cleanClone : function (name) {
            var props = this.cloneProps()
            
            props.name = name || props.name
            
            return new this.constructor(props)
        },
        
        
        alias : function (what) {
            var props = this.properties
            
            Joose.O.each(what, function (aliasName, originalName) {
                var original = props[originalName]
                
                if (original) this.addPropertyObject(original.clone(aliasName))
            }, this)
        },
        
        
        exclude : function (what) {
            var props = this.properties
            
            Joose.A.each(what, function (name) {
                delete props[name]
            })
        },
        
        
        beforeConsumedBy : function () {
        },
        
        
        flattenTo : function (target) {
            var targetProps = target.properties
            
            this.eachOwn(function (property, name) {
                var targetProperty = targetProps[name]
                
                if (targetProperty instanceof Joose.Managed.Property.ConflictMarker) return
                
                if (!targetProps.hasOwnProperty(name) || targetProperty == null) {
                    target.addPropertyObject(property)
                    return
                }
                
                if (targetProperty == property) return
                
                target.removeProperty(name)
                target.addProperty(name, {
                    meta : Joose.Managed.Property.ConflictMarker
                })
            }, this)
        },
        
        
        composeTo : function (target) {
            this.eachOwn(function (property, name) {
                if (!target.haveOwnProperty(name)) target.addPropertyObject(property)
            })
        },
        
        
        composeFrom : function () {
            if (!arguments.length) return
            
            var flattening = this.cleanClone()
            
            Joose.A.each(arguments, function (arg) {
                var isDescriptor    = !(arg instanceof Joose.Managed.PropertySet)
                var propSet         = isDescriptor ? arg.propertySet : arg
                
                propSet.beforeConsumedBy(this, flattening)
                
                if (isDescriptor) {
                    if (arg.alias || arg.exclude)   propSet = propSet.clone()
                    if (arg.alias)                  propSet.alias(arg.alias)
                    if (arg.exclude)                propSet.exclude(arg.exclude)
                }
                
                propSet.flattenTo(flattening)
            }, this)
            
            flattening.composeTo(this)
        },
        
        
        preApply : function (target) {
            this.eachOwn(function (property) {
                property.preApply(target)
            })
        },
        
        
        apply : function (target) {
            this.eachOwn(function (property) {
                property.apply(target)
            })
        },
        
        
        unapply : function (from) {
            this.eachOwn(function (property) {
                property.unapply(from)
            })
        },
        
        
        postUnApply : function (target) {
            this.eachOwn(function (property) {
                property.postUnApply(target)
            })
        }
        
    }).c
    ;
    var __ID__ = 1
    
    
    Joose.Managed.PropertySet.Mutable = new Joose.Proto.Class('Joose.Managed.PropertySet.Mutable', {
        
        isa                 : Joose.Managed.PropertySet,
    
        ID                  : null,
        
        derivatives         : null,
        
        opened              : null,
        
        composedFrom        : null,
        
        
        initialize : function (props) {
            Joose.Managed.PropertySet.Mutable.superClass.initialize.call(this, props)
            
            //initially opened
            this.opened             = 1
            this.derivatives        = {}
            this.ID                 = __ID__++
            this.composedFrom       = []
        },
        
        
        addComposeInfo : function () {
            this.ensureOpen()
            
            Joose.A.each(arguments, function (arg) {
                this.composedFrom.push(arg)
                
                var propSet = arg instanceof Joose.Managed.PropertySet ? arg : arg.propertySet
                    
                propSet.derivatives[this.ID] = this
            }, this)
        },
        
        
        removeComposeInfo : function () {
            this.ensureOpen()
            
            Joose.A.each(arguments, function (arg) {
                
                var i = 0
                
                while (i < this.composedFrom.length) {
                    var propSet = this.composedFrom[i]
                    propSet = propSet instanceof Joose.Managed.PropertySet ? propSet : propSet.propertySet
                    
                    if (arg == propSet) {
                        delete propSet.derivatives[this.ID]
                        this.composedFrom.splice(i, 1)
                    } else i++
                }
                
            }, this)
        },
        
        
        ensureOpen : function () {
            if (!this.opened) throw "Mutation of closed property set: [" + this.name + "]"
        },
        
        
        addProperty : function (name, props) {
            this.ensureOpen()
            
            return Joose.Managed.PropertySet.Mutable.superClass.addProperty.call(this, name, props)
        },
        
    
        addPropertyObject : function (object) {
            this.ensureOpen()
            
            return Joose.Managed.PropertySet.Mutable.superClass.addPropertyObject.call(this, object)
        },
        
        
        removeProperty : function (name) {
            this.ensureOpen()
            
            return Joose.Managed.PropertySet.Mutable.superClass.removeProperty.call(this, name)
        },
        
        
        composeFrom : function () {
            this.ensureOpen()
            
            return Joose.Managed.PropertySet.Mutable.superClass.composeFrom.apply(this, this.composedFrom)
        },
        
        
        open : function () {
            this.opened++
            
            if (this.opened == 1) {
            
                Joose.O.each(this.derivatives, function (propSet) {
                    propSet.open()
                })
                
                this.deCompose()
            }
        },
        
        
        close : function () {
            if (!this.opened) throw "Unmatched 'close' operation on property set: [" + this.name + "]"
            
            if (this.opened == 1) {
                this.reCompose()
                
                Joose.O.each(this.derivatives, function (propSet) {
                    propSet.close()
                })
            }
            this.opened--
        },
        
        
        reCompose : function () {
            this.composeFrom()
        },
        
        
        deCompose : function () {
            this.eachOwn(function (property, name) {
                if (property.definedIn != this) this.removeProperty(name)
            }, this)
        }
        
    }).c;
    Joose.Managed.StemElement = function () { throw "Modules may not be instantiated." }
    
    Joose.Managed.StemElement.Attributes = new Joose.Proto.Class('Joose.Managed.StemElement.Attributes', {
        
        isa                     : Joose.Managed.PropertySet.Mutable,
        
        propertyMetaClass       : Joose.Managed.Property.Attribute
        
    }).c
    ;
    Joose.Managed.StemElement.Methods = new Joose.Proto.Class('Joose.Managed.StemElement.Methods', {
        
        isa : Joose.Managed.PropertySet.Mutable,
        
        propertyMetaClass : Joose.Managed.Property.MethodModifier.Put,
    
        
        preApply : function () {
        },
        
        
        postUnApply : function () {
        }
        
    }).c;
    Joose.Managed.StemElement.Requirements = new Joose.Proto.Class('Joose.Managed.StemElement.Requirements', {
    
        isa                     : Joose.Managed.PropertySet.Mutable,
        
        propertyMetaClass       : Joose.Managed.Property.Requirement,
        
        
        
        alias : function () {
        },
        
        
        exclude : function () {
        },
        
        
        flattenTo : function (target) {
            this.each(function (property, name) {
                if (!target.haveProperty(name)) target.addPropertyObject(property)
            })
        },
        
        
        composeTo : function (target) {
            this.flattenTo(target)
        },
        
        
        preApply : function () {
        },
        
        
        postUnApply : function () {
        }
        
    }).c;
    Joose.Managed.StemElement.MethodModifiers = new Joose.Proto.Class('Joose.Managed.StemElement.MethodModifiers', {
    
        isa                     : Joose.Managed.PropertySet.Mutable,
        
        propertyMetaClass       : null,
        
        
        addProperty : function (name, props) {
            var metaClass = props.meta
            delete props.meta
            
            props.definedIn         = this
            props.name              = name
            
            var modifier            = new metaClass(props)
            var properties          = this.properties
            
            if (!properties[name]) properties[ name ] = []
            
            if (!properties[name].push) {
              throw new Error('push is not avaible on properties['+name+']');
            }
            properties[name].push(modifier)
            
            return modifier
        },
        
    
        addPropertyObject : function (object) {
            var name            = object.name
            var properties      = this.properties
            
            if (!properties[name]) properties[name] = []
            
            properties[name].push(object)
            
            return object
        },
        
        
        //remove only the last modifier
        removeProperty : function (name) {
            if (!this.haveProperty(name)) return undefined
            
            var properties      = this.properties
            var modifier        = properties[ name ].pop()
            
            //if all modifiers were removed - clearing the properties
            if (!properties[name].length) Joose.Managed.StemElement.MethodModifiers.superClass.removeProperty.call(this, name)
            
            return modifier
        },
        
        
        alias : function () {
        },
        
        
        exclude : function () {
        },
        
        
        flattenTo : function (target) {
            var targetProps = target.properties
            
            this.each(function (modifiersArr, name) {
                var targetModifiersArr = targetProps[name]
                
                if (targetModifiersArr == null) targetModifiersArr = targetProps[name] = []
                
                Joose.A.each(modifiersArr, function (modifier) {
                    if (!Joose.A.exists(targetModifiersArr, modifier)) targetModifiersArr.push(modifier)
                })
                
            })
        },
        
        
        composeTo : function (target) {
            this.flattenTo(target)
        },
    
        
        deCompose : function () {
            this.each(function (modifiersArr, name) {
                var i = 0
                
                while (i < modifiersArr.length) 
                    if (modifiersArr[i].definedIn != this) 
                        modifiersArr.splice(i, 1)
                    else 
                        i++
            })
        },
        
        
        preApply : function (target) {
        },
    
        
        postUnApply : function (target) {
        },
        
        
        apply : function (target) {
            this.each(function (modifiersArr, name) {
                Joose.A.each(modifiersArr, function (modifier) {
                    modifier.apply(target)
                })
            })
        },
        
        
        unapply : function (from) {
            this.each(function (modifiersArr, name) {
                for (var i = modifiersArr.length - 1; i >=0 ; i--) modifiersArr[i].unapply(from)
            })
        }
        
        
        
    }).c;
    Joose.Managed.PropertySet.Composition = new Joose.Proto.Class('Joose.Managed.PropertySet.Composition', {
        
        isa                         : Joose.Managed.PropertySet.Mutable,
        
        propertyMetaClass           : Joose.Managed.PropertySet.Mutable,
        
        processOrder                : null,
    
        
        each : function (func, scope) {
            var props   = this.properties
            var scope   = scope || this
            
            Joose.A.each(this.processOrder, function (name) {
                func.call(scope, props[name], name)
            })
        },
        
        
        eachR : function (func, scope) {
            var props   = this.properties
            var scope   = scope || this
            
            Joose.A.eachR(this.processOrder, function (name) {
                func.call(scope, props[name], name)
            })
            
            
    //        var props           = this.properties
    //        var processOrder    = this.processOrder
    //        
    //        for(var i = processOrder.length - 1; i >= 0; i--) 
    //            func.call(scope || this, props[ processOrder[i] ], processOrder[i])
        },
        
        
        clone : function (name) {
            var clone = this.cleanClone(name)
            
            this.each(function (property) {
                clone.addPropertyObject(property.clone())
            })
            
            return clone
        },
        
        
        alias : function (what) {
            this.each(function (property) {
                property.alias(what)
            })
        },
        
        
        exclude : function (what) {
            this.each(function (property) {
                property.exclude(what)
            })
        },
        
        
        flattenTo : function (target) {
            var targetProps = target.properties
            
            this.each(function (property, name) {
                var subTarget = targetProps[name] || target.addProperty(name, {
                    meta : property.constructor
                })
                
                property.flattenTo(subTarget)
            })
        },
        
        
        composeTo : function (target) {
            var targetProps = target.properties
            
            this.each(function (property, name) {
                var subTarget = targetProps[name] || target.addProperty(name, {
                    meta : property.constructor
                })
                
                property.composeTo(subTarget)
            })
        },
        
        
        
        deCompose : function () {
            this.eachR(function (property) {
                property.open()
            })
            
            Joose.Managed.PropertySet.Composition.superClass.deCompose.call(this)
        },
        
        
        reCompose : function () {
            Joose.Managed.PropertySet.Composition.superClass.reCompose.call(this)
            
            this.each(function (property) {
                property.close()
            })
        },
        
        
        unapply : function (from) {
            this.eachR(function (property) {
                property.unapply(from)
            })
        }
        
    }).c
    ;
    Joose.Managed.Stem = new Joose.Proto.Class('Joose.Managed.Stem', {
        
        isa                  : Joose.Managed.PropertySet.Composition,
        
        targetMeta           : null,
        
        attributesMC         : Joose.Managed.StemElement.Attributes,
        methodsMC            : Joose.Managed.StemElement.Methods,
        requirementsMC       : Joose.Managed.StemElement.Requirements,
        methodsModifiersMC   : Joose.Managed.StemElement.MethodModifiers,
        
        processOrder         : [ 'attributes', 'methods', 'requirements', 'methodsModifiers' ],
        
        
        initialize : function (props) {
            Joose.Managed.Stem.superClass.initialize.call(this, props)
            
            var targetMeta = this.targetMeta
            
            this.addProperty('attributes', {
                meta : this.attributesMC,
                
                //it can be no 'targetMeta' in clones
                properties : targetMeta ? targetMeta.attributes : {}
            })
            
            
            this.addProperty('methods', {
                meta : this.methodsMC,
                
                properties : targetMeta ? targetMeta.methods : {}
            })
            
            
            this.addProperty('requirements', {
                meta : this.requirementsMC
            })
            
            
            this.addProperty('methodsModifiers', {
                meta : this.methodsModifiersMC
            })
        },
        
        
        reCompose : function () {
            var c       = this.targetMeta.c
            
            this.preApply(c)
            
            Joose.Managed.Stem.superClass.reCompose.call(this)
            
            this.apply(c)
        },
        
        
        deCompose : function () {
            var c       = this.targetMeta.c
            
            this.unapply(c)
            
            Joose.Managed.Stem.superClass.deCompose.call(this)
            
            this.postUnApply(c)
        }
        
        
    }).c
    ;
    Joose.Managed.Builder = new Joose.Proto.Class('Joose.Managed.Builder', {
        
        targetMeta          : null,
        
        
        _buildStart : function (targetMeta, props) {
            targetMeta.stem.open()
            
            Joose.A.each([ 'trait', 'traits', 'removeTrait', 'removeTraits', 'does', 'doesnot', 'doesnt' ], function (builder) {
                if (props[builder]) {
                    this[builder](targetMeta, props[builder])
                    delete props[builder]
                }
            }, this)
        },
        
        
        _extend : function (props) {
            if (Joose.O.isEmpty(props)) return
            
            var targetMeta = this.targetMeta
            
            this._buildStart(targetMeta, props)
            
            Joose.O.eachOwn(props, function (value, name) {
                var handler = this[name]
                
                if (!handler) throw new Error("Unknown builder [" + name + "] was used during extending of [" + targetMeta.c + "]")
                
                handler.call(this, targetMeta, value)
            }, this)
            
            this._buildComplete(targetMeta, props)
        },
        
    
        _buildComplete : function (targetMeta, props) {
            targetMeta.stem.close()
        },
        
        
        methods : function (targetMeta, info) {
            Joose.O.eachOwn(info, function (value, name) {
                targetMeta.addMethod(name, value)
            })
        },
        
    
        removeMethods : function (targetMeta, info) {
            Joose.A.each(info, function (name) {
                targetMeta.removeMethod(name)
            })
        },
        
        
        have : function (targetMeta, info) {
            Joose.O.eachOwn(info, function (value, name) {
                targetMeta.addAttribute(name, value)
            })
        },
        
        
        havenot : function (targetMeta, info) {
            Joose.A.each(info, function (name) {
                targetMeta.removeAttribute(name)
            })
        },
        
    
        havent : function (targetMeta, info) {
            this.havenot(targetMeta, info)
        },
        
        
        after : function (targetMeta, info) {
            Joose.O.each(info, function (value, name) {
                targetMeta.addMethodModifier(name, value, Joose.Managed.Property.MethodModifier.After)
            })
        },
        
        
        before : function (targetMeta, info) {
            Joose.O.each(info, function (value, name) {
                targetMeta.addMethodModifier(name, value, Joose.Managed.Property.MethodModifier.Before)
            })
        },
        
        
        override : function (targetMeta, info) {
            Joose.O.each(info, function (value, name) {
                targetMeta.addMethodModifier(name, value, Joose.Managed.Property.MethodModifier.Override)
            })
        },
        
        
        around : function (targetMeta, info) {
            Joose.O.each(info, function (value, name) {
                targetMeta.addMethodModifier(name, value, Joose.Managed.Property.MethodModifier.Around)
            })
        },
        
        
        augment : function (targetMeta, info) {
            Joose.O.each(info, function (value, name) {
                targetMeta.addMethodModifier(name, value, Joose.Managed.Property.MethodModifier.Augment)
            })
        },
        
        
        removeModifier : function (targetMeta, info) {
            Joose.A.each(info, function (name) {
                targetMeta.removeMethodModifier(name)
            })
        },
        
        
        does : function (targetMeta, info) {
            Joose.A.each(Joose.O.wantArray(info), function (desc) {
                targetMeta.addRole(desc)
            })
        },
        
    
        doesnot : function (targetMeta, info) {
            Joose.A.each(Joose.O.wantArray(info), function (desc) {
                targetMeta.removeRole(desc)
            })
        },
        
        
        doesnt : function (targetMeta, info) {
            this.doesnot(targetMeta, info)
        },
        
        
        trait : function () {
            this.traits.apply(this, arguments)
        },
        
        
        traits : function (targetMeta, info) {
            if (targetMeta.firstPass) return
            
            if (!targetMeta.meta.isDetached) throw "Can't apply trait to not detached class"
            
            targetMeta.meta.extend({
                does : info
            })
        },
        
        
        removeTrait : function () {
            this.removeTraits.apply(this, arguments)
        },
         
        
        removeTraits : function (targetMeta, info) {
            if (!targetMeta.meta.isDetached) throw "Can't remove trait from not detached class"
            
            targetMeta.meta.extend({
                doesnot : info
            })
        }
        
        
        
    }).c;
    Joose.Managed.Class = new Joose.Proto.Class('Joose.Managed.Class', {
        
        isa                         : Joose.Proto.Class,
        
        stem                        : null,
        stemClass                   : Joose.Managed.Stem,
        stemClassCreated            : false,
        
        builder                     : null,
        builderClass                : Joose.Managed.Builder,
        builderClassCreated         : false,
        
        isDetached                  : false,
        firstPass                   : true,
        
        // a special instance, which, when passed as 1st argument to constructor, signifies that constructor should
        // skips traits processing for this instance
        skipTraitsAnchor            : {},
        
        
        //build for metaclasses - collects traits from roles
        BUILD : function () {
            var sup = Joose.Managed.Class.superClass.BUILD.apply(this, arguments)
            
            var props   = sup.__extend__
            
            var traits = Joose.O.wantArray(props.trait || props.traits || [])
            delete props.trait
            delete props.traits
            
            Joose.A.each(Joose.O.wantArray(props.does || []), function (arg) {
                var role = (arg.meta instanceof Joose.Managed.Class) ? arg : arg.role
                
                if (role.meta.meta.isDetached) traits.push(role.meta.constructor)
            })
            
            if (traits.length) props.traits = traits 
            
            return sup
        },
        
        
        initInstance : function (instance, props) {
            Joose.O.each(this.attributes, function (attribute, name) {
                
                if (attribute instanceof Joose.Managed.Attribute) 
                    attribute.initFromConfig(instance, props)
                else 
                    if (props.hasOwnProperty(name)) instance[name] = props[name]
            })
        },
        
        
        // we are using the same constructor for usual and meta- classes
        defaultConstructor: function () {
            return function (skipTraitsAnchor, params) {
                
                var thisMeta    = this.meta
                var skipTraits  = skipTraitsAnchor == thisMeta.skipTraitsAnchor
                
                var BUILD       = this.BUILD
                
                var props       = BUILD && BUILD.apply(this, skipTraits ? params : arguments) || (skipTraits ? params[0] : skipTraitsAnchor) || {}
                
                
                // either looking for traits in __extend__ (meta-class) or in usual props (usual class)
                var extend  = props.__extend__ || props
                
                var traits = extend.trait || extend.traits
                
                if (traits || extend.detached) {
                    delete extend.trait
                    delete extend.traits
                    delete extend.detached
                    
                    if (!skipTraits) {
                        var classWithTrait  = thisMeta.subClass({ does : traits || [] }, thisMeta.name)
                        var meta            = classWithTrait.meta
                        meta.isDetached     = true
                        
                        return meta.instantiate(thisMeta.skipTraitsAnchor, arguments)
                    }
                }
                
                thisMeta.initInstance(this, props)
                
                return thisMeta.hasMethod('initialize') && this.initialize(props) || this
            }
        },
        
        
        finalize: function (extend) {
            Joose.Managed.Class.superClass.finalize.call(this, extend)
            
            this.stem.close()
            
            this.afterMutate()
        },
        
        
        processStem : function () {
            Joose.Managed.Class.superClass.processStem.call(this)
            
            this.builder    = new this.builderClass({ targetMeta : this })
            this.stem       = new this.stemClass({ name : this.name, targetMeta : this })
            
            var builderClass = this.getClassInAttribute('builderClass')
            
            if (builderClass) {
                this.builderClassCreated = true
                this.addAttribute('builderClass', this.subClassOf(builderClass))
            }
            
            
            var stemClass = this.getClassInAttribute('stemClass')
            
            if (stemClass) {
                this.stemClassCreated = true
                this.addAttribute('stemClass', this.subClassOf(stemClass))
            }
        },
        
        
        extend : function (props) {
            if (props.builder) {
                this.getBuilderTarget().meta.extend(props.builder)
                delete props.builder
            }
            
            if (props.stem) {
                this.getStemTarget().meta.extend(props.stem)
                delete props.stem
            }
            
            this.builder._extend(props)
            
            this.firstPass = false
            
            if (!this.stem.opened) this.afterMutate()
        },
        
        
        getBuilderTarget : function () {
            var builderClass = this.getClassInAttribute('builderClass')
            if (!builderClass) throw "Attempt to extend a builder on non-meta class"
            
            return builderClass
        },
        
    
        getStemTarget : function () {
            var stemClass = this.getClassInAttribute('stemClass')
            if (!stemClass) throw "Attempt to extend a stem on non-meta class"
            
            return stemClass
        },
        
        
        getClassInAttribute : function (attributeName) {
            var attrClass = this.getAttribute(attributeName)
            if (attrClass instanceof Joose.Managed.Property.Attribute) attrClass = attrClass.value
            
            return attrClass
        },
        
        
        addMethodModifier: function (name, func, type) {
            var props = {}
            
            props.init = func
            props.meta = type
            
            return this.stem.properties.methodsModifiers.addProperty(name, props)
        },
        
        
        removeMethodModifier: function (name) {
            return this.stem.properties.methodsModifiers.removeProperty(name)
        },
        
        
        addMethod: function (name, func, props) {
            props = props || {}
            props.init = func
            
            return this.stem.properties.methods.addProperty(name, props)
        },
        
        
        addAttribute: function (name, init, props) {
            props = props || {}
            props.init = init
            
            return this.stem.properties.attributes.addProperty(name, props)
        },
        
        
        removeMethod : function (name) {
            return this.stem.properties.methods.removeProperty(name)
        },
    
        
        removeAttribute: function (name) {
            return this.stem.properties.attributes.removeProperty(name)
        },
        
        
        hasMethod: function (name) {
            return this.stem.properties.methods.haveProperty(name)
        },
        
        
        hasAttribute: function (name) { 
            return this.stem.properties.attributes.haveProperty(name)
        },
        
        
        hasMethodModifiersFor : function (name) {
            return this.stem.properties.methodsModifiers.haveProperty(name)
        },
        
        
        hasOwnMethod: function (name) {
            return this.stem.properties.methods.haveOwnProperty(name)
        },
        
        
        hasOwnAttribute: function (name) { 
            return this.stem.properties.attributes.haveOwnProperty(name)
        },
        
    
        getMethod : function (name) {
            return this.stem.properties.methods.getProperty(name)
        },
        
        
        getAttribute : function (name) {
            return this.stem.properties.attributes.getProperty(name)
        },
        
        
        eachRole : function (roles, func, scope) {
            Joose.A.each(roles, function (arg, index) {
                var role = (arg.meta instanceof Joose.Managed.Class) ? arg : arg.role
                
                func.call(scope || this, arg, role, index)
            }, this)
        },
        
        
        addRole : function () {
            
            this.eachRole(arguments, function (arg, role) {
                
                this.beforeRoleAdd(role)
                
                var desc = arg
                
                //compose descriptor can contain 'alias' and 'exclude' fields, in this case actual reference should be stored
                //into 'propertySet' field
                if (role != arg) {
                    desc.propertySet = role.meta.stem
                    delete desc.role
                } else
                    desc = desc.meta.stem
                
                this.stem.addComposeInfo(desc)
                
            }, this)
        },
        
        
        beforeRoleAdd : function (role) {
            var roleMeta = role.meta
            
            if (roleMeta.builderClassCreated) this.getBuilderTarget().meta.extend({
                does : [ roleMeta.getBuilderTarget() ]
            })
            
            if (roleMeta.stemClassCreated) this.getStemTarget().meta.extend({
                does : [ roleMeta.getStemTarget() ]
            })
            
            if (roleMeta.meta.isDetached && !this.firstPass) this.builder.traits(this, roleMeta.constructor)
        },
        
        
        beforeRoleRemove : function (role) {
            var roleMeta = role.meta
            
            if (roleMeta.builderClassCreated) this.getBuilderTarget().meta.extend({
                doesnt : [ roleMeta.getBuilderTarget() ]
            })
            
            if (roleMeta.stemClassCreated) this.getStemTarget().meta.extend({
                doesnt : [ roleMeta.getStemTarget() ]
            })
            
            if (roleMeta.meta.isDetached && !this.firstPass) this.builder.removeTraits(this, roleMeta.constructor)
        },
        
        
        removeRole : function () {
            this.eachRole(arguments, function (arg, role) {
                this.beforeRoleRemove(role)
                
                this.stem.removeComposeInfo(role.meta.stem)
            }, this)
        },
        
        
        getRoles : function () {
            
            return Joose.A.map(this.stem.composedFrom, function (composeDesc) {
                //compose descriptor can contain 'alias' and 'exclude' fields, in this case actual reference is stored
                //into 'propertySet' field
                if (!(composeDesc instanceof Joose.Managed.PropertySet)) return composeDesc.propertySet
                
                return composeDesc.targetMeta.c
            })
        },
        
        
        does : function (role) {
            var myRoles = this.getRoles()
            
            for (var i = 0; i < myRoles.length; i++) if (role == myRoles[i]) return true
            for (var i = 0; i < myRoles.length; i++) if (myRoles[i].meta.does(role)) return true
            
            var superMeta = this.superClass.meta
            
            // considering the case of inheriting from non-Joose classes
            if (this.superClass != Joose.Proto.Empty && superMeta && superMeta.meta && superMeta.meta.hasMethod('does')) return superMeta.does(role)
            
            return false
        },
        
        
        getMethods : function () {
            return this.stem.properties.methods
        },
        
        
        getAttributes : function () {
            return this.stem.properties.attributes
        },
        
        
        afterMutate : function () {
        },
        
        
        getCurrentMethod : function () {
            for (var wrapper = arguments.callee.caller, count = 0; wrapper && count < 5; wrapper = wrapper.caller, count++)
                if (wrapper.__METHOD__) return wrapper.__METHOD__
            
            return null
        }
        
        
    }).c;
    Joose.Managed.Role = new Joose.Managed.Class('Joose.Managed.Role', {
        
        isa                         : Joose.Managed.Class,
        
        have : {
            defaultSuperClass       : Joose.Proto.Empty,
            
            builderRole             : null,
            stemRole                : null
        },
        
        
        methods : {
            
            defaultConstructor : function () {
                return function () {
                    throw new Error("Roles cant be instantiated")
                }
            },
            
    
            processSuperClass : function () {
                if (this.superClass != this.defaultSuperClass) throw new Error("Roles can't inherit from anything")
            },
            
            
            getBuilderTarget : function () {
                if (!this.builderRole) {
                    this.builderRole = new this.constructor().c
                    this.builderClassCreated = true
                }
                
                return this.builderRole
            },
            
        
            getStemTarget : function () {
                if (!this.stemRole) {
                    this.stemRole = new this.constructor().c
                    this.stemClassCreated = true
                }
                
                return this.stemRole
            },
            
        
            addRequirement : function (methodName) {
                this.stem.properties.requirements.addProperty(methodName, {})
            }
            
        },
        
    
        stem : {
            methods : {
                
                apply : function () {
                },
                
                
                unapply : function () {
                }
            }
        },
        
        
        builder : {
            methods : {
                requires : function (targetClassMeta, info) {
                    Joose.A.each(Joose.O.wantArray(info), function (methodName) {
                        targetClassMeta.addRequirement(methodName)
                    }, this)
                }
            }
        }
        
    }).c;
    Joose.Managed.Attribute = new Joose.Managed.Class('Joose.Managed.Attribute', {
        
        isa : Joose.Managed.Property.Attribute,
        
        have : {
            is              : null,
            
            builder         : null,
            
            isPrivate       : false,
            
            role            : null,
            
            publicName      : null,
            setterName      : null,
            getterName      : null,
            
            //indicates the logical readableness/writeableness of the attribute
            readable        : false,
            writeable       : false,
            
            //indicates the physical presense of the accessor (may be absent for "combined" accessors for example)
            hasGetter       : false,
            hasSetter       : false,
            
            required        : false,
            
            canInlineSetRaw : true,
            canInlineGetRaw : true
        },
        
        
        after : {
            initialize : function () {
                var name = this.name
                
                this.publicName = name.replace(/^_+/, '')
                
                this.slot = this.isPrivate ? '$$' + name : name
                
                this.setterName = this.setterName || this.getSetterName()
                this.getterName = this.getterName || this.getGetterName()
                
                this.readable  = this.hasGetter = /^r/i.test(this.is)
                this.writeable = this.hasSetter = /^.w/i.test(this.is)
            }
        },
        
        
        override : {
            
            computeValue : function () {
                var init    = this.init
                
                if (Joose.O.isClass(init) || !Joose.O.isFunction(init)) this.SUPER()
            },
            
            
            preApply : function (targetClass) {
                targetClass.meta.extend({
                    methods : this.getAccessorsFor(targetClass)
                })
            },
            
            
            postUnApply : function (from) {
                from.meta.extend({
                    removeMethods : this.getAccessorsFrom(from)
                })
            }
            
        },
        
        
        methods : {
            
            getAccessorsFor : function (targetClass) {
                var targetMeta = targetClass.meta
                var setterName = this.setterName
                var getterName = this.getterName
                
                var methods = {}
                
                if (this.hasSetter && !targetMeta.hasMethod(setterName)) {
                    methods[setterName] = this.getSetter()
                    methods[setterName].ACCESSOR_FROM = this
                }
                
                if (this.hasGetter && !targetMeta.hasMethod(getterName)) {
                    methods[getterName] = this.getGetter()
                    methods[getterName].ACCESSOR_FROM = this
                }
                
                return methods
            },
            
            
            getAccessorsFrom : function (from) {
                var targetMeta = from.meta
                var setterName = this.setterName
                var getterName = this.getterName
                
                var setter = this.hasSetter && targetMeta.getMethod(setterName)
                var getter = this.hasGetter && targetMeta.getMethod(getterName)
                
                var removeMethods = []
                
                if (setter && setter.value.ACCESSOR_FROM == this) removeMethods.push(setterName)
                if (getter && getter.value.ACCESSOR_FROM == this) removeMethods.push(getterName)
                
                return removeMethods
            },
            
            
            getGetterName : function () {
                return 'get' + Joose.S.uppercaseFirst(this.publicName)
            },
    
    
            getSetterName : function () {
                return 'set' + Joose.S.uppercaseFirst(this.publicName)
            },
            
            
            getSetter : function () {
                var me      = this
                var slot    = me.slot
                
                if (me.canInlineSetRaw)
                    return function (value) {
                        this[ slot ] = value
                        
                        return this
                    }
                else
                    return function () {
                        return me.setRawValueTo.apply(this, arguments)
                    }
            },
            
            
            getGetter : function () {
                var me      = this
                var slot    = me.slot
                
                if (me.canInlineGetRaw)
                    return function (value) {
                        return this[ slot ]
                    }
                else
                    return function () {
                        return me.getRawValueFrom.apply(this, arguments)
                    }
            },
            
            
            getValueFrom : function (instance) {
                var getterName      = this.getterName
                
                if (this.readable && instance.meta.hasMethod(getterName)) return instance[ getterName ]()
                
                return this.getRawValueFrom(instance)
            },
            
            
            setValueTo : function (instance, value) {
                var setterName      = this.setterName
                
                if (this.writeable && instance.meta.hasMethod(setterName)) 
                    instance[ setterName ](value)
                else
                    this.setRawValueTo(instance, value)
            },
            
            
            initFromConfig : function (instance, config) {
                var name            = this.name
                
                var value, isSet = false
                
                if (config.hasOwnProperty(name)) {
                    value = config[name]
                    isSet = true
                } else {
                    var init    = this.init
                    
                    // simple function (not class) has been used as "init" value
                    if (Joose.O.isFunction(init) && !Joose.O.isClass(init)) {
                        
                        value = init.call(instance, config, name)
                        
                        isSet = true
                        
                    } else if (this.builder) {
                        
                        value = instance[ this.builder.replace(/^this\./, '') ](config, name)
                        isSet = true
                    }
                }
                
                if (isSet)
                    this.setRawValueTo(instance, value)
                else 
                    if (this.required) throw new Error("Required attribute [" + name + "] is missed during initialization of " + instance)
            }
        }
    
    }).c
    ;
    Joose.Managed.Attribute.Builder = new Joose.Managed.Role('Joose.Managed.Attribute.Builder', {
        
        
        have : {
            defaultAttributeClass : Joose.Managed.Attribute
        },
        
        builder : {
            
            methods : {
                
                has : function (targetClassMeta, info) {
                    Joose.O.eachOwn(info, function (props, name) {
                        if (typeof props != 'object' || props == null || props.constructor == / /.constructor) props = { init : props }
                        
                        props.meta = props.meta || targetClassMeta.defaultAttributeClass
                        
                        if (/^__/.test(name)) {
                            name = name.replace(/^_+/, '')
                            
                            props.isPrivate = true
                        }
                        
                        targetClassMeta.addAttribute(name, props.init, props)
                    }, this)
                },
                
                
                hasnot : function (targetClassMeta, info) {
                    this.havenot(targetClassMeta, info)
                },
                
                
                hasnt : function (targetClassMeta, info) {
                    this.hasnot(targetClassMeta, info)
                }
            }
                
        }
        
    }).c
    ;
    Joose.Managed.My = new Joose.Managed.Role('Joose.Managed.My', {
        
        have : {
            myClass                         : null,
            
            needToReAlias                   : false
        },
        
        
        methods : {
            createMy : function (extend) {
                var thisMeta = this.meta
                var isRole = this instanceof Joose.Managed.Role
                
                var myExtend = extend.my || {}
                delete extend.my
                
                // Symbiont will generally have the same meta class as its hoster, excepting the cases, when the superclass also have the symbiont. 
                // In such cases, the meta class for symbiont will be inherited (unless explicitly specified)
                
                var superClassMy    = this.superClass.meta.myClass
                
                if (!isRole && !myExtend.isa && superClassMy) myExtend.isa = superClassMy
                
    
                if (!myExtend.meta && !myExtend.isa) myExtend.meta = this.constructor
                
                var createdClass    = this.myClass = Class(myExtend)
                
                var c               = this.c
                
                c.prototype.my      = c.my = isRole ? createdClass : new createdClass({ HOST : c })
                
                this.needToReAlias = true
            },
            
            
            aliasStaticMethods : function () {
                this.needToReAlias = false
                
                var c           = this.c
                var myProto     = this.myClass.prototype
                
                Joose.O.eachOwn(c, function (property, name) {
                    if (property.IS_ALIAS) delete c[ name ] 
                })
                
                this.myClass.meta.stem.properties.methods.each(function (method, name) {
                    
                    if (!c[ name ])
                        (c[ name ] = function () {
                            return myProto[ name ].apply(c.my, arguments)
                        }).IS_ALIAS = true
                })
            }
        },
        
        
        override : {
            
            extend : function (props) {
                var myClass = this.myClass
                
                if (!myClass && this.superClass.meta.myClass) this.createMy(props)
                
                if (props.my) {
                    if (!myClass) 
                        this.createMy(props)
                    else {
                        this.needToReAlias = true
                        
                        myClass.meta.extend(props.my)
                        delete props.my
                    }
                }
                
                this.SUPER(props)
                
                if (this.needToReAlias && !(this instanceof Joose.Managed.Role)) this.aliasStaticMethods()
            }  
        },
        
        
        before : {
            
            addRole : function () {
                var myStem
                
                Joose.A.each(arguments, function (arg) {
                    
                    if (!arg) throw new Error("Attempt to consume an undefined Role into [" + this.name + "]")
                    
                    //instanceof Class to allow treat classes as roles
                    var role = (arg.meta instanceof Joose.Managed.Class) ? arg : arg.role
                    
                    if (role.meta.meta.hasAttribute('myClass') && role.meta.myClass) {
                        
                        if (!this.myClass) {
                            this.createMy({
                                my : {
                                    does : role.meta.myClass
                                }
                            })
                            return
                        }
                        
                        myStem = this.myClass.meta.stem
                        if (!myStem.opened) myStem.open()
                        
                        myStem.addComposeInfo(role.my.meta.stem)
                    }
                }, this)
                
                if (myStem) {
                    myStem.close()
                    
                    this.needToReAlias = true
                }
            },
            
            
            removeRole : function () {
                if (!this.myClass) return
                
                var myStem = this.myClass.meta.stem
                myStem.open()
                
                Joose.A.each(arguments, function (role) {
                    if (role.meta.meta.hasAttribute('myClass') && role.meta.myClass) {
                        myStem.removeComposeInfo(role.my.meta.stem)
                        
                        this.needToReAlias = true
                    }
                }, this)
                
                myStem.close()
            }
            
        }
        
    }).c;
    Joose.Namespace = Joose.stub()
    
    Joose.Namespace.Able = new Joose.Managed.Role('Joose.Namespace.Able', {
    
        have : {
            bodyFunc                : null
        },
        
        
        before : {
            extend : function (extend) {
                if (extend.body) {
                    this.bodyFunc = extend.body
                    delete extend.body
                }
            }
        },
        
        
        after: {
            
            afterMutate : function () {
                var bodyFunc = this.bodyFunc
                delete this.bodyFunc
                
                if (bodyFunc) Joose.Namespace.Manager.my.executeIn(this.c, bodyFunc)
            }
        }
        
    }).c;
    Joose.Managed.Bootstrap = new Joose.Managed.Role('Joose.Managed.Bootstrap', {
        
        does   : [ Joose.Namespace.Able, Joose.Managed.My, Joose.Managed.Attribute.Builder ]
        
    }).c
    ;
    Joose.Meta = Joose.stub()
    
    
    Joose.Meta.Object = new Joose.Proto.Class('Joose.Meta.Object', {
        
        isa             : Joose.Proto.Object
        
    }).c
    
    
    ;
    Joose.Meta.Class = new Joose.Managed.Class('Joose.Meta.Class', {
        
        isa                         : Joose.Managed.Class,
        
        does                        : Joose.Managed.Bootstrap,
        
        have : {
            defaultSuperClass       : Joose.Meta.Object
        }
        
    }).c
    
    ;
    Joose.Meta.Role = new Joose.Meta.Class('Joose.Meta.Role', {
        
        isa                         : Joose.Managed.Role,
        
        does                        : Joose.Managed.Bootstrap
        
    }).c;
    Joose.Namespace.Keeper = new Joose.Meta.Class('Joose.Namespace.Keeper', {
        
        isa         : Joose.Meta.Class,
        
        have        : {
            externalConstructor             : null
        },
        
        
        methods: {
            
            defaultConstructor: function () {
                
                return function () {
                    //constructors should assume that meta is attached to 'arguments.callee' (not to 'this') 
                    var thisMeta = arguments.callee.meta
                    
                    if (thisMeta instanceof Joose.Namespace.Keeper) throw new Error("Module [" + thisMeta.c + "] may not be instantiated. Forgot to 'use' the class with the same name?")
                    
                    var externalConstructor = thisMeta.externalConstructor
                    
                    if (typeof externalConstructor == 'function') {
                        
                        externalConstructor.meta = thisMeta
                        
                        return externalConstructor.apply(this, arguments)
                    }
                    
                    throw "NamespaceKeeper of [" + thisMeta.name + "] was planted incorrectly."
                }
            },
            
            
            //withClass should be not constructed yet on this stage (see Joose.Proto.Class.construct)
            //it should be on the 'constructorOnly' life stage (should already have constructor)
            plant: function (withClass) {
                var keeper = this.c
                
                keeper.meta = withClass.meta
                
                keeper.meta.c = keeper
                keeper.meta.externalConstructor = withClass
            }
        }
        
    }).c
    
    
    ;
    Joose.Namespace.Manager = new Joose.Managed.Class('Joose.Namespace.Manager', {
        
        have : {
            current     : null
        },
        
        
        methods : {
            
            initialize : function () {
                this.current    = [ Joose.top ]
            },
            
            
            getCurrent: function () {
                return this.current[0]
            },
            
            
            executeIn : function (ns, func) {
                var current = this.current
                
                current.unshift(ns)
                var res = func.call(ns, ns)
                current.shift()
                
                return res
            },
            
            
            earlyCreate : function (name, metaClass, props) {
                props.constructorOnly = true
                
                return new metaClass(name, props).c
            },
            
            
            //this function establishing the full "namespace chain" (including the last element)
            create : function (nsName, metaClass, extend) {
                
                //if no name provided, then we creating an anonymous class, so just skip all the namespace manipulations
                if (!nsName) return new metaClass(nsName, extend).c
                
                var me = this
                
                if (/^\./.test(nsName)) return this.executeIn(Joose.top, function () {
                    return me.create(nsName.replace(/^\./, ''), metaClass, extend)
                })
                
                var props   = extend || {}
                
                var parts   = Joose.S.saneSplit(nsName, '.')
                var object  = this.getCurrent()
                var soFar   = object == Joose.top ? [] : Joose.S.saneSplit(object.meta.name, '.')
                
                for (var i = 0; i < parts.length; i++) {
                    var part        = parts[i]
                    var isLast      = i == parts.length - 1
                    
                    if (part == "meta" || part == "my" || !part) throw "Module name [" + nsName + "] may not include a part called 'meta' or 'my' or empty part."
                    
                    var cur =   object[part]
                    
                    soFar.push(part)
                    
                    var soFarName       = soFar.join(".")
                    var needFinalize    = false
                    var nsKeeper
                    
                    // if the namespace segment is empty
                    if (typeof cur == "undefined") {
                        if (isLast) {
                            // perform "early create" which just fills the namespace segment with right constructor
                            // this allows us to have a right constructor in the namespace segment when the `body` will be called
                            nsKeeper        = this.earlyCreate(soFarName, metaClass, props)
                            needFinalize    = true
                        } else
                            nsKeeper        = new Joose.Namespace.Keeper(soFarName).c
                        
                        object[part] = nsKeeper
                        
                        cur = nsKeeper
                        
                    } else if (isLast && cur && cur.meta) {
                        
                        var currentMeta = cur.meta
                        
                        if (metaClass == Joose.Namespace.Keeper)
                            //`Module` over something case - extend the original
                            currentMeta.extend(props)
                        else {
                            
                            if (currentMeta instanceof Joose.Namespace.Keeper) {
                                
                                currentMeta.plant(this.earlyCreate(soFarName, metaClass, props))
                                
                                needFinalize = true
                            } else
                                throw new Error("Double declaration of [" + soFarName + "]")
                        }
                        
                    } else 
                        if (isLast && !(cur && cur.meta && cur.meta.meta)) throw "Trying to setup module " + soFarName + " failed. There is already something: " + cur
    
                    // hook to allow embedd resource into meta
                    if (isLast) this.prepareMeta(cur.meta)
                        
                    if (needFinalize) cur.meta.construct(props)
                        
                    object = cur
                }
                
                return object
            },
            
            
            prepareMeta : function () {
            },
            
            
            prepareProperties : function (name, props, defaultMeta, callback) {
                if (name && typeof name != 'string') {
                    props   = name
                    name    = null
                }
                
                var meta
                
                if (props && props.meta) {
                    meta = props.meta
                    delete props.meta
                }
                
                if (!meta)
                    if (props && typeof props.isa == 'function' && props.isa.meta)
                        meta = props.isa.meta.constructor
                    else
                        meta = defaultMeta
                
                return callback.call(this, name, meta, props)
            },
            
            
            getDefaultHelperFor : function (metaClass) {
                var me = this
                
                return function (name, props) {
                    return me.prepareProperties(name, props, metaClass, function (name, meta, props) {
                        return me.create(name, meta, props)
                    })
                }
            },
            
            
            register : function (helperName, metaClass, func) {
                var me = this
                
                if (this.meta.hasMethod(helperName)) {
                    
                    var helper = function () {
                        return me[ helperName ].apply(me, arguments)
                    }
                    
                    if (!Joose.top[ helperName ])   Joose.top[ helperName ]         = helper
                    if (!Joose[ helperName ])       Joose[ helperName ]             = helper
                    
                    if (Joose.is_NodeJS && typeof exports != 'undefined')            exports[ helperName ]    = helper
                    
                } else {
                    var methods = {}
                    
                    methods[ helperName ] = func || this.getDefaultHelperFor(metaClass)
                    
                    this.meta.extend({
                        methods : methods
                    })
                    
                    this.register(helperName)
                }
            },
            
            
            Module : function (name, props) {
                return this.prepareProperties(name, props, Joose.Namespace.Keeper, function (name, meta, props) {
                    if (typeof props == 'function') props = { body : props }    
                    
                    return this.create(name, meta, props)
                })
            }
        }
        
    }).c
    
    Joose.Namespace.Manager.my = new Joose.Namespace.Manager()
    
    Joose.Namespace.Manager.my.register('Class', Joose.Meta.Class)
    Joose.Namespace.Manager.my.register('Role', Joose.Meta.Role)
    Joose.Namespace.Manager.my.register('Module')
    
    
    // for the rest of the package
    var Class       = Joose.Class
    var Role        = Joose.Role
    ;
    Role('Joose.Attribute.Delegate', {
        
        have : {
            handles : null
        },
        
        
        override : {
            
            eachDelegate : function (handles, func, scope) {
                if (typeof handles == 'string') return func.call(scope, handles, handles)
                
                if (handles instanceof Array)
                    return Joose.A.each(handles, function (delegateTo) {
                        
                        func.call(scope, delegateTo, delegateTo)
                    })
                    
                if (handles === Object(handles))
                    Joose.O.eachOwn(handles, function (delegateTo, handleAs) {
                        
                        func.call(scope, handleAs, delegateTo)
                    })
            },
            
            
            getAccessorsFor : function (targetClass) {
                var targetMeta  = targetClass.meta
                var methods     = this.SUPER(targetClass)
                
                var me      = this
                
                this.eachDelegate(this.handles, function (handleAs, delegateTo) {
                    
                    if (!targetMeta.hasMethod(handleAs)) {
                        var handler = methods[ handleAs ] = function () {
                            var attrValue = me.getValueFrom(this)
                            
                            return attrValue[ delegateTo ].apply(attrValue, arguments)
                        }
                        
                        handler.ACCESSOR_FROM = me
                    }
                })
                
                return methods
            },
            
            
            getAccessorsFrom : function (from) {
                var methods = this.SUPER(from)
                
                var me          = this
                var targetMeta  = from.meta
                
                this.eachDelegate(this.handles, function (handleAs) {
                    
                    var handler = targetMeta.getMethod(handleAs)
                    
                    if (handler && handler.value.ACCESSOR_FROM == me) methods.push(handleAs)
                })
                
                return methods
            }
        }
    })
    
    ;
    Role('Joose.Attribute.Trigger', {
        
        have : {
            trigger        : null
        }, 
    
        
        after : {
            initialize : function() {
                if (this.trigger) {
                    if (!this.writeable) throw new Error("Can't use `trigger` for read-only attributes")
                    
                    this.hasSetter = true
                }
            }
        },
        
        
        override : {
            
            getSetter : function() {
                var original    = this.SUPER()
                var trigger     = this.trigger
                
                if (!trigger) return original
                
                var me      = this
                var init    = Joose.O.isFunction(me.init) ? null : me.init
                
                return function () {
                    var oldValue    = me.hasValue(this) ? me.getValueFrom(this) : init
                    
                    var res         = original.apply(this, arguments)
                    
                    trigger.call(this, me.getValueFrom(this), oldValue)
                    
                    return res
                }
            }
        }
    })    
    
    ;
    Role('Joose.Attribute.Lazy', {
        
        
        have : {
            lazy        : null
        }, 
        
        
        before : {
            computeValue : function () {
                if (typeof this.init == 'function' && this.lazy) {
                    this.lazy = this.init    
                    delete this.init    
                }
            }
        },
        
        
        after : {
            initialize : function () {
                if (this.lazy) this.readable = this.hasGetter = true
            }
        },
        
        
        override : {
            
            getGetter : function () {
                var original    = this.SUPER()
                var lazy        = this.lazy
                
                if (!lazy) return original
                
                var me      = this    
                
                return function () {
                    if (!me.hasValue(this)) {
                        var initializer = typeof lazy == 'function' ? lazy : this[ lazy.replace(/^this\./, '') ]
                        
                        me.setValueTo(this, initializer.apply(this, arguments))
                    }
                    
                    return original.call(this)    
                }
            }
        }
    })
    
    ;
    Role('Joose.Attribute.Accessor.Combined', {
        
        
        have : {
            isCombined        : false
        }, 
        
        
        after : {
            initialize : function() {
                this.isCombined = this.isCombined || /..c/i.test(this.is)
                
                if (this.isCombined) {
                    this.slot = '$$' + this.name
                    
                    this.hasGetter = true
                    this.hasSetter = false
                    
                    this.setterName = this.getterName = this.publicName
                }
            }
        },
        
        
        override : {
            
            getGetter : function() {
                var getter    = this.SUPER()
                
                if (!this.isCombined) return getter
                
                var setter    = this.getSetter()
                
                var me = this
                
                return function () {
                    
                    if (!arguments.length) {
                        if (me.readable) return getter.call(this)
                        throw new Error("Call to getter of unreadable attribute: [" + me.name + "]")
                    }
                    
                    if (me.writeable) return setter.apply(this, arguments)
                    
                    throw new Error("Call to setter of read-only attribute: [" + me.name + "]")    
                }
            }
        }
        
    })
    
    ;
    Joose.Managed.Attribute.meta.extend({
        does : [ Joose.Attribute.Delegate, Joose.Attribute.Trigger, Joose.Attribute.Lazy, Joose.Attribute.Accessor.Combined ]
    })            
    
    ;
    Role('Joose.Meta.Singleton', {
        
        has : {
            forceInstance           : Joose.I.Object,
            instance                : null
        },
        
        
        
        override : {
            
            defaultConstructor : function () {
                var meta        = this
                var previous    = this.SUPER()
                
                this.adaptConstructor(previous)
                
                return function (forceInstance, params) {
                    if (forceInstance == meta.forceInstance) return previous.apply(this, params) || this
                    
                    var instance = meta.instance
                    
                    if (instance) {
                        if (meta.hasMethod('configure')) instance.configure.apply(instance, arguments)
                    } else
                        meta.instance = new meta.c(meta.forceInstance, arguments)
                        
                    return meta.instance
                }
            }        
        }
        
    
    })
    
    
    Joose.Namespace.Manager.my.register('Singleton', Class({
        isa     : Joose.Meta.Class,
        meta    : Joose.Meta.Class,
        
        does    : Joose.Meta.Singleton
    }))
    ;
    ;
    }();;
    


Class('JooseX.Namespace.Depended.Manager', {
    
    my : {
    
        have : {
            
            INC                             : [ 'lib', '/jsan' ],
            
            disableCaching                  : true,
            
            resources                       : {},
            
            resourceTypes                   : {},
            
            ANONYMOUS_RESOURCE_COUNTER      : 0
        },
    
        
        
        methods : {
            
            //get own resource of some thing (resource will be also attached to that abstract thing)
            //if the something is requesting own resource its considered loaded
            getMyResource : function (type, token, me) {
                var resource = this.getResource({
                    type : type,
                    token : token
                })
                
                if (resource.attachedTo && resource.attachedTo != me) throw resource + " is already attached to [" + resource.attachedTo + "]"
                
                resource.attachedTo     = me
                resource.loaded         = true
                resource.loading        = false
                
                return resource
            },
            
            
            getResource : function (descriptor) {
                
                if (typeof descriptor == 'object') {
                    var type                = descriptor.type = descriptor.type || 'javascript'
                    var token               = descriptor.token
                    var requiredVersion     = descriptor.version
                    
                    delete descriptor.version
                    
                } else 
                    if (typeof descriptor == 'string') {
                    
                        var match = /^(\w+):\/\/(.+)/.exec(descriptor)
                        
                        if (match) {
                            // type & token are explicitly specified
                            type    = match[1]
                            token   = match[2]
                            
                            if (type == 'http' || type == 'https') {
                                token   = type + '://' + token
                                type    = 'javascript'
                            }
                        } else {
                            // no type specified
                            token = descriptor
                            
                            type = /\//.test(token) || /\.js$/.test(token) ? 'javascript' : 'joose'
                        }
                    }
                    
                if (!token) {
                    token       = '__ANONYMOUS_RESOURCE__' + this.ANONYMOUS_RESOURCE_COUNTER++
                    descriptor  = undefined
                }
                
                var id = type + '://' + token
                
                var resource = this.resources[id]
                
                if (!resource) {
                    var resourceClass = this.resourceTypes[type]
                    if (!resourceClass) throw new Error("Unknown resource type: [" + type + "]")
                    
                    resource = this.resources[id] = new resourceClass(typeof descriptor == 'object' ? descriptor : { 
                        token : token,
                        
                        type : type
                    })
                }
                
                resource.setRequiredVersion(requiredVersion)
                
                return resource
            },
            
            
            registerResourceClass : function (typeName, resourceClass) {
                this.resourceTypes[typeName] = resourceClass
            },
            
            
            use : function (dependenciesInfo, callback, scope) {
                Class({
                    use    : dependenciesInfo,
                    
                    body   : function () {
                        if (callback) Joose.Namespace.Manager.my.executeIn(Joose.top, function (ns) {
                            callback.call(scope || this, ns)
                        })
                    }
                })
            },
            
            
            getINC : function () {
                var INC         = this.INC
                var original    = use.__ORIGINAL__
                var paths       = use.paths
                
                // user have modified the `use.path` with direct assignment - return `use.paths`
                if (INC == original && paths != original) return paths
                
                // user have modified the `JooseX.Namespace.Depended.Manager.my.INC` with direct assignment - return it
                if (INC != original && paths == original) return INC
                
                if (INC != original && paths != original) throw "Both INC sources has been modified"
                
                // user was only using the in-place array mutations - return any
                return INC
            }
        }
    }
})

use = function (dependenciesInfo, callback, scope) {
    JooseX.Namespace.Depended.Manager.my.use(dependenciesInfo, callback, scope) 
}

use.paths = use.__ORIGINAL__ = JooseX.Namespace.Depended.Manager.my.INC


Joose.I.FutureClass = function (className) { 
    return function () { 
        return eval(className) 
    } 
}


/**

Name
====


JooseX.Namespace.Depended.Manager - A global collection of all resources


SYNOPSIS
========

        JooseX.Namespace.Depended.Manager.my.registerResourceClass('custom-type', JooseX.Namespace.Depended.Resource.Custom)
        

DESCRIPTION
===========

`JooseX.Namespace.Depended.Manager` is a global collection of all resources. 

**Note:** Its a pure [static](http://joose.github.com/Joose/doc/html/Joose/Manual/Static.html) class - all its methods and properties are static.


METHODS
=======

### registerResourceClass

> `void registerResourceClass(String type, Class constructor)`

> After you've created your custom resource class, you need to register it with call to this method.

> Then you can refer to new resources with the following descriptors: 

                {
                    type    : 'custom-type',
                    token   : 'some-token'
                }



GETTING HELP
============

This extension is supported via github issues tracker: <http://github.com/SamuraiJack/JooseX-Namespace-Depended-Manager/issues>

For general Joose questions you can also visit [#joose](http://webchat.freenode.net/?randomnick=1&channels=joose&prompt=1) on freenode or the mailing list at <http://groups.google.com/group/joose-js>
 


SEE ALSO
========

Authoring [JooseX.Namespace.Depended](Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](Resource.html)

General documentation for Joose: <http://joose.github.com/Joose/>


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at [http://github.com/SamuraiJack/JooseX-Namespace-Depended-Manager/issues](http://github.com/SamuraiJack/JooseX-Namespace-Depended-Manager/issues)



AUTHORS
=======

Nickolay Platonov [nplatonov@cpan.org](mailto:nplatonov@cpan.org)



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/
;
Class('JooseX.Namespace.Depended.Resource', {
    
    has : {
        
        attachedTo          : null,
        
        type                : null,
        token               : null,
        
        id                  : null,
        
        loading             : false,
        loaded              : false,
        ready               : false,
        
        presence            : null,
        readyness           : null,
        
        loadedFromURL       : null,
        
        readyListeners      : Joose.I.Array,
        
        dependencies        : Joose.I.Object,
        
        onBeforeReady       : { is : 'rw', init : null },
        readyDelegated      : false,
        
        version             : { is : 'rw', init : null },
        requiredVersion     : { is : 'rw', init : null },
        
        hasReadyCheckScheduled  : false
    },
    
    
    after: {
        
        initialize: function () {
            if (!this.id) this.id = this.type + '://' + this.token
        }
        
    },

    
    
    methods: {
        
        setOnBeforeReady : function (func) {
            if (this.onBeforeReady) throw "Can't redefine 'onBeforeReady' for " + this
            
            this.onBeforeReady = func
        },
        
        
        setVersion : function (version) {
            if (!version) return
            
            if (this.version && this.version != version) throw new Error("Cant redefine version of " + this)
            
            var requiredVersion = this.requiredVersion
            
            if (requiredVersion && version < requiredVersion) throw new Error("Versions conflict on " + this + " required [" + requiredVersion + "], got [" + version + "]")
                
            this.version = version
        },
        
        
        setRequiredVersion : function (version) {
            if (!version) return
            
            var requiredVersion = this.requiredVersion
            
            if (!requiredVersion || version > requiredVersion) 
                if (this.isLoaded() || this.loading)
                    throw "Cant increase required version - " + this + " is already loaded"
                else
                    this.requiredVersion = version
        },
        
        
        toString : function () {
            return "Resource: id=[" + this.id + "], type=[" + this.meta.name + "]"
        },
        
        
        addDescriptor : function (descriptor) {
            var resource = JooseX.Namespace.Depended.Manager.my.getResource(descriptor)
            
            var dependencies    = this.dependencies
            var resourceID      = resource.id
            
            //if there is already such dependency or the resource is ready
            if (dependencies[ resourceID ] || resource.isReady()) return
            
            var me = this
            //pushing listener to the end(!) of the list
            resource.readyListeners.push(function () {
                
                delete dependencies[ resourceID ]
                me.checkReady()
            })
            
            //adding dependency
            dependencies[ resourceID ] = resource
            
            //we are not ready, since there are depedencies to load                
            this.ready = false
        },
        
        
        handleDependencies : function () {
            // || {} required for classes on which this Role was applied after they were created - they have this.dependencies not initialized
            Joose.O.eachOwn(this.dependencies || {}, function (resource) {
                resource.handleLoad()
            })
            
            this.checkReady()
        },
        
        
        checkReady : function () {
            if (!Joose.O.isEmpty(this.dependencies) || this.hasReadyCheckScheduled) return
            
            if (this.onBeforeReady) {
                
                if (!this.readyDelegated) {
                    this.readyDelegated = true
                    
                    var me = this
                    
                    this.onBeforeReady(function(){
                        me.fireReady()
                    }, me)
                }
            } else 
                this.fireReady()
        },
        
        
        fireReady: function () {
            this.ready      = true
            
            var listeners   = this.readyListeners
            
            this.readyListeners = []
            
            Joose.A.each(listeners, function (listener) {
                listener()
            })
        },
        
        
        isReady : function () {
            if (!this.isLoaded()) return false
            
            var isReady = false
            
            try {
                isReady = this.readyness()
            } catch (e) {
            }
            
            return isReady || this.ready
        },
        
        
        isLoaded : function () {
            var isPresent = false
            
            try {
                isPresent = this.presence()
            } catch (e) {
            }
            
            return isPresent || this.loaded
        },
        
        
        handleLoad: function() {
            
            if (this.isLoaded()) {
                this.checkReady()
                return
            }
            
            if (this.loading) return
            this.loading = true
            
            var urls = Joose.O.wantArray(this.getUrls())
            
            var me = this
            
            
            // this delays the 'checkReady' until the resourse will be *fully* materialized
            // *fully* means that even the main class of the resource is already "ready"
            // the possible other classes in the same file could be not
            // see 110_several_classes_in_file.t.js, 120_script_tag_transport.t.js for example
            me.hasReadyCheckScheduled = true
            
            var onsuccess = function (resourceBlob, url) {
                me.loaded = true
                me.loading = false
                
                me.loadedFromURL = url
                
                Joose.Namespace.Manager.my.executeIn(Joose.top, function () {
                    
                    me.materialize(resourceBlob, url)
                })
                
                me.hasReadyCheckScheduled = false
                
                // handle the dependency of the class after its materialization completition
                me.handleDependencies()
            }
            
            var onerror = function (e) {
                //if no more urls
                if (!urls.length) throw new Error(me + " not found") 
                
                me.load(urls.shift(), onsuccess, onerror)
            }
            
            this.load(urls.shift(), onsuccess, onerror)
        },
        

        getUrls: function () {
            throw "Abstract resource method 'getUrls' was called"
        },
        
        
        load : function (url, onsuccess, onerror) {
            throw "Abstract resource method 'load' was called"
        },
        
        
        materialize : function (resourceBlob) {
            throw "Abstract resource method 'materialize' was called"
        }
        
    }
})


/**

Name
====


JooseX.Namespace.Depended.Resource - Abstract resource class 


SYNOPSIS
========
        
        //mostly for subclassing only
        Class("JooseX.Namespace.Depended.Resource.JavaScript", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Resource` is an abstract resource class. Its not supposed to be used directly, instead you should use
one of its subclasses.


ATTRIBUTES
==========

### attachedTo

> `Object attachedTo`

> An arbitrary object to which this resource is attached (its a corresponding class in JooseX.Namespace.Depended)


### type

> `String type`

> A type of resource  - plain string. `JooseX.Namespace.Depended.Manager` maintain a collection of resource types, accessible 


### token

> `String token`

> A token of resource  - plain string with arbitrary semantic. Each subclass should provide this semantic along with `token -> url` conertion method (locator)  


### id

> `String id`

> An id of resource - is computed as `type + '://' + token'


### loading

> `Boolean loading`

> A sign whether this resource is currently loading

  
### loaded

> `Boolean loaded`

> A sign whether this resource is already loaded


### ready

> `Boolean ready`

> A sign whether this resource is considered ready. Resource is ready, when its loaded, and all its dependencies are ready.


### loadedFromURL

> `String loadedFromURL`

> An url, from which the resource was loaded.


### readyListeners

> `Array[Function] readyListeners`

> An array of functions, which will be called after this resource becomes ready. Functions will be called sequentially. 


### dependencies

> `Object dependencies`

> An object containing the dependencies of this resource. Keys are the `id`s of resources and the values - the resource instances itself.

 
### onBeforeReady

> `Function onBeforeReady`

> A function, which will be called, right after the all dependencies of the resource became ready, but before its own `readyListeners` will be called.
It supposed to perform any needed additional actions to post-process the loaded resource.

> Function will receive two arguments - the 1st is the callback, which should be called when `onBeforeReady` will finish its work. 2nd is the resource instance.

  
### version

> `r/w Number version`

> A version of this resource. Currently is handled as Number, this may change in future releases.

  
### requiredVersion

> `r/w Number requiredVersion`

> A *requiredVersion* version of this resource. Required here means the maximum version from all references to this resource. 



METHODS
=======

### addDescriptor

> `void addDescriptor(Object|String descriptor)`

> Add the resource, described with passed descriptor as the dependency for this resource.


### getUrls

> `String|Array[String] getUrls()`

> Abstract method, will throw an exception if not overriden. It should return the array of urls (or a single url) from which this resource can be potentially loaded. 
This method should take into account the `use.paths` setting


### load

> `void load(String url, Function onsuccess, Function onerror)`

> Abstract method, will throw an exception if not overriden. It should load the content of the resource from the passed `url`. If there was an error during loading
(for example file not found) should not throw the exception. Instead, should call the `onerror` continuation with it (exception instance).

> After successfull loading, should call the `onsuccess` continuation with the resource content as 1st argument, and `url` as 2nd: `onsuccess(text, url)`


### materialize

> `void materialize(String resourceBlob, String url)`

> Abstract method, will throw an exception if not overriden. It should "materialize" the resource. The concrete semantic of this action is determined by resource nature.
For example this method can create some tag in the DOM tree, or execute the code or something else.

> Currently this method is supposed to operate synchronously, this may change in future releases. 
 

SEE ALSO
========

Web page of this package: <http://github.com/SamuraiJack/JooseX-Namespace-Depended-Resource/>

General documentation for Joose: <http://joose.github.com/Joose/>


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at <http://github.com/SamuraiJack/JooseX-Namespace-Depended-Resource/issues>



AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/
;
Role('JooseX.Namespace.Depended.Materialize.Eval', {
    
    requires : [ 'handleLoad' ],
    
    methods : {
        
        materialize : function (resourceBlob, url) {
            // "indirect eval" call
            try {
              (window.execScript || window.eval)(resourceBlob)
            } catch (e) {
              
              var msg = e.toString();
              if (e instanceof Error) {
                 msg = "Error "+e.name+" "+e.message;
              }
              alert("Fehler in: "+url+" "+msg);
              
              throw e;
            }
        }
    }
})

/**

Name
====


JooseX.Namespace.Depended.Materialize.Eval - materializator, which treat the resource content as JavaScript code, and use `eval` function to evalute it 


SYNOPSIS
========
        
        //generally for consuming only
        
        Class("JooseX.Namespace.Depended.Resource.Custom", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            does : [ JooseX.Namespace.Depended.Materialize.Eval, ...]
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Materialize.Eval` is a materializator role. It provide the implementation of `materialize` method. 


SEE ALSO
========

Authoring [JooseX.Namespace.Depended](../Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](../Resource.html)


General documentation for Joose: <http://joose.github.com/Joose/>


AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Class('JooseX.Namespace.Depended.Resource.JavaScript', {
    
    isa : JooseX.Namespace.Depended.Resource,
    
    has : {
        
        hasDirectUrl    : false
    },
    
    after: {
        
        initialize: function () {
            var me      = this
            
            // backward compat
            if (this.type == 'nonjoose') this.type = 'javascript'
            
            
            var presence = this.presence
            
            if (typeof presence == 'string') this.presence = function () {
                return eval(presence)
            }
            
            if (!presence) this.presence = function () {
                return eval(me.token)
            }
            
            if (!this.readyness) this.readyness = this.presence
        }
        
    },

    
    methods : {
        
        BUILD : function (config) {
            var token = config.token
            
            var match = /^=(.*)/.exec(token)
            
            if (match) {
                this.hasDirectUrl   = true
                
                token               = match[1]
            }
            
            if (/^http/.test(token)) {
                this.hasDirectUrl   = true
                
                config.trait        = JooseX.Namespace.Depended.Transport.ScriptTag
            }
            
            if (/^\//.test(token)) this.hasDirectUrl   = true
                
            return config
        },
        
        
        getUrls : function () {
            var url = this.token
            
            if (this.hasDirectUrl) return [ url ]
            
            var manager = JooseX.Namespace.Depended.Manager.my
            
            return Joose.A.map(manager.getINC(), function (libroot) {
                libroot = libroot.replace(/\/$/, '')
                
                return [ libroot ].concat(url).join('/') + (manager.disableCaching ? '?disableCaching=' + new Date().getTime() : '')
            })
        }
    }

})

JooseX.Namespace.Depended.Manager.my.registerResourceClass('javascript',    JooseX.Namespace.Depended.Resource.JavaScript)
JooseX.Namespace.Depended.Manager.my.registerResourceClass('nonjoose',      JooseX.Namespace.Depended.Resource.JavaScript)
;
Class('JooseX.Namespace.Depended.Resource.JooseClass', {
    
    isa : JooseX.Namespace.Depended.Resource.JavaScript,
    
    // NOTE : we don't add the default materialization and transport roles here - they'll be added
    // in one of the Bootstrap/*.js files
    
    after: {
        
        initialize: function () {
            var me = this
            
            this.presence = function () {
                var c = Joose.S.strToClass(me.token)
                
                return c && c.meta.resource
            }
            
            this.readyness = function () {
                var c = eval(me.token)
                
                return c && c.meta.resource.ready
            }
        }
        
    },
    
    
    methods : {
        
        addDescriptor : function (descriptor) {
            if (typeof descriptor == 'object' && !descriptor.token) 
                Joose.O.eachOwn(descriptor, function (version, name) {
                    this.addDescriptor({
                        type : 'joose',
                        token : name,
                        version : version
                    })
                }, this)
            else
                this.SUPER(descriptor)
        },
        
        
        getUrls : function () {
            var urls = []
            var className = this.token.split('.')
            
            var manager = JooseX.Namespace.Depended.Manager.my
            
            return Joose.A.map(manager.getINC(), function (libroot) {
                libroot = libroot.replace(/\/$/, '')
                
                return [ libroot ].concat(className).join('/') + '.js' + (manager.disableCaching ? '?disableCaching=' + new Date().getTime() : '')
            })
        }
    }

})

JooseX.Namespace.Depended.Manager.my.registerResourceClass('joose', JooseX.Namespace.Depended.Resource.JooseClass);
;
Class("JooseX.SimpleRequest", {

    have : {
    	req : null
	},

    
    methods: {
    	
        initialize: function () {
            if (window.XMLHttpRequest)
                this.req = new XMLHttpRequest()
            else
                this.req = new ActiveXObject("Microsoft.XMLHTTP")
        },
        
        
        getText: function (urlOrOptions, async, callback, scope) {
            var req = this.req
            
            var headers
            var url
            
            if (typeof urlOrOptions != 'string') {
                headers = urlOrOptions.headers
                url = urlOrOptions.url
                async = async || urlOrOptions.async
                callback = callback || urlOrOptions.callback
                scope = scope || urlOrOptions.scope
            } else url = urlOrOptions
            
            req.open('GET', url, async || false)
            
            if (headers) Joose.O.eachOwn(headers, function (value, name) {
                req.setRequestHeader(name, value)
            })
            
            try {
                req.onreadystatechange = function (event) {  
                    if (async && req.readyState == 4) {  
                        // status is set to 0 for failed cross-domain requests.. 
                        if (req.status == 200 /*|| req.status == 0*/) callback.call(scope || this, true, req.responseText)
                        else callback.call(scope || this, false, "File not found: " + url)
                    }  
                };  
                req.send(null)
            } catch (e) {
                throw "File not found: " + url
            }
            
            if (!async)
                if (req.status == 200 || req.status == 0) return req.responseText; else throw "File not found: " + url
            
            return null
        }
    }
})
;
Role('JooseX.Namespace.Depended.Materialize.ScriptTag', {
    
    requires : [ 'handleLoad' ],
    
    methods : {
        
        materialize : function (resourceBlob) {
            var loaderNode = document.createElement("script")
            
            loaderNode.text = resourceBlob
            
            //adding to body, because Safari do not create HEAD for iframe's documents
            document.body.appendChild(loaderNode)
        }
    }
})
;
Role('JooseX.Namespace.Depended.Transport.XHRAsync', {
    
    requires : [ 'handleLoad' ],
    
    override : {
        
        load: function (url, onsuccess, onerror) {
            var req = new JooseX.SimpleRequest()
            
            try {
                req.getText(url, true, function (success, text) {
                    
                    if (!success) { 
                        onerror(this + " not found") 
                        return 
                    }
                    
                    onsuccess(text, url)
                })
            } catch (e) {
                onerror(e)
            }
        }
    }
})


/**

Name
====


JooseX.Namespace.Depended.Transport.XHRAsync - transport, which use the asynchronous XHR request for resource loading 


SYNOPSIS
========
        
        //generally for consuming only
        
        Class("JooseX.Namespace.Depended.Resource.Custom", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            does : [ JooseX.Namespace.Depended.Transport.XHRAsync, ...]
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Transport.XHRAsync` is a transport role. It provide the implementation of `load` method, which use the 
asynchronous XHR request for resource loading. 



SEE ALSO
========

Authoring [JooseX.Namespace.Depended](../Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](../Resource.html)


General documentation for Joose: <http://joose.github.com/Joose/>


AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Role('JooseX.Namespace.Depended.Transport.ScriptTag', {
    
    requires : [ 'handleLoad' ],
    
    
    methods : {
        
        getScriptTag : function () {
            
        }
    },
    
    
    override : {
        
        load: function (url, onsuccess, onerror) {

            var scriptNode       = document.createElement('script')

            scriptNode.type      = 'text/javascript'
            scriptNode.src       = url
            scriptNode.async     = true
            
            
            if (Joose.is_IE) {
                
                var timeout    = setTimeout(function () {
                    
                    onerror(url + " load failed.")
                    
                }, 10000)
                
                scriptNode.onreadystatechange = function() {
                    
                    var readyState = scriptNode.readyState
                    
                    if (readyState == 'complete' || readyState == 'loaded') {
                        
                        clearTimeout(timeout)
                            
                        onsuccess(null, url)
                    }
                }
                
                
            } else {
                
                scriptNode.onload = function() {
                    onsuccess(scriptNode.text, url)
                }
            
                scriptNode.onerror = function () {
                    onerror(url + " load failed.")
                }
            }
                
            var head            = document.getElementsByTagName('head')[0] || document.body
            
            head.appendChild(scriptNode)
        },
        
        
        materialize : function (blob, url) {
        }
    }
})



/**

Name
====


JooseX.Namespace.Depended.Transport.ScriptTag - transport, which use the &lt;script&gt; tag for resource loading 


SYNOPSIS
========
        
        //generally for consuming only
        
        Class("JooseX.Namespace.Depended.Resource.Custom", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            does : [ JooseX.Namespace.Depended.Transport.ScriptTag, ...]
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Transport.ScriptTag` is a transport role. It provide the implementation of `load` method, which use the 
&lt;script&gt; tag for resource loading. It also overrides the `materialize` method as &lt;script&gt; tag execute the code along with loading. 



SEE ALSO
========

Authoring [JooseX.Namespace.Depended](../Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](../Resource.html)


General documentation for Joose: <http://joose.github.com/Joose/>


AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Role('JooseX.Namespace.Depended.Transport.NodeJS', {

    requires : [ 'handleLoad' ],
    
    override : {
        
        load: function (url, onsuccess, onerror) {
            var fs = require('fs')
            
            try {
                var content = fs.readFileSync(url, 'utf8')
                
            } catch (e) {
                
                onerror(e)
                
                return
            }
            
            onsuccess(content, url)
            
//            fs.readFile(url, function (err, data) {
//                if (err) {
//                    onerror(err)
//                    
//                    return
//                }
//                
//                onsuccess(data, url)
//            })            
        }
    }
})


/**

Name
====


JooseX.Namespace.Depended.Transport.Node - transport, which use the `fs.readFileSync()` call of NodeJS, to load the content of resource. 


SYNOPSIS
========
        
        //generally for consuming only
        
        Class("JooseX.Namespace.Depended.Resource.Custom", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            does : [ JooseX.Namespace.Depended.Transport.Node, ...]
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Transport.Node` is a transport role. It provide the implementation of `load` method, 
which use the `fs.readFile()` call of NodeJS for resource loading. 

This transport behaves synchronously.



SEE ALSO
========

Authoring [JooseX.Namespace.Depended](../Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](../Resource.html)


General documentation for Joose: <http://joose.github.com/Joose/>


AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Role('JooseX.Namespace.Depended.Materialize.NodeJS', {
    
    requires : [ 'handleLoad' ],
    
    methods : {
        
        materialize : function (resourceBlob, url) {
            
            if (global.__PROVIDER__)
//                require('vm').runInThisContext(resourceBlob + '', url)    
            
//                // running in Test.Run
//                
                eval(resourceBlob + '')
            
            else
                // global scope
                require('vm').runInThisContext('(function (exports, require, module, __filename, __dirname) {' + resourceBlob + '})', url)(exports, require, module, __filename, __dirname)
        }
    }
})

/**

Name
====


JooseX.Namespace.Depended.Materialize.NodeJS - materializator, which execute the code, using the `Script.runInThisContext` call of NodeJS. 


SYNOPSIS
========
        
        //generally for consuming only
        
        Class("JooseX.Namespace.Depended.Resource.Custom", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            does : [ JooseX.Namespace.Depended.Materialize.NodeJS, ...]
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Materialize.NodeJS` is a materializator role. It provide the implementation of `materialize` method. 


SEE ALSO
========

Authoring [JooseX.Namespace.Depended](../Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](../Resource.html)


General documentation for Joose: <http://joose.github.com/Joose/>


AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Class('JooseX.Namespace.Depended.Resource.Require', {
    
    isa     : JooseX.Namespace.Depended.Resource,
    
    
    methods : {
        
        getUrls : function () {
            return [ this.token ]
        },
        
        
        load: function (url, onsuccess, onerror) {
            
            require.async(url, function (err) {
                if (err instanceof Error) 
                    onerror(err)
                else
                    onsuccess('', url)
            })
            
        },

        
        materialize : function () {
        }
        
    }

})

JooseX.Namespace.Depended.Manager.my.registerResourceClass('require', JooseX.Namespace.Depended.Resource.Require)
;
Role('JooseX.Namespace.Depended', {
    
    /*PKGVERSION*/VERSION : 0.18,
    
    meta : Joose.Managed.Role,
    
    requires : [ 'prepareProperties' ],
    
    
    have : {
        containResources                    : [ 'use', 'meta', 'isa', 'does', 'trait', 'traits' ]
    },

    
    override: {
        
//        GETCURRENT : function () {
//            var currentModule   = this.getCurrent()
//            
//            return currentModule == Joose.top ? 'TOP' : currentModule.meta.name
//        },
        
        
        prepareProperties : function (name, extend, defaultMeta, callback) {
            if (name && typeof name != 'string') {
                extend = name
                name = null
            }
            
            extend = extend || {}
            
            var summaredDeps    = this.collectAllDeps(extend)
            var currentModule   = this.getCurrent()
            
            if (currentModule !== Joose.top && !currentModule.meta) {
                require('console').log("CURRENT MODULE: %s", require('util').inspect(currentModule))
                require('console').log("TOP: %s", require('util').inspect(Joose.top))
            }
            
            var resource = JooseX.Namespace.Depended.Manager.my.getResource({
                type    : 'joose',
                token   : currentModule == Joose.top ? name : currentModule.meta.name + '.' + name
            })
            
            
            if (extend.VERSION) resource.setVersion(extend.VERSION)
            
            //BEGIN executes right after the all dependencies are loaded, but before this module becomes ready (before body())
            //this allows to manually control the "ready-ness" of module (custom pre-processing)
            //BEGIN receives the function (callback), which should be called at the end of custom processing 
            if (extend.BEGIN) {
                resource.setOnBeforeReady(extend.BEGIN)
                
                delete extend.BEGIN
            }
            
            Joose.A.each(summaredDeps, function (descriptor) {
                resource.addDescriptor(descriptor)
            })
            
            
            //skip constructing for classes w/o dependencies 
            if (Joose.O.isEmpty(resource.dependencies)) {
                this.inlineAllDeps(extend)
                
                var res = this.SUPER(name, extend, defaultMeta, callback)
                
                //this will allow to classes which don't have dependencies to be ready synchronously
                resource.checkReady()
                
                return res
            } else {
                
                var me      = this
                var SUPER   = this.SUPER
                
                var current
                
                //unshift is critical for correct order of readyListerens processing!
                //constructing is delaying until resource will become ready 
                resource.readyListeners.unshift(function () {
                    me.inlineAllDeps(extend)
                    
                    Joose.Namespace.Manager.my.executeIn(currentModule, function () {
                        
                        SUPER.call(me, name, extend, defaultMeta, callback)
                    })
                })
                
                // running as <script> in browser or as main script in node
                if (!resource.hasReadyCheckScheduled) 
                    if (Joose.is_NodeJS) 
                        resource.handleDependencies()
                    else
                        // defer the dependencies loading, because they actually could be provided later in the same bundle file
                        // this, however, affect performance, so bundles should be created in the dependencies-ordered way
                        setTimeout(function () {
                            resource.handleDependencies()
                        }, 0)
                
                
                return this.create(name, Joose.Namespace.Keeper, {})
            }
        },
        
        
        prepareMeta : function (meta) {
            meta.resource = meta.resource || JooseX.Namespace.Depended.Manager.my.getMyResource('joose', meta.name, meta.c)
        }
    },
    //eof override
    
    
    methods : {
        
        alsoDependsFrom : function (extend, summaredDeps) {
        },
        
        
        collectAllDeps : function (extend) {
            var summaredDeps    = []
            var me              = this
            
            //gathering all the related resourses from various builders
            this.collectClassDeps(extend, summaredDeps)
            
            var extendMy = extend.my
            
            //gathering resourses of 'my'
            this.collectClassDeps(extendMy, summaredDeps)
            

            //gathering resourses from own attributes
            if (extend.has) Joose.O.each(extend.has, function (attr, name) {
                // do not try to collect the dependencies when class is given as init value
                if (Joose.O.isClass(attr)) return 
                
                me.collectClassDeps(attr, summaredDeps)
            })
            
            //gathering resourses from attributes of `my`
            if (extendMy && extendMy.has) Joose.O.each(extendMy.has, function (attr, name) {
                // do not try to collect the dependencies when class is given as init value
                if (Joose.O.isClass(attr)) return
                
                me.collectClassDeps(attr, summaredDeps)
            })
            
            //and from externally collected additional resources 
            this.alsoDependsFrom(extend, summaredDeps)
            
            return summaredDeps
        },
        
        
        collectClassDeps : function (from, to) {
            
            if (from) Joose.A.each(this.containResources, function (propName) {
                
                this.collectDependencies(from[propName], to, from, propName)
                
            }, this)
        },
        
        
        collectDependencies : function (from, to, extend, propName) {
            if (from) Joose.A.each(Joose.O.wantArray(from), function (descriptor) {
                if (descriptor && typeof descriptor != 'function') to.push(descriptor)
            })
        },
        
        
        inlineAllDeps : function (extend) {
            var me              = this
            
            this.inlineDeps(extend)
            
            var extendMy = extend.my
            
            if (extendMy) this.inlineDeps(extendMy)
            

            if (extend.has) Joose.O.each(extend.has, function (attr, name) {
                
                if (attr && typeof attr == 'object') me.inlineDeps(attr)
            })
            
            if (extendMy && extendMy.has) Joose.O.each(extendMy.has, function (attr, name) {
                
                if (attr && typeof attr == 'object') me.inlineDeps(attr)
            })
        },
        
        
        inlineDeps : function (extend) {
            delete extend.use
            
            Joose.A.each(this.containResources, function (propName) {
                
                if (extend[propName]) {
                
                    var descriptors = []
                    
                    Joose.A.each(Joose.O.wantArray(extend[propName]), function (descriptor, index) {
                        
                        var descType = typeof descriptor
                        
                        if (descType == 'function')
                            descriptors.push(descriptor.meta ? descriptor : (propName != 'isa' ? descriptor() : null ))
                        else
                            if (descType == 'object')
                                if (descriptor.token)
                                    descriptors.push(eval(descriptor.token)) 
                                else
                                    Joose.O.each(descriptor, function (version, name) { 
                                        descriptors.push(eval(name)) 
                                    })
                            else 
                                if (descType == 'string')
                                    descriptors.push(eval(descriptor))
                                else 
                                    throw new Error("Wrong dependency descriptor format: " + descriptor)
                        
                    })
                    
                    if (propName != 'isa' && propName != 'meta')
                        extend[propName] = descriptors
                    else
                        if (descriptors.length > 1) 
                            throw "Cant specify several super- or meta- classes"
                        else
                            if (descriptors[0]) extend[propName] = descriptors[0]
                        
                }
            })
        }
    }
})


Joose.Namespace.Manager.meta.extend({
    does : JooseX.Namespace.Depended
})

;
if (Joose.is_NodeJS) {

    JooseX.Namespace.Depended.Resource.JavaScript.meta.extend({
        
        does : [ JooseX.Namespace.Depended.Transport.NodeJS, JooseX.Namespace.Depended.Materialize.NodeJS ]
    })
    
    
    
    JooseX.Namespace.Depended.Manager.my.disableCaching = false
    
    Joose.Namespace.Manager.my.containResources.unshift('require')
    
    
    
    JooseX.Namespace.Depended.meta.extend({
        
        override : {
            
            collectDependencies : function (from, to, extend, propName) {
                if (propName != 'require') return this.SUPERARG(arguments)
                
                if (!from) return
                
                Joose.A.each(Joose.O.wantArray(from), function (url) {
                    to.push({
                        type    : 'require',
                        token   : url
                    })
                })
                
                delete extend.require
            }
        }
    })
} else
    JooseX.Namespace.Depended.Resource.JavaScript.meta.extend({
        
        does : [ JooseX.Namespace.Depended.Transport.XHRAsync, JooseX.Namespace.Depended.Materialize.Eval ]
    })
;

