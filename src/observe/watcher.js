/**
 * 
 * @param {Function} task 将要执行的callback
 * @param {Array} uris 该callback所依赖的模块
 * @param {Object} dep new Dep()
 * @param {Object} Module Module
 */

function Watcher(task, uris, dep, Module){
    this.$task = task;
    this.$uris = uris;
    this.dep = dep;
    this.$Module = Module;
    this.modArr = [];
    this.$len = this.$uris.length;
}

Watcher.prototype = {
    update: function(){
        this.$len--;
        this.run();
    },

    run: function(){
        let mod = this.$Module.module,
            task = this.$task;
        if(this.$len<=0){
            this.$uris.forEach(uri => {
                this.modArr.push(mod[uri].obj);
            });
            //this.$Module.module[this.dep.depName].obj =
            if(typeof task == 'function'){
                task.apply(null, this.modArr);
                return
            }
            let src = task.currentSrc;
            mod[src].obj = task.callback.apply(null, this.modArr);
            mod[src].dep.notify(); 
            this.dep.removeSub(this);
        }
        return
    }
};

export default Watcher;