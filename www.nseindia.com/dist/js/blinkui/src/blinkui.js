"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (!window.BlinkUI) {
    var noop = function noop() {};

    // Polyfill for Function.prototype.bind


    var bind = function bind(fn, thisArg) {
        return function () {
            fn.apply(thisArg, arguments);
        };
    };

    var _Promise = function _Promise(fn) {
        if (!(this instanceof _Promise)) throw new TypeError('Promises must be constructed via new');
        if (typeof fn !== 'function') throw new TypeError('not a function');
        this._state = 0;
        this._handled = false;
        this._value = undefined;
        this._deferreds = [];

        doResolve(fn, this);
    };

    var handle = function handle(self, deferred) {
        while (self._state === 3) {
            self = self._value;
        }
        if (self._state === 0) {
            self._deferreds.push(deferred);
            return;
        }
        self._handled = true;
        _Promise._immediateFn(function () {
            var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
                (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                return;
            }
            var ret;
            try {
                ret = cb(self._value);
            } catch (e) {
                reject(deferred.promise, e);
                return;
            }
            resolve(deferred.promise, ret);
        });
    };

    var resolve = function resolve(self, newValue) {
        try {
            // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
            if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
            if (newValue && ((typeof newValue === "undefined" ? "undefined" : _typeof(newValue)) === 'object' || typeof newValue === 'function')) {
                var then = newValue.then;
                if (newValue instanceof _Promise) {
                    self._state = 3;
                    self._value = newValue;
                    finale(self);
                    return;
                } else if (typeof then === 'function') {
                    doResolve(bind(then, newValue), self);
                    return;
                }
            }
            self._state = 1;
            self._value = newValue;
            finale(self);
        } catch (e) {
            reject(self, e);
        }
    };

    var reject = function reject(self, newValue) {
        self._state = 2;
        self._value = newValue;
        finale(self);
    };

    var finale = function finale(self) {
        if (self._state === 2 && self._deferreds.length === 0) {
            _Promise._immediateFn(function () {
                if (!self._handled) {
                    _Promise._unhandledRejectionFn(self._value);
                }
            });
        }

        for (var i = 0, len = self._deferreds.length; i < len; i++) {
            handle(self, self._deferreds[i]);
        }
        self._deferreds = null;
    };

    var Handler = function Handler(onFulfilled, onRejected, promise) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.promise = promise;
    };

    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */


    var doResolve = function doResolve(fn, self) {
        var done = false;
        try {
            fn(function (value) {
                if (done) return;
                done = true;
                resolve(self, value);
            }, function (reason) {
                if (done) return;
                done = true;
                reject(self, reason);
            });
        } catch (ex) {
            if (done) return;
            done = true;
            reject(self, ex);
        }
    };

    //BlinkUI is the copyright of Bysness Inc.
    //foreach polyfill
    var forEach = function forEach(arr, func) {
        for (var i = 0; i < arr.length; i++) {
            func(arr[i], i);
        }
    };
    //proxy polyfill
    (function (c) {
        function l(a) {
            return a ? "object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) || "function" === typeof a : !1;
        }if (!c.Proxy) {
            var m = null;c.a = function (a, b) {
                function c() {}if (!l(a) || !l(b)) throw new TypeError("Cannot create proxy with a non-object as target or handler");m = function m() {
                    c = function c(a) {
                        throw new TypeError("Cannot perform '" + a + "' on a proxy that has been revoked");
                    };
                };var e = b;b = { get: null, set: null, apply: null, construct: null };for (var h in e) {
                    if (!(h in b)) throw new TypeError("Proxy polyfill does not support trap '" + h + "'");b[h] = e[h];
                }"function" === typeof e && (b.apply = e.apply.bind(e));var _d = this,
                    n = !1;"function" === typeof a && (_d = function d() {
                    var g = this && this.constructor === _d,
                        f = Array.prototype.slice.call(arguments);c(g ? "construct" : "apply");return g && b.construct ? b.construct.call(this, a, f) : !g && b.apply ? b.apply(a, this, f) : g ? (f.unshift(a), new (a.bind.apply(a, f))()) : a.apply(this, f);
                }, n = !0);var p = b.get ? function (a) {
                    c("get");return b.get(this, a, _d);
                } : function (a) {
                    c("get");return this[a];
                },
                    r = b.set ? function (a, f) {
                    c("set");b.set(this, a, f, _d);
                } : function (a, b) {
                    c("set");this[a] = b;
                },
                    q = {};forEach(Object.getOwnPropertyNames(a), function (b) {
                    n && b in _d || (Object.defineProperty(_d, b, { enumerable: !!Object.getOwnPropertyDescriptor(a, b).enumerable, get: p.bind(a, b), set: r.bind(a, b) }), q[b] = !0);
                });e = !0;Object.setPrototypeOf ? Object.setPrototypeOf(_d, Object.getPrototypeOf(a)) : _d.__proto__ ? _d.__proto__ = a.__proto__ : e = !1;if (b.get || !e) for (var k in a) {
                    q[k] || Object.defineProperty(_d, k, { get: p.bind(a, k) });
                } /*Object.seal(a);Object.seal(d);*/return _d;
            };c.a.b = function (a, b) {
                return { proxy: new c.a(a, b), revoke: m };
            };c.a.revocable = c.a.b;c.Proxy = c.a;
        }
    })("undefined" !== typeof process && "[object process]" === {}.toString.call(process) ? global : self);

    //requestanimationframe polyfill
    if (!window.requestAnimationFrame) {

        window.requestAnimationFrame = function () {

            return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function ( /* function FrameRequestCallback */callback, /* DOMElement Element */element) {

                window.setTimeout(callback, 1000 / 60);
            };
        }();
    }
    //promise polyfill
    // Store setTimeout reference so promise-polyfill will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var setTimeoutFunc = setTimeout;

    _Promise.prototype['catch'] = function (onRejected) {
        return this.then(null, onRejected);
    };

    _Promise.prototype.then = function (onFulfilled, onRejected) {
        var prom = new this.constructor(noop);

        handle(this, new Handler(onFulfilled, onRejected, prom));
        return prom;
    };

    _Promise.all = function (arr) {
        return new _Promise(function (resolve, reject) {
            if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
            var args = Array.prototype.slice.call(arr);
            if (args.length === 0) return resolve([]);
            var remaining = args.length;

            function res(i, val) {
                try {
                    if (val && ((typeof val === "undefined" ? "undefined" : _typeof(val)) === 'object' || typeof val === 'function')) {
                        var then = val.then;
                        if (typeof then === 'function') {
                            then.call(val, function (val) {
                                res(i, val);
                            }, reject);
                            return;
                        }
                    }
                    args[i] = val;
                    if (--remaining === 0) {
                        resolve(args);
                    }
                } catch (ex) {
                    reject(ex);
                }
            }

            for (var i = 0; i < args.length; i++) {
                res(i, args[i]);
            }
        });
    };

    _Promise.resolve = function (value) {
        if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object' && value.constructor === _Promise) {
            return value;
        }

        return new _Promise(function (resolve) {
            resolve(value);
        });
    };

    _Promise.reject = function (value) {
        return new _Promise(function (resolve, reject) {
            reject(value);
        });
    };

    _Promise.race = function (values) {
        return new _Promise(function (resolve, reject) {
            for (var i = 0, len = values.length; i < len; i++) {
                values[i].then(resolve, reject);
            }
        });
    };

    // Use polyfill for setImmediate for performance gains
    _Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
        setImmediate(fn);
    } || function (fn) {
        setTimeoutFunc(fn, 0);
    };

    _Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
        if (typeof console !== 'undefined' && console) {
            console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
        }
    };

    var BlinkUI = { ui: {}, plugins: {} };
    var B = BlinkUI;
    B.on = function (elem, event, func) {
        var eventArr = event.split('.');
        if (eventArr.length === 1) {
            eventArr.push('r' + Math.floor(10000 * Math.random()));
        }
        if (elem) {
            if (!elem.blinkEvents) {
                elem.blinkEvents = {};
            }
            if (!elem.blinkEvents[eventArr[0]]) {
                elem.blinkEvents[eventArr[0]] = {};
            }
            elem.blinkEvents[eventArr[0]][eventArr[1]] = func;
            elem['on' + eventArr[0]] = function (e) {
                // e.currentTarget=elem; commented due to babel problems
                B.fire(elem, eventArr[0], e);
            };
            // mounted event is special
            if (eventArr[0] === 'mounted' && elem.cmp && elem.cmp.hasMounted && elem.cmp.mountedNotFired) {
                B.fire(elem, eventArr.join('.'), elem); //fire it right away
                elem.cmp.mountedNotFired = false;
            }
        }
    };
    B.once = function (elem, event, func) {
        if (event.indexOf('.') === -1) {
            event = event + '.' + 'r' + Math.floor(10000 * Math.random());
        }
        B.on(elem, event, function () {
            func.apply(null, arguments);
            B.off(elem, event);
        });
    };
    B.off = function (elem, event) {
        var eventArr = event.split('.');
        if (elem && elem.blinkEvents) {
            if (eventArr.length === 1) {
                elem['on' + eventArr[0]] = null;
                delete elem.blinkEvents[event];
            } else {
                for (var ns in elem.blinkEvents[eventArr[0]]) {
                    if (ns === eventArr[1]) {
                        delete elem.blinkEvents[eventArr[0]][ns];
                        break;
                    }
                }
                if (elem.blinkEvents[eventArr[0]] && elem.blinkEvents[eventArr[0]].length === 0) {
                    elem['on' + eventArr[0]] = null;
                }
            }
        }
    };
    B.fire = function (elem, event, data) {
        event = event.split('.');
        if (elem.blinkEvents && elem.blinkEvents[event[0]]) {
            if (event.length === 1) {
                for (var ns in elem.blinkEvents[event[0]]) {
                    if (typeof elem.blinkEvents[event[0]][ns] === 'function') elem.blinkEvents[event[0]][ns](data);else {
                        console.error(event[0], '::', ns, 'is not a function', 'attached to elem:', elem);
                    }
                }
            } else {
                if (elem.blinkEvents[event[0]] && elem.blinkEvents[event[0]][event[1]]) {
                    elem.blinkEvents[event[0]][event[1]](data);
                }
            }
        }
    };
    B.render = function (elementObj, root) {
        if (elementObj && root) {
            if (root.elem) {
                root.elem.appendChild(elementObj.elem || elementObj);
            } else root.appendChild(elementObj.elem || elementObj);
            if (elementObj.mounted) {
                elementObj.mounted();
            }
        }
    };
    B.renderAll = function (arrOfElems, root) {
        for (var i = 0; i < arrOfElems.length; i++) {
            B.render(arrOfElems[i], root);
        }
    };

    var _getClassesObj = function _getClassesObj(classesArr) {
        var arr = classesArr.split(' ');
        var obj = {};
        forEach(arr, function (item) {
            obj[item] = true;
        });
        return obj;
    };
    var _getClassesArr = function _getClassesArr(classesObj) {
        var arr = [];
        for (var c in classesObj) {
            arr.push(c);
        }
        return arr;
    };
    B.find = function (selector) {
        var elems = document.querySelectorAll(selector);
        attachArrayHelpers(elems);
        return elems;
    };
    B.findOne = function (selector) {
        return document.querySelector(selector);
    };
    B.changeClasses = function (target, newClasses) {
        var classesObj = void 0;
        if (newClasses && (newClasses[0] === '+' || newClasses[0] === '-')) {
            classesObj = _getClassesObj(target.getAttribute('class') || '');
            var className = newClasses.substr(1);
            if (newClasses[0] === '+') {
                classesObj[className] = true;
            } else if (newClasses[0] === '-') {
                delete classesObj[className];
            }
        } else {
            classesObj = _getClassesObj(newClasses);
        }
        var classStr = _getClassesArr(classesObj).join(' ');
        // console.log('classesObj',classesObj)
        target.setAttribute('class', classStr);
        return classStr;
    };
    B.postFile = function (url, formData) {
        return new _Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(xhr);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.send(formData);
        });
    };
    B.get = function (url) {
        return new _Promise(function (resolve, reject) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && (xmlHttp.status == 200 || xmlHttp.status === 301)) {
                    resolve(xmlHttp.responseText);
                }
            };
            xmlHttp.open("GET", url, true); // true for asynchronous
            xmlHttp.send(null);
        });
    };
    B.post = function (url, data, noJSON) {
        return new _Promise(function (resolve, reject) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && (xmlHttp.status == 200 || xmlHttp.status === 301)) {
                    resolve(noJSON ? xmlHttp.responseText : JSON.parse(xmlHttp.responseText));
                }
            };
            xmlHttp.open("POST", url, true); // true for asynchronous
            xmlHttp.setRequestHeader("Content-type", "application/json");
            xmlHttp.send(JSON.stringify(data));
        });
    };
    B.exec = function (src) {
        return new _Promise(function (resolve, reject) {
            B.get(src).then(function () {
                eval(src);
                resolve();
            }).catch(reject);
        });
    };
    B.getScript = function (src) {
        return new _Promise(function (resolve, reject) {
            var s;
            s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    };
    B.getScrollParent = function (node) {
        if (node === null) {
            return null;
        }

        if (node.scrollHeight > node.clientHeight) {
            return node;
        } else {
            return B.getScrollParent(node.parentNode);
        }
    };
    var attachArrayHelpers = function attachArrayHelpers(arr) {
        var doForAll = function doForAll(funcName) {
            return function () {
                var args = arguments;
                var result = null;
                forEach(arr, function (elem) {
                    if (typeof elem[funcName] === 'function') {
                        var tempResult = elem[funcName].apply(null, args);
                        if (tempResult) {
                            result = tempResult;
                        }
                    }
                });
                return result;
            };
        };
        arr.remove = doForAll('remove');
        arr.adjustClass = doForAll('adjustClass');
        arr.removeClass = doForAll('removeClass');
        arr.addClass = doForAll('addClass');
        arr.toggleClass = doForAll('toggleClass');

        arr.hasClass = doForAll('hasClass');
        arr.hide = doForAll('hide');
        arr.show = doForAll('show');
        arr.attr = doForAll('attr');
        arr.on = doForAll('on');
        arr.once = doForAll('once');
        arr.off = doForAll('off');
        arr.fire = doForAll('fire');
        arr.find = doForAll('find');
        arr.findOne = doForAll('findOne');
        arr.children = doForAll('children');
        arr.parent = doForAll('parent');
        arr.parents = doForAll('parents');
        arr.render = doForAll('render');
        arr.index = doForAll('index');
        arr.empty = doForAll('empty');
    };

    var concatArr = function concatArr() {
        var arr3 = [];
        for (var a = 0; a < arguments.length; a++) {
            for (var i = 0; i < arguments[a].length; i++) {
                arr3.push(arguments[a][i]);
            }
        }
        return arr3;
    };
    var extend = function extend(obj1, obj2) {
        var obj3 = {};
        for (var o in obj1) {
            obj3[o] = obj1[o];
        }
        for (var _o in obj2) {
            obj3[_o] = obj2[_o];
        }
        return obj3;
    };
    var instantiate = function instantiate(clsName, classObj) {
        window[clsName] = function () {
            var obj = new classObj(Array.prototype.slice.apply(arguments));
            return obj;
        };
    };
    var instantiateAnyTag = function instantiateAnyTag(clsName, classObj) {
        window[clsName] = function () {
            var obj = new classObj(concatArr([clsName], Array.prototype.slice.apply(arguments)));
            return obj;
        };
    };
    B.argChildren = function (args) {
        var newArgs = [];
        for (var i = 0; i < args.length; i++) {
            if (args[i] instanceof BlinkElement) {
                newArgs.push(args[i]);
            }
        }
        return newArgs;
    };
    B.deleteAttr = function (attrName, args) {
        forEach(args, function (arg) {
            if (arg[attrName]) {
                delete arg[attrName];
            }
        });
    };
    B.findAttr = function (attrName, args) {
        var argToReturn = null;
        forEach(args, function (arg) {
            if (typeof arg[attrName] !== 'undefined') {
                argToReturn = arg[attrName];
            }
        });
        return argToReturn;
    };
    B.argAttrs = function (args) {
        if (args && args instanceof Array) {
            var newArgs = args.slice();
            for (var i = 0; i < newArgs.length; i++) {
                if (newArgs[i] instanceof BlinkElement) {
                    newArgs.splice(i, 1);
                    i--;
                }
            }
            return newArgs;
        } else {
            return [];
        }
    };
    B.extractArgAttrs = function (args) {
        var argObj = {};
        var attrs = B.argAttrs(args);
        forEach(attrs, function (attr) {
            for (var a in attr) {
                argObj[a] = attr[a];
            }
        });
        return argObj;
    };
    B.appendClasses = function (classes, args) {
        var argToReturn = null;
        var classFound = false;
        args = args || [];
        forEach(args, function (arg) {
            if (arg['class']) {
                classFound = true;
                arg['class'] = arg['class'] + ' ' + classes;
            }
        });
        if (!classFound) {
            args.push({ class: classes });
        }
    };
    B.prependClasses = function (classes, args) {
        var argToReturn = null;
        var classFound = false;
        args = args || [];
        forEach(args, function (arg) {
            if (arg['class']) {
                classFound = true;
                arg['class'] = classes + ' ' + arg['class'];
            }
        });
        if (!classFound) {
            args.push({ class: classes });
        }
    };
    B.if = function (func, thenReturn) {
        if (func()) {
            return thenReturn;
        } else {
            return false;
        }
    };
    B.each = function (haystack, func) {
        var haystackLength = typeof haystack === 'number' ? haystack : haystack.length;
        for (var i = 0; i < haystackLength; i++) {
            func(haystack[i] || i);
        }
    };
    B.repeat = function (haystack, func) {
        var arr = [];
        if (typeof haystack === 'function') {
            haystack = haystack();
        } else if (typeof haystack === 'number') {
            var tempArr = [];
            for (var i = 0; i < haystack; i++) {
                tempArr.push(i);
            }
            haystack = tempArr;
        }
        for (var _i = 0; _i < haystack.length; _i++) {
            arr.push(func(haystack[_i], _i));
        }
        return arr;
    };
    B.extend = function () {
        var newObj = {};
        for (var i = 0; i < arguments.length; i++) {
            for (var a in arguments[i]) {
                newObj[a] = arguments[i][a];
            }
        }
        return newObj;
    };
    var isBlinkElement = function isBlinkElement(elem) {
        return elem instanceof BlinkElement;
    };
    B.attachHelpers = function (elem) {
        if (!elem.toggleClass && !elem.show && !elem.find) {
            elem.remove = function () {
                elem.parentNode.removeChild(elem);
                return elem;
            };
            elem.addClass = function (newClass) {
                B.changeClasses(elem, '+' + newClass);
                return elem;
            };
            elem.hasClass = function (className) {
                var result = false;
                var cls = elem.getAttribute('class');
                if (cls) {
                    forEach(cls.split(' '), function (class1) {
                        if (class1 === className) result = true;
                    });
                }
                return result;
            };
            elem.toggleClass = function (className) {
                if (elem.hasClass(className)) {
                    elem.removeClass(className);
                } else {
                    elem.addClass(className);
                }
            };
            elem.removeClass = function (oldClass) {
                B.changeClasses(elem, '-' + oldClass);
                return elem;
            };
            elem.adjustClass = function (adjustedClass) {
                B.changeClasses(elem, adjustedClass);
                return elem;
            };
            elem.hide = function () {
                if (elem.style.display !== 'none') {
                    elem.lastDisplay = window.getComputedStyle(elem, null).getPropertyValue("display");
                }
                elem.style.display = 'none';
                return elem;
            };
            elem.css = function (property, value) {
                if (arguments.length === 1) {
                    return window.getComputedStyle(elem, null).getPropertyValue("property");
                } else {
                    elem.style[property] = value;
                    return elem;
                }
            };
            elem.show = function () {
                elem.style.display = elem.lastDisplay || (elem.style.display !== 'none' ? elem.style.display : 'block');
                return elem;
            };
            elem.toggle = function () {
                if (elem.visible()) {
                    elem.hide();
                } else elem.show();
            };
            elem.visible = function () {
                var dis = window.getComputedStyle(elem, null).getPropertyValue("display");
                if (dis !== 'none') {
                    return true;
                } else {
                    return false;
                }
            };
            elem.attr = function (name, value) {
                if (arguments.length === 1) {
                    return elem.getAttribute(name);
                } else if (arguments.length === 2) {
                    elem.setAttribute(name, value);
                    return elem;
                }
            };
            elem.on = function (event, func) {
                B.on(elem, event, func);
                return elem;
            };
            elem.once = function (event, func) {
                B.once(elem, event, func);
                return elem;
            };
            elem.off = function (event) {
                B.off(elem, event);
                return elem;
            };
            elem.fire = function (event, data) {
                B.fire(elem, event, data);
                return elem;
            };
            elem.find = function (selector) {
                var elems = elem.querySelectorAll(selector);
                attachArrayHelpers(elems);
                return elems;
            };
            elem.findOne = function (selector) {
                return elem.find(selector)[0] || null;
            };
            elem.parent = function () {
                return elem.parentNode;
            };
            elem.empty = function () {
                for (var i = 0; i < elem.children.length; i++) {
                    elem.removeChild(elem.children[i]);
                    i--;
                }
                return elem;
            };
            elem.parents = function (selector) {
                var matchesFunc = 'matches';
                selector = selector || '*';
                var parents = [];
                var parent = elem.parentNode;
                while (parent) {
                    parents.push(parent);
                    if (parent.parentNode && parent.parentNode[matchesFunc] && parent.parentNode[matchesFunc]) {
                        parent = parent.parentNode;
                    } else {
                        parent = null;
                    }
                }
                for (var i = 0; i < parents.length; i++) {
                    if (typeof selector === 'string') {
                        if (!parents[i][matchesFunc](selector)) {
                            parents.splice(i, 1);
                            i--;
                        }
                    } else if (typeof selector === 'function') {
                        if (!selector(parents[i])) {
                            parents.splice(i, 1);
                            i--;
                        }
                    }
                }
                attachArrayHelpers(parents);
                return parents;
            };
            if (typeof elem.index === 'undefined') {
                elem.index = function () {
                    elem.setAttribute('temp-index', 'true');
                    var index = 0;
                    forEach(elem.parentNode.childNodes, function (child, childIndex) {
                        if (child && child.getAttribute && child.getAttribute('temp-index')) {
                            index = childIndex;
                        }
                    });
                    elem.removeAttribute('temp-index');
                    return index;
                };
            }
            elem.realWidth = function () {
                return parseInt(window.getComputedStyle(elem, null).getPropertyValue('width').replace('px', ''));
            };
            elem.realHeight = function () {
                return parseInt(window.getComputedStyle(elem, null).getPropertyValue('height').replace('px', ''));
            };
            elem.next = function (selector) {
                var arr = [];
                for (var i = elem.index() + 1; i < elem.parentNode.children.length; i++) {
                    if (elem.parentNode.children[i].matches(selector || '*')) {
                        arr.push(elem.parentNode.children[i]);
                    }
                }
                return arr;
            };
            elem.prev = function (selector) {
                var arr = [];
                for (var i = elem.index() - 1; i >= 0; i--) {
                    if (elem.parentNode.children[i].matches(selector || '*')) {
                        arr.push(elem.parentNode.children[i]);
                    }
                }
                return arr;
            };
        }
    };

    var BlinkElement = function () {
        function BlinkElement(args) {
            _classCallCheck(this, BlinkElement);

            if (args) {
                var tagName = args[0];
                if (args.length === 2 && args[1] instanceof Array) {
                    args = concatArr([args[0]], args[1]);
                }
                this.args = args;
                if (['svg', 'line', 'rect', 'g', 'marker', 'path'].indexOf(tagName) !== -1) {
                    this.elem = document.createElementNS("http://www.w3.org/2000/svg", tagName);
                } else {
                    this.elem = document.createElement(tagName);
                }
                this.elem.cmp = this;
                this.created();
            }
        }

        BlinkElement.prototype.getAttr = function getAttr() {
            var cached = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (!this.cachedAttrs) {
                this.cachedAttrs = B.extractArgAttrs(this.args);
            }
            return this.cachedAttrs;
        };

        BlinkElement.prototype.created = function created() {
            var args = this.args;
            var elem = this.elem;
            for (var i = 1; i < args.length; i++) {
                if (!isBlinkElement(args[i]) && typeof args[i] !== 'string') {
                    for (var a in args[i]) {
                        if (!B.plugins[a]) {
                            var attrType = _typeof(args[i][a]);
                            if (attrType === 'string' || attrType === 'number' || attrType === 'boolean') this.elem.setAttribute(a, args[i][a]);
                        }
                    }
                }
            }
            for (var _i2 = 1; _i2 < args.length; _i2++) {
                if (args[_i2] instanceof BlinkElement) {
                    this.elem.appendChild(args[_i2].elem ? args[_i2].elem : args[_i2]);
                    /*if(args[i].elem){
                     args[i].mounted()
                     }*/
                } else if (typeof args[_i2] === 'string') {
                    var t = document.createTextNode(args[_i2]);
                    this.elem.appendChild(t);
                }
            }
            B.attachHelpers(elem);
            this.cachedAttrs = B.extractArgAttrs(this.args);
        };

        BlinkElement.prototype.mounted = function mounted() {
            if (!this.hasMounted) {
                this.mountTime = new Date().getTime();
                this.hasMounted = true;
                var args = this.args;
                var elem = this.elem;
                // console.log('mounted',elem);
                // elem.state=state;
                for (var i = 0; i < args.length; i++) {
                    if (!isBlinkElement(args[i]) && typeof args[i] !== 'string') {
                        for (var a in args[i]) {
                            if (B.plugins[a]) {
                                B.plugins[a](elem, args[i][a]);
                            }
                        }
                    } else if (isBlinkElement(args[i])) {
                        for (var j = 0; j < args[i].elem.children.length; j++) {
                            if (args[i].elem.children[j].cmp) {
                                if (!args[i].elem.children[j].cmp.hasMounted) {
                                    args[i].elem.children[j].cmp.mounted();
                                }
                            }
                        }
                        if (!args[i].hasMounted) {
                            args[i].mounted();
                        }
                    }
                }
                if (elem.blinkEvents && elem.blinkEvents.mounted) {
                    elem.fire('mounted', elem);
                } else {
                    this.mountedNotFired = true;
                }
            }
        };

        return BlinkElement;
    }();

    var AnyTag = function (_BlinkElement) {
        _inherits(AnyTag, _BlinkElement);

        function AnyTag(args) {
            _classCallCheck(this, AnyTag);

            var _this = _possibleConstructorReturn(this, _BlinkElement.call(this, args));

            _this.elem.cmp = _this;
            return _this;
        }

        return AnyTag;
    }(BlinkElement);

    instantiateAnyTag('script', AnyTag);
    instantiateAnyTag('div', AnyTag);
    instantiateAnyTag('canvas', AnyTag);
    instantiateAnyTag('iframe', AnyTag);
    instantiateAnyTag('br', AnyTag);
    instantiateAnyTag('span', AnyTag);
    instantiateAnyTag('button', AnyTag);
    instantiateAnyTag('input', AnyTag);
    instantiateAnyTag('table', AnyTag);
    instantiateAnyTag('thead', AnyTag);
    instantiateAnyTag('tbody', AnyTag);
    instantiateAnyTag('tr', AnyTag);
    instantiateAnyTag('td', AnyTag);
    instantiateAnyTag('th', AnyTag);
    instantiateAnyTag('textarea', AnyTag);
    instantiateAnyTag('select', AnyTag);
    instantiateAnyTag('a', AnyTag);
    instantiateAnyTag('label', AnyTag);
    instantiateAnyTag('img', AnyTag);
    instantiateAnyTag('p', AnyTag);
    instantiateAnyTag('h1', AnyTag);
    instantiateAnyTag('h2', AnyTag);
    instantiateAnyTag('h3', AnyTag);
    instantiateAnyTag('h4', AnyTag);
    instantiateAnyTag('h5', AnyTag);
    instantiateAnyTag('h6', AnyTag);
    instantiateAnyTag('ul', AnyTag);
    instantiateAnyTag('ol', AnyTag);
    instantiateAnyTag('li', AnyTag);
    instantiateAnyTag('option', AnyTag);
    instantiateAnyTag('svg', AnyTag);
    instantiateAnyTag('line', AnyTag);
    instantiateAnyTag('marker', AnyTag);
    instantiateAnyTag('path', AnyTag);
    instantiateAnyTag('g', AnyTag);
    instantiateAnyTag('rect', AnyTag);

    var stateInitiated = false;

    var makeProxy = function makeProxy(obj, parentObj, fullPath) {
        // obj.uid='u' + Math.floor(1000 * Math.random()) + '-' + Math.floor(1000 * Math.random());
        var p = new Proxy(obj, {
            set: function set(target, property, value, receiver) {
                target[property] = value;
                if (stateInitiated) {
                    var pathStr = fullPath.join('.');
                    // console.log('changed',pathStr?(pathStr + '.' + property):property,value);
                    BlinkUI.triggerState(parentObj || p, pathStr ? pathStr + '.' + property : property, value);
                }
                return true;
            }
        });
        return p;
    };
    var states = {};
    B.listenState = function (state, objPath, func) {
        if (!states[state.uid]) {
            states[state.uid] = [];
        }
        var stateListeners = states[state.uid];
        if (!stateListeners[objPath]) {
            stateListeners[objPath] = [];
        }
        stateListeners[objPath].push(func);
    };
    B.triggerState = function (state, objPath, value) {
        if (state) {
            if (!states[state.uid]) {
                states[state.uid] = [];
            }
            var stateListeners = states[state.uid];
            if (stateListeners && stateListeners[objPath]) {
                forEach(stateListeners[objPath], function (func) {
                    func(value);
                });
            }
        }
    };
    B.getStateValue = function (state, objPath) {
        var parent = state;
        var paths = objPath.split('.');
        forEach(paths, function (path) {
            parent = parent[path];
        });
        return parent;
    };
    B.uniqueId = function () {
        return 'u' + Math.floor(Math.random() * 1000) + '-' + Math.floor(Math.random() * 1000);
    };
    B.State = function (obj) {
        var _recurse = function _recurse(childObj, parentObj, fullPath) {
            for (var l in childObj) {
                if (childObj[l] && childObj[l].constructor === Object) {
                    childObj[l] = makeProxy(childObj[l], parentObj, fullPath);
                    fullPath.push(l);
                    _recurse(childObj[l], parentObj, fullPath);
                }
            }
        };
        var p = makeProxy(_extends({}, obj, { uid: B.uniqueId() }), null, []);
        _recurse(obj, p, []);
        // p.uid=B.uniqueId(); doesn't run on old js versions
        stateInitiated = true;
        return p;
    };
    B.plugins.showHide = function (elem, value) {
        if (value instanceof Array) {
            forEach(value, function (val) {
                B.plugins.showHide(elem, val);
            });
            return;
        } else {
            if (value.obj && value.test) {
                var validator = function validator(newVal) {
                    if (value.test(elem, newVal)) {
                        elem.show();
                    } else {
                        elem.hide();
                    }
                };
                B.listenState(value.state, value.obj, validator);
                B.triggerState(value.state, value.obj, B.getStateValue(value.state, value.obj));
            }
        }
    };
    B.plugins.toggleClass = function (elem, value) {
        if (value instanceof Array) {
            forEach(value, function (val) {
                B.plugins.toggleClass(elem, val);
            });
            return;
        } else {
            if (value.obj && value.test) {
                var validator = function validator(newVal) {
                    if (value.test(elem, newVal)) {
                        elem.addClass(value.class);
                    } else {
                        elem.removeClass(value.class);
                    }
                };
                B.listenState(value.state, value.obj, validator);
                B.triggerState(value.state, value.obj, B.getStateValue(value.state, value.obj));
            }
        }
    };
    B.plugins.onStateChange = function (elem, value) {
        if (value instanceof Array) {
            forEach(value, function (val) {
                B.plugins.onStateChange(elem, val);
            });
            return;
        }
        if (value.obj && value.onChange && value.state) {
            var validator = function validator(newVal) {
                // console.log('calling stateChange',newVal,value.state)
                value.onChange(elem, newVal);
            };
            B.listenState(value.state, value.obj, validator);
            // console.log('changing state',value.obj,elem)
            B.triggerState(value.state, value.obj, B.getStateValue(value.state, value.obj));
        }
    };
    B.plugins.on = function (elem, value) {
        for (var v in value) {
            // console.log('attaching event',v,'on',elem)
            elem.on(v, value[v]);
        }
    };
    B.plugins.once = function (elem, value) {
        for (var v in value) {
            // console.log('attaching event',v,'on',elem)
            elem.once(v, value[v]);
        }
    };
    var isVisible = function isVisible(elem) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
    };
    var lastFocus = null;
    var lastFocusList = null;
    var focusElement = function focusElement(elem, clear, originalEvent) {
        originalEvent = originalEvent || {};
        originalEvent.lastFocus = lastFocus;
        originalEvent.lastFocusList = lastFocusList;
        if (clear) {
            var focused = B.find('.focused');
            if (focused.length > 0) {
                forEach(focused, function (f) {
                    f.removeClass('focused');
                    f.fire('focusout', originalEvent);
                });
            }
        }
        if (elem) {
            // elem.scrollIntoView({behavior:'instant',block:'nearest',inline:'start'}); //commented because jumpy problem with older browsers
            // elem.scrollIntoView(false);
            elem.addClass('focused');
            lastFocus = elem;
            if (elem.fire) elem.fire('focusin', originalEvent);
        }
    };
    var focusNext = function focusNext(child, originalEvent) {
        if (child) {
            var cursor = child;
            var iter = 0;
            var lastCursor = cursor;
            while (cursor && cursor.find) {
                if (iter > 0 && lastCursor === cursor) {
                    //infinite loop
                    console.log('averted infinite loop', cursor);
                    break;
                }
                iter++;
                lastCursor = cursor;
                var findInChildren = function findInChildren(elem) {
                    if (elem.find) {
                        var f_children = elem.find('.focusable');
                        // console.log('finding in children',elem,f_children);
                        if (f_children.length > 0) {
                            for (var i = 0; i < f_children.length; i++) {
                                if (isVisible(f_children[i])) {
                                    focusElement(f_children[i], true, originalEvent);
                                    return true;
                                }
                            }
                        }
                    }
                };
                if (findInChildren(cursor)) {
                    return;
                }
                var nextSibling = cursor.nextElementSibling;
                while (nextSibling) {
                    // console.log('nextSibling',nextSibling);
                    if (nextSibling.hasClass('focusable') && isVisible(nextSibling)) {
                        focusElement(nextSibling, true, originalEvent);
                        return;
                    }
                    if (findInChildren(nextSibling)) {
                        return;
                    }
                    nextSibling = nextSibling.nextElementSibling;
                }
                while (cursor.parentNode) {
                    cursor = cursor.parentNode;
                    if (cursor.nextElementSibling) {
                        cursor = cursor.nextElementSibling;
                        break;
                    }
                }
                if (findInChildren(cursor)) {
                    return;
                }
                if (cursor.parents) {
                    var f_parent = cursor.parents('.focusable');
                    if (f_parent.length > 0) {
                        var f_uncle = f_parent[0].next('.focusable');
                        if (f_uncle.length > 0 && isVisible(f_uncle[0])) {
                            focusElement(f_uncle[0], true, originalEvent);
                            break;
                        }
                        console.log('didn\'t find in the parent\'s siblings', cursor);
                        // break;
                    }
                    // console.log('cursor',cursor);
                }
            }
        }
    };
    var focusPrevious = function focusPrevious(child, originalEvent) {
        if (child) {
            var cursor = child;
            while (cursor && cursor.prev) {
                if (cursor && cursor.hasClass('focusable') && cursor !== child && isVisible(cursor)) {
                    focusElement(cursor, true, originalEvent);
                    break;
                }
                var f_sib = cursor.previousElementSibling;
                if (f_sib) {
                    var f_children = f_sib.find('.focusable');
                    if (f_children.length > 0 && isVisible(f_children[f_children.length - 1])) {
                        focusElement(f_children[f_children.length - 1], true, originalEvent);
                        break;
                    }
                    if (f_sib.hasClass('focusable') && isVisible(f_sib)) {
                        focusElement(f_sib, true, originalEvent);
                        break;
                    }
                }
                cursor = cursor.parentNode;
            }
        }
    };
    var makeFocusable = function makeFocusable() {
        B.off(document, 'keydown.focusable');
        B.on(document, 'keydown.focusable', function (e) {
            if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27 || e.keyCode >= 37 && e.keyCode <= 40) {
                if (e.keyCode === 40 || e.keyCode === 9 && !e.shiftKey) {
                    e.preventDefault();
                    var focused = B.findOne('.focused');
                    if (focused) {
                        focusNext(focused, e);
                    } else {
                        var focusables = B.find('.focusable');
                        if (focusables.length > 0 && isVisible(focusables[0])) {
                            focusElement(focusables[0], true, e);
                        }
                    }
                } else if (e.keyCode === 38 || e.keyCode === 9 && e.shiftKey) {
                    e.preventDefault();
                    var _focused = B.findOne('.focused');
                    if (_focused) {
                        focusPrevious(_focused, e);
                    } else {
                        var _focusables = B.find('.focusable');
                        if (_focusables.length > 0 && isVisible(_focusables[0])) {
                            focusElement(_focusables[0], true, e);
                        }
                    }
                } else if (e.keyCode === 37) {
                    var _focused2 = B.findOne('.focused');
                    _focused2.fire('collapse', _extends({}, e, { currentTarget: _focused2 }));
                } else if (e.keyCode === 39) {
                    var _focused3 = B.findOne('.focused');
                    if (_focused3) {
                        _focused3.fire('expand', _extends({}, e, { currentTarget: _focused3 }));
                    }
                } else if (e.keyCode === 13) {
                    var _focused4 = B.findOne('.focused');
                    if (_focused4) {
                        _focused4.fire('enter', _extends({}, e, { currentTarget: _focused4 }));
                    }
                } else if (e.keyCode === 27) {
                    var _focused5 = B.findOne('.focused');
                    if (_focused5) {
                        _focused5.fire('escape', _extends({}, e, { currentTarget: _focused5 }));
                    }
                }
            }
        });
    };
    var refreshFocusable = function refreshFocusable(parent) {
        B.off(parent || document, 'mousedown.focusable');
        B.on(parent || document, 'mousedown.focusable', function (e) {
            focusElement(null, true, e);
        });
        var focusables = void 0;
        if (parent) {
            focusables = parent.find('.focusable');
        } else {
            focusables = B.find('.focusable');
        }
        forEach(focusables, function (focusable) {
            focusable.off('mousedown.focusable');
            focusable.on('mousedown.focusable', function (e) {
                focusElement(focusable, true, e);
                e.stopPropagation();
            });
        });
    };
    B.on(document, 'allGood', function () {
        setTimeout(refreshFocusable, 500);
        //todo: I hate hard-coded timers. I think we should emit an allDrawn event
    });
    window.onload = function () {
        B.fire(document, 'allGood', {});
    };
} else {
    console.log('Not loading blinkui since already loaded');
}