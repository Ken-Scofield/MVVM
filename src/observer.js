/**
 ** 改成类
 **/
function Observer(data) {
	this.data = data;
	this.walk(data);
}

Observer.prototype = {
	constructor: Observer,
	walk: function (data){
		let _this = this;
		Object.keys(data).forEach(function(key){
			_this.convert(key, data[key])
		})
	},
	convert: function (key, val) {
		this.defineReactive(this.data, key, val)
	},
	defineReactive: function (data, key, val){
		let childObj = observer(val);
		let dep = new Dep(); //订阅收集
		
		Object.defineProperty(data, key,{
			enumerable: true,
			configurable: false, // 不能再define
			get: function () {
				Dep.target && dep.depend();
					
				//dep.addSub(Dep.target);
				
				return val;
			},
			set: function (newVal){
				if(newVal===val){
					return
				}

				console.log('监听到数值变化',val,'--->',newVal);
				val = newVal;
				console.log("劫持到值变化，通知Dep")
				childObj = observer(newVal);
				dep.notify();
			}
		})
    }
}

function observer(value) {
	if(!value || typeof value !== 'object') {
		return
	}
	
	return new Observer(value)
}

let id = 0;

function Dep() {
	this.subs = [];
	this.uid = id++;
}

Dep.prototype.addSub = function (sub) {
	this.subs.push(sub);
	//this.uid++;
}

Dep.prototype.notify = function (){
	console.log('侦听到属性变化，通知 Watcher 执行更新视图函数')
	this.subs.forEach(sub=>{
		sub.update(); // 视图更新
	})
}

Dep.prototype.depend = function (){
	Dep.target.addDep(this)
}

Dep.target = null; // target用来收集一个个watcher实例


















