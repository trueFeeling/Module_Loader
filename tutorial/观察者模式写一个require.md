在 [简单的浏览器端js模块加载器[代码解读]](https://github.com/trueFeeling/Front-End-Recordings/issues/2)，这篇文章中，了解了一个简单的require是如何实现的。

最近看了如何实现一个MVVM的文章，恍然大悟，其实模块加载器也可以使用类似的方法。这里，每一个callback就被放在一个实例化的Watcher对象里。 
```javascript
function createWatcher(callback, deps, dep) {
    return new Watcher(callback, deps, dep, Module)
}
```
我们最后暴露的requirejs会指向下面这个对象。baseUrl被设置后，所有的路径都相对于该baseUrl，如果没有被设置，那么我们会将当前require.js的地址作为baseUrl，module存放模块。
```javascript
let Module = {
    config: {
        baseUrl: "",
        paths: {}
    },

    module: {

    },
    host: location.protocol + '//' + location.host
};

```


callback是我们需要执行的函数。这个callback可以是require里面的待执行函数，也可以是define里面有依赖另一个define的函数。如果define里面没有依赖，则不会放入Wathcer里面。
```javascript
require(['./ww.js', function(ww){
      //...
}]);

define(['./aa.js', function(aa){
    return aa
}]);
```

我们再来看看Watcher这个构造函数。task是一个待执行的callback，uris是这个异步callback所依赖的模块(地址)，dep是一个订阅器。$len是依赖模块的数组长度。如果一个模块加载好了，那么通知这个Watcher，这个Watcher的$len变量就减一。对于一个Watcher，我们不用关心当前到底是哪个模块加载好了，反正只能是所有依赖模块加载好，这个task才能被执行。所以当$len为零的时候，表面依赖全部加载好，那么这个Wathcer就执行这个task
```javascript
function Watcher(task, uris, dep, Module){
    this.$task = task;
    this.$uris = uris;
    this.dep = dep;
    this.$Module = Module;
    this.modArr = [];
    this.$len = this.$uris.length;
}
```
Watcher每执行一次update，this.$len--。当为零的时候，执行this.run()方法。this.run()中，如果task是一个函数，那么执行执行。因为在define函数中，如果define里面没有依赖，就会将其callback直接放入Watcher。如果有依赖，则会先创建一个task对象，将当前define脚本的src存入task，以便触发该dep的notify方法。
```javascript
Watcher.prototype = {
    update: function () {
        this.$len--;
        if (this.$len <= 0) {
            this.run();
        }
    },

    run: function () {
        let mod = this.$Module.module,
            task = this.$task;

        this.$uris.forEach(uri => {
            this.modArr.push(mod[uri].obj);
        });
        //this.$Module.module[this.dep.depName].obj =
        if (typeof task == 'function') {
            task.apply(null, this.modArr);
            return
        }
        let src = task.currentSrc;
        mod[src].obj = task.callback.apply(null, this.modArr);
        mod[src].dep.notify();
        this.dep.removeSub(this);
        return
    }
};
```


下面我们来讲讲Dep订阅器。对于每一个模块，我们用一个订阅器来存放它，它的subs数组，存放所有依赖于它才能执行的task，即Watcher。不管define有多深，模块a依赖于模块b，模块b依赖于模块c。当模块c加载好后(约定模块c是不依赖于任何其他模块的)，模块c的订阅器dep触发notify方法，subs里面的Watcher的update方法。
```javascript
function Dep(depName){
    this.id = uid++;
    this.subs = [];
    this.depName = depName;
}

Dep.prototype = {
    /**
     * 添加订阅, 将watcher添加进数组subs
     * @param {Object} task new watcher()
     */
    addSubs: function(task){
        this.subs.push(task);
    },
    /**
     * 删除订阅, 将watcher从数组subs中删除
     * @param {Object} task new watcher()
     */
    removeSub: function(task){
        let index = this.subs.indexOf(task);
        (index != -1) && this.subs.splice(index, 1);
    },
    /**
     * 当该模块加载好的时候, 通知所有依赖它的task
     */
    notify: function(){
        this.subs.forEach(task => {
            task.update();
        });
    }
};
```

以上是代码的部分解析...