
let uid = 0;
/**
 * watcher就是每一个task=>即callback
 * 订阅器
 * @param {Object} depName 
 */
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

export default Dep;

