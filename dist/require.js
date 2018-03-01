(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var uid = 0;
/**
 * watcher就是每一个task=>即callback
 * 订阅器
 * @param {Object} depName 
 */
function Dep(depName) {
    this.id = uid++;
    this.subs = [];
    this.depName = depName;
}

Dep.prototype = {
    /**
     * 添加订阅, 将watcher添加进数组subs
     * @param {Object} task new watcher()
     */
    addSubs: function addSubs(task) {
        this.subs.push(task);
    },
    /**
     * 删除订阅, 将watcher从数组subs中删除
     * @param {Object} task new watcher()
     */
    removeSub: function removeSub(task) {
        var index = this.subs.indexOf(task);
        index != -1 && this.subs.splice(index, 1);
    },
    /**
     * 当该模块加载好的时候, 通知所有依赖它的task
     */
    notify: function notify() {
        this.subs.forEach(function (task) {
            task.update();
        });
    }
};

exports.default = Dep;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hasOwn;
/**
 * 
 * @param {Object} obj 
 * @param {String} pro 
 */
function hasOwn(obj, pro) {
  return {}.hasOwnProperty.call(obj, pro);
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requirejs = exports.define = exports.require = undefined;

var _require2 = __webpack_require__(3);

var _require3 = _interopRequireDefault(_require2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = _require3.default.use;
exports.require = _require;
var define = exports.define = _require3.default.define;
var requirejs = exports.requirejs = _require3.default;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mixin = __webpack_require__(5);

var _mixin2 = _interopRequireDefault(_mixin);

var _util = __webpack_require__(6);

var _util2 = _interopRequireDefault(_util);

var _observer = __webpack_require__(0);

var _observer2 = _interopRequireDefault(_observer);

var _watcher = __webpack_require__(7);

var _watcher2 = _interopRequireDefault(_watcher);

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Module = {
    config: {
        baseUrl: "",
        paths: {}
    },

    module: {},
    host: location.protocol + '//' + location.host
};

//mixin
(0, _mixin2.default)(Module, _util2.default, true);
/**
 * 
 * @param {Array} arr deps
 * @param {Function} callback task
 */
Module.use = function (arr, callback) {
    function use(arr, callback) {
        var _this = this;

        if (arr.length == 0) {
            arr[0]();
            return;
        }
        var deps = arr,
            uris = [];
        // 解析baseUrl
        this.resolveBaseUrl();
        deps.forEach(function (module) {
            // 如果没有该模块
            uris.push(_this.resolvePath(module));
        });
        this.load(uris, callback);
    }
    return use.call(Module, arr, callback);
};

Module.load = function (uris, callback) {
    var _this2 = this;

    /**
     * @param {Number} num 已经加载好模块的数目
     * @param {Object} mod push的模块this.module[uri]
     * @param {Object} watcher new Watcher()
     */
    var num = 0,
        mod = void 0,
        watcher = void 0;
    // 检查是否已经记载过该模块了?
    uris.forEach(function (module, index, uris) {
        // 如果没有该模块

        if (!_this2.hasModule(module)) {
            // 添加该属性，该属性是一个对象
            // 这里可能会出错, 比如script文件不存在
            createScript(module);
            _this2.pushModule(module);
            mod = handleDepend(_this2.module[module], uris, callback);
        } else {
            mod = _this2.module[module];
            if ((0, _utils2.default)(mod, 'obj')) {
                num++;
            }
        }
    });

    // 如果num的值等于deps.length
    // 即模块都装载好了，则立即调用callback
    // 否则加入dep
    if (num == uris.length) {
        handleLoading(uris, callback);
    }
};

/**
 * @param {Array} arg 依赖
 */
Module.define = function () {
    for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
        arg[_key] = arguments[_key];
    }

    function define() {
        // define函数被执行的脚本所在路径
        var currentSrc = document.currentScript.src,
            _self = Module;
        if (!_self.hasModule(currentSrc)) {
            _self.pushModule(currentSrc);
        }
        // 没有依赖
        if (arg.length == 1) {
            _self.installModule(currentSrc, arg[0]());
            //加载好了，通知其他依赖它的模块
            _self.module[currentSrc].dep.notify();
            return;
        }
        var uris = arg[0],
            task = {};
        task.callback = arg[1];
        task.currentSrc = currentSrc;
        _self.use(uris, task);
    }
    return define.apply(Module, arg);
};

/**
 * 在Module.load函数中调用，即模块均加载成功
 * @param {Array} uris 
 * @param {Function} callback 
 */
function handleLoading(uris, callback) {
    var _this3 = this;

    /**
     * @param {Array} paramObj 包含依赖的数组
     */
    var paramObj = [];
    uris.forEach(function (uri) {
        paramObj.push(_this3.module[uri].obj);
    });
    callback.call(null, paramObj);
}
/**
 * 
 * @param {object} this_module Module.module[module]
 * @param {array} uris
 * @param {function} task
 */
function handleDepend(this_module, uris, task) {
    var mod = void 0,
        watcher = void 0;
    mod = this_module;
    // 对象的dep属性
    mod.dep = new _observer2.default(module);
    watcher = createWatcher(task, uris, mod.dep, this);
    mod.dep.addSubs(watcher);
    return mod;
}

/**
 * 为该callback建立一个watcher
 * @param {Function} callback 
 * @param {Array} deps 
 * @param {Object} dep new Dep()
 */
function createWatcher(callback, deps, dep) {
    return new _watcher2.default(callback, deps, dep, Module);
}

/**
 * 向document插入script脚本
 * @param {String} module script.src
 */
function createScript(module) {
    var script = void 0,
        promise = void 0;
    script = document.createElement('script');
    script.src = module;
    document.body.appendChild(script);
    return script;
}

exports.default = Module;
//export default require = Module.use.bind(Module);
//export default requirejs = Module;
//export default define = define;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * 参考 merge-descriptors
 */

/**
 * Module exports.
 * @public
 */

exports.default = merge;

/**
 * Module variables.
 * @private
 */

var hasOp = {}.hasOwnProperty;

/**
 * Merge the property descriptors of `src` into `dest`
 *
 * @param {object} dest Object to add descriptors to
 * @param {object} src Object to clone descriptors from
 * @param {boolean} [redefine=true] Redefine `dest` properties with `src` properties
 * @returns {object} Reference to dest
 * @public
 */

function merge(dest, src, redefine) {
  if (!dest) {
    throw new TypeError('argument dest is required');
  }

  if (!src) {
    throw new TypeError('argument src is required');
  }

  if (redefine === undefined) {
    // Default to true
    redefine = true;
  }
  var descriptor = void 0;
  Object.getOwnPropertyNames(src).forEach(function (name) {
    if (!redefine && hasOp.call(dest, name)) {
      // Skip desriptor
      return;
    }

    // Copy descriptor
    descriptor = Object.getOwnPropertyDescriptor(src, name);
    Object.defineProperty(dest, name, descriptor);
  });

  return dest;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _observer = __webpack_require__(0);

var _observer2 = _interopRequireDefault(_observer);

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = {};
util = {
    hasModule: function hasModule(pro) {
        var mod = this.module;
        return (0, _utils2.default)(mod, pro);
    },
    pushModule: function pushModule(pro) {
        this.module[pro] = {};
    },
    /**
     * this.module = {
     *   'http://xxxx.jQuery.js': {
     *         dep: new Dep(),
     *         obj: jQuery,
     *    }
     * }
     */
    installModule: function installModule(pro, module) {
        var mod = this.module;
        if (!(0, _utils2.default)(mod[pro], 'dep')) {
            mod[pro].dep = new _observer2.default();
        }
        mod[pro]['obj'] = module;
    }
};

util.resolveBaseUrl = function () {
    var conf = this.config,
        baseUrl = conf.baseUrl,
        currentScr = document.currentScript.src.split('/');
    if (baseUrl.length == 0) {
        currentScr = currentScr.pop();
        conf.baseUrl = currentScr.join('/');
        return;
    }
    if (baseUrl.match(/.*:\/\/.*/)) {
        baseUrl = baseUrl;
    } else if (baseUrl.charAt(0) === '/') {
        baseUrl = this.host + baseUrl;
    } else if (baseUrl.charAt(0) === '.') {
        baseUrl = this.host + baseUrl.substr(1);
    } else {
        baseUrl = this.host + '/' + baseUrl;
    }
    conf.baseUrl = baseUrl;
};

util.resolvePath = function (path) {
    /**
     * 查看path里面是否已经声明过
     */
    var conf = this.config;
    Object.keys(conf.path).forEach(function (name) {
        if (path === name) {
            path = conf.path[name];
        }
    });

    var i = 0,
        ref = void 0,
        baseUrl = conf.baseUrl,
        path_arr = path.split('/'),
        len = path_arr.length,
        host = baseUrl.match(/.*:\/\/.*?\//)[0];
    baseUrl = baseUrl.substr(host.length);
    ref = baseUrl.substr(0, baseUrl.lastIndexOf('/')).split('/');
    if (path.match(/.*:\/\/.*/)) {
        /**
         * path的值可能为http://www.xxx.com
         * 即该依赖可能是外部链接
         */
    } else if (path.charAt(0) === '/') {
        // 根目录
        path = host + ref[0] + path;
    } else {
        for (; i < path_arr.length; i++) {
            if (path_arr[i] === '..') {
                ref.length > 1 && ref.pop();
            } else if (path_arr[i] === '.') {
                // do nothing
            } else {
                ref.push(path_arr[i]);
            }
        }

        path = host + ref.join('/');
    }

    return path;
};
exports.default = util;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * 
 * @param {Function} task 将要执行的callback
 * @param {Array} uris 该callback所依赖的模块
 * @param {Object} dep new Dep()
 * @param {Object} Module Module
 */

function Watcher(task, uris, dep, Module) {
    this.$task = task;
    this.$uris = uris;
    this.dep = dep;
    this.$Module = Module;
    this.modArr = [];
    this.$len = this.$uris.length;
}

Watcher.prototype = {
    update: function update() {
        this.$len--;
        if (this.$len <= 0) {
            this.run();
        }
    },

    run: function run() {
        var _this = this;

        var mod = this.$Module.module,
            task = this.$task;

        this.$uris.forEach(function (uri) {
            _this.modArr.push(mod[uri].obj);
        });
        //this.$Module.module[this.dep.depName].obj =
        if (typeof task == 'function') {
            task.apply(null, this.modArr);
            return;
        }
        var src = task.currentSrc;
        mod[src].obj = task.callback.apply(null, this.modArr);
        mod[src].dep.notify();
        this.dep.removeSub(this);
        return;
    }
};

exports.default = Watcher;

/***/ })
/******/ ]);
});