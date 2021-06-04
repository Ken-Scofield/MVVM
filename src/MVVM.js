function MVVM(options){
   this.$options = options || {};
   this.$data = this.$options.data;
   this.$el = document.querySelector(this.$options.el); // todo 异常判断
   // 封装数据代理 vm.$data --> vm.data
   Object.keys(this.$data).forEach(key=>{
	   this.proxyData(key)
   })
   this.init();
}
MVVM.prototype.init = function(){
   //var prop = 'name' //暂时写死属性名name
   observer(this.$data)
   /*
   this.$el.innerText = this.$data[prop] 
   new Watcher(this, prop, value => {
     this.$el.innerText = value
   })
   */
   this.$compile = new Compile(this)
}

MVVM.prototype.proxyData = function (key) {
	Object.defineProperty(this, key, {
       get: function () {
         return this.$data[key]
       },
       set: function (value) {
         this.$data[key] = value;
       }
   });
}