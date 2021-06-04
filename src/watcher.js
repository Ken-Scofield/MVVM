function Watcher(vm, prop, cb){
	this.vm = vm;
	this.prop = prop;
	this.depIds = {};
	this.cb = cb;
	if (typeof prop === 'function') {
        this.getter = prop;
    } else {
        this.getter = this.parseGetter(prop.trim());
    }
	this.value = this.getValue(); // new Watcher 后，自动添加进监听
}

Watcher.prototype.update = function() {
	console.log('Watcher的update方法被调用')
	const value = this.vm.$data[this.prop]
	const oldVal = this.value;
	if(value!==oldVal){
		this.value = value;
		this.cb.call(this,value);
	}
}

Watcher.prototype.addDep = function(dep) {
	if (!this.depIds.hasOwnProperty(dep.uid)) {
      this.depIds[dep.uid] = dep;
      dep.subs.push(this); // 在这里将watcher加入到订阅收集器
    }
}

Watcher.prototype.getValue = function(){
	Dep.target = this; // 存储订阅器
	//const value = this.vm.$data[this.prop]; //因为属性被监听，这一步会执行监听器里的 get方法
	const value = this.getter.call(this.vm, this.vm)
	Dep.target = null;
	return value
}

Watcher.prototype.parseGetter = function (exp){
	if (/[^\w.$]/.test(exp)) return; 

        var exps = exp.split('.');

        return function(obj) {
            for (var i = 0, len = exps.length; i < len; i++) {
                if (!obj) return;
                obj = obj[exps[i]];
            }
            return obj;
        }
}