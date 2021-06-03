function Compile(vm) {
	this.vm = vm;
	this.el = vm.$el;
	this.fragment = null;
	this.init();
}

Compile.prototype = {
	init: function (){
		this.fragment = this.nodeFragment(this.el);
		this.compileNode(this.fragment);
		this.el.appendChild(this.fragment);
	},
	nodeFragment: function (el){
		const fragment = document.createDocumentFragment();
		let child = el.firstChild;
		// 将子节点全部放进文档片段里
		while(child){
			fragment.appendChild(child);
			child = el.firstChild;
		}
		return fragment;
	},
	isElementNode: function(node) {
        return node.nodeType === 1
    },
	isTextNode: function(node){
		return node.nodeType === 3
	},
	isDirective(name) {
		if (typeof name !== 'String') return;
        return name.includes('v-');
    },
	bind: function(node, vm, exp, dir) {
		if (dir === 'text'){
			node.textContent = vm[exp]
		} else if (dir === 'html'){
			node.innerHTML = vm[exp]
		} else if (dir === 'value'){
			node.value = vm[exp]
		}
	},
	compileNode: function(fragment){
		let childNodes = fragment.childNodes;
		[...childNodes].forEach(node=>{
			let reg = /\{\{(.*)\}\}/; // 寻找{{}}语法
			let text = node.textContent;
			if (this.isElementNode(node)){
				this.compile(node);
			} else if(this.isTextNode(node)&&reg.test(text)){
				let prop = RegExp.$1;
				this.compileText(node, prop); // 渲染{{}}模板
			}
			
			// 递归遍历子节点
			if (node.childNodes && node.childNodes.length) {
				this.compileNode(node);
			}
		})
	},
	compileText: function (node, exp) {
		this.bind(node, this.vm, exp, 'text')
	},
	compileModel: function (node,exp){
		this.bind(node, this.vm, exp, 'value')
	},
	compile: function (node) {
      let nodeAttrs = node.attributes;
      [...nodeAttrs].forEach(attr => {
        let name = attr.name;
        if (this.isDirective(name)) {
          let value = attr.value;
          if (name === "v-model") {
            this.compileModel(node, value);
          }
          node.removeAttribute(name);
        }
      });
    }
}