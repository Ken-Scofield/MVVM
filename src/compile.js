function Compile(vm) {
	this.vm = vm;
	this.el = vm.$el; //todo 判断是否是元素结点
	this.fragment = null;
	this.init();
}

Compile.prototype = {
	constructor: Compile,
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
	isEventDirective: function(dir) {
        return dir.indexOf('on') === 0;
    },
	isElementNode: function(node) {
        return node.nodeType === 1
    },
	isTextNode: function(node){
		return node.nodeType === 3
	},
	isDirective(name) {
		if (typeof name !== 'string') return;
        return name.includes('v-');
    },
	/*
	bind: function(node, vm, exp, dir) {
		
		if (dir === 'text'){
			node.textContent = vm[exp]
		} else if (dir === 'html'){
			node.innerHTML = vm[exp]
		} else if (dir === 'value'){
			node.value = vm[exp]
		}
		
		new Watcher(vm, exp, function(){
			if (dir === 'text') {
			  node.textContent = vm[exp];
			} else if (dir === 'html') {
			  node.innerHTML = vm[exp];
			} else if (dir === 'value'){
			  node.value = vm[exp]
		    }
		})
	},
	*/
	compileNode: function(fragment){
		let childNodes = fragment.childNodes;
		[...childNodes].forEach(node=>{
			let reg = /\{\{(.*)\}\}/; // 寻找{{}}语法
			let text = node.textContent;
			if (this.isElementNode(node)){
				this.compile(node);
			} else if(this.isTextNode(node)&&reg.test(text)){
				let prop = RegExp.$1.trim();
				this.compileText(node, prop); // 渲染{{}}模板
			}
			
			// 递归遍历子节点
			if (node.childNodes && node.childNodes.length) {
				this.compileNode(node);
			}
		})
	},
	compileText: function (node, exp) {
		//this.bind(node, this.vm, exp, 'text')
		compileUtil.text(node, this.vm, exp)
	},
	/*
	compileModel: function (node,exp){
		this.bind(node, this.vm, exp, 'value')
	},
	*/
	compile: function (node) {
      let nodeAttrs = node.attributes;
      [...nodeAttrs].forEach(attr => {
        let name = attr.name;
        if (this.isDirective(name)) {
          let exp = attr.value;
		  let dir = name.substring(2);
		  // 判断是否是原生event
		  /*
          if (name === "v-model") {
            this.compileModel(node, exp);
          }
		  */
		  if (this.isEventDirective(dir)){
			  compileUtil.eventHandler(node, this.vm, exp, dir);
		  } else {
			  compileUtil[dir] && compileUtil[dir](node, this.vm, exp);
		  }
          node.removeAttribute(name);
        }
      });
    }
}

// 指令处理集合
const compileUtil = {
    text: function(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },

    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },

    model: function(node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        var me = this,
            val = this._getVMVal(vm, exp);
        node.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }

            me._setVMVal(vm, exp, newValue);
            val = newValue;
        });
    },

    class: function(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },

    bind: function(node, vm, exp, dir) {
        var updaterFn = updater[dir + 'Updater'];

        updaterFn && updaterFn(node, this._getVMVal(vm, exp));
		console.log('新建 new 一个 Watcher',exp,vm)
        new Watcher(vm, exp, function(value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    },

    // 事件处理
    eventHandler: function(node, vm, exp, dir) {
        var eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },

    _getVMVal: function(vm, exp) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k) {
            val = val[k];
        });
        return val;
    },

    _setVMVal: function(vm, exp, value) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                val[k] = value;
            }
        });
    }
};


const updater = {
    textUpdater: function(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },

    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },

    classUpdater: function(node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        var space = className && String(value) ? ' ' : '';

        node.className = className + space + value;
    },

    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
};