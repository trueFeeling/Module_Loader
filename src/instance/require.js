
import mixin from '../mixin/mixin'
import util from '../util/util'
import Dep from '../observe/observer'
import Watcher from '../observe/watcher'
import hasOwn from '../shared/utils'

let Module = {
    config: {
        baseUrl: "",
        paths: {}
    },

    module: {

    },
    host: location.protocol + '//' + location.host
};

//mixin
mixin(Module, util, true);
/**
 * 
 * @param {Array} arr deps
 * @param {Function} callback task
 */
Module.use = function (arr, callback) {
    function use(arr, callback) {
        if (arr.length == 0) {
            arr[0]();
            return
        }
        const deps = arr,
            uris = [];
        // 解析baseUrl
        this.resolveBaseUrl();
        deps.forEach(module => {
            // 如果没有该模块
            uris.push(this.resolvePath(module));
        });
        this.load(uris, callback);
    }
    return use.call(Module, arr, callback)
};

Module.load = function (uris, callback) {
    /**
     * @param {Number} num 已经加载好模块的数目
     * @param {Object} mod push的模块this.module[uri]
     * @param {Object} watcher new Watcher()
     */
    let num = 0,
        mod,
        watcher;
    // 检查是否已经记载过该模块了?
    uris.forEach((module, index, uris) => {
        // 如果没有该模块

        if (!this.hasModule(module)) {
            // 添加该属性，该属性是一个对象
            // 这里可能会出错, 比如script文件不存在
            createScript(module);
            this.pushModule(module);
            mod = handleDepend(this.module[module], uris, callback);
        } else {
            mod = this.module[module];
            if (hasOwn(mod, 'obj')) {
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
Module.define = function (...arg) {
    function define() {
        // define函数被执行的脚本所在路径
        let currentSrc = document.currentScript.src,
            _self = Module;
        if (!_self.hasModule(currentSrc)) {
            _self.pushModule(currentSrc);
        }
        // 没有依赖
        if (arg.length == 1) {
            _self.installModule(currentSrc, arg[0]());
            //加载好了，通知其他依赖它的模块
            _self.module[currentSrc].dep.notify();
            return
        }
        let uris = arg[0],
            task = {};
        task.callback = arg[1];
        task.currentSrc = currentSrc;
        _self.use(uris, task);
    }
    return define.apply(Module, arg)
}

/**
 * 在Module.load函数中调用，即模块均加载成功
 * @param {Array} uris 
 * @param {Function} callback 
 */
function handleLoading(uris, callback) {
    /**
     * @param {Array} paramObj 包含依赖的数组
     */
    let paramObj = [];
    uris.forEach(uri => {
        paramObj.push(this.module[uri].obj)
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
    let mod, watcher;
    mod = this_module;
    // 对象的dep属性
    mod.dep = new Dep(module);
    watcher = createWatcher(task, uris, mod.dep, this);
    mod.dep.addSubs(watcher);
    return mod
}


/**
 * 为该callback建立一个watcher
 * @param {Function} callback 
 * @param {Array} deps 
 * @param {Object} dep new Dep()
 */
function createWatcher(callback, deps, dep) {
    return new Watcher(callback, deps, dep, Module)
}

/**
 * 向document插入script脚本
 * @param {String} module script.src
 */
function createScript(module) {
    let script, promise;
    script = document.createElement('script');
    script.src = module;
    document.body.appendChild(script)
    return script
}

export default Module
//export default require = Module.use.bind(Module);
//export default requirejs = Module;
//export default define = define;


