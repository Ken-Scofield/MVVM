function observer(data) {
	if(!data || typeof data !== 'object') {
		return
	}
	
	Object.keys(data).forEach(key=>{
        defineReactive(data,key,data[key])		
	})
}

function defineReactive(obj,key,val){
	observer(val);
	var dep = new Dep(); //订阅收集
	
	Object.defineProperty(obj, key,{
		enumerable: true,
		configurable: true,
		get: function getter() {
			if (Dep.target){
				dep.addSub(Dep.target);
			}
			return val;
		},
		set: function setter(newVal){
			if(newVal===val){
				return
			}

			console.log('监听到数值变化',val,'--->',newVal);
			val = newVal;
			dep.notify();
		}
	})
}

function Dep() {
	this.subs = [];
}

Dep.prototype.addSub = function (sub) {
	this.subs.push(sub)
	console.log('Add Sub',this.subs)
}

Dep.prototype.notify = function (){
	console.log('侦听到属性变化，通知 Watcher 执行更新视图函数')
	this.subs.forEach(sub=>{
		sub.update(); // 视图更新
	})
}

Dep.target = null;


















