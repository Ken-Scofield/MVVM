function Watcher(vm, prop, callback){
	this.vm = vm;
	this.prop = prop;
	this.depIds = {};
	this.callback = callback;
	this.value = this.getValue(); // new Watcher 后，自动添加进监听
}

Watcher.prototype.update = function() {
	console.log('Watcher的update方法被调用')
	const value = this.vm.$data[this.prop]
	const oldVal = this.value;
	if(value!==oldVal){
		this.value = value;
		this.callback.call(this,value);
	}
}

Watcher.prototype.addDep = function() {
	if (!this.depIds.hasOwnProperty(dep.id)) {
      this.depIds[dep.id] = dep;
      dep.subs.push(this);
    }
}

Watcher.prototype.getValue = function(){
	Dep.target = this; // 存储订阅器
	const value = this.vm.$data[this.prop]; //因为属性被监听，这一步会执行监听器里的 get方法
	Dep.target = null;
	return value
}