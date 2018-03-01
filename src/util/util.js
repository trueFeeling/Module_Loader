import Dep from '../observe/observer'
import hasOwn from '../shared/utils'
let util = {};
util = {
    hasModule: function (pro) {
        let mod = this.module;
        return hasOwn(mod, pro);
    },
    pushModule: function (pro) {
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
    installModule: function (pro, module) {
        let mod = this.module;
        if(!hasOwn(mod[pro], 'dep')){
            mod[pro].dep = new Dep();
        }
        mod[pro]['obj'] = module;
    }
};

util.resolveBaseUrl = function () {
    let conf = this.config,
        baseUrl = conf.baseUrl,
        currentScr = document.currentScript.src.split('/');
    if(baseUrl.length == 0){
        currentScr = currentScr.pop();
        conf.baseUrl = currentScr.join('/');
        return
    }
    if (baseUrl.match(/.*:\/\/.*/)) {
        baseUrl = baseUrl;
    } else if(baseUrl.charAt(0) === '/'){
        baseUrl = this.host + baseUrl;
    } else if(baseUrl.charAt(0) === '.'){
        baseUrl = this.host + baseUrl.substr(1);
    } else{
        baseUrl = this.host + '/' + baseUrl;
    }
    conf.baseUrl = baseUrl;
}

util.resolvePath = function (path) {
    /**
     * 查看path里面是否已经声明过
     */
    let conf = this.config;
    Object.keys(conf.path).forEach(name => {
        if(path === name){
            path = conf.path[name]
        }
    });

    let i = 0,
        ref,
        baseUrl = conf.baseUrl,
        path_arr = path.split('/'),
        len = path_arr.length,
        host = baseUrl.match(/.*:\/\/.*?\//)[0];
    baseUrl = baseUrl.substr(host.length);
    ref = (baseUrl.substr(0,baseUrl.lastIndexOf('/'))).split('/');
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
                (ref.length > 1) && ref.pop();
            } else if (path_arr[i] === '.') {
                // do nothing
            } else {
                ref.push(path_arr[i]);
            }
        }

        path = host + ref.join('/');

    }

    return path
};
export default util;