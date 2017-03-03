//node对象
var nodes=[{name:"父节点1",children:[{name:"子节点11",children:[{name:"子节点111"},{name:"子节点112"},{name:"子节点113"},{name:"子节点114"},{name:"子节点115"}]},{name:"子节点12",children:[{name:"子节点121"},{name:"子节点122",children:[{name:"子节点1221",children:[{name:"子节点12211"},{name:"子节点12212"},{name:"子节点12213",children:[{name:"子节点122131"}]},{name:"子节点12214",children:[{name:"子节点12215",children:[{name:"子节点122151",children:[{name:"子节点1221511",children:[{name:"子节点12215111",children:[{name:"子节点122151111"}]}]}]}]}]}]}]},{name:"子节点123",children:[{name:"子节点1231"}]},{name:"子节点124"}]},{name:"子节点13",children:[{name:"子节点131"}]},{name:"子节点14",children:[{name:"子节点141"}]},{name:"子节点15"},{name:"子节点16"}]},{name:"父节点2",children:[{name:"子节点21"},{name:"子节点22"},{name:"子节点23"},{name:"子节点24"},{name:"子节点25"},{name:"子节点26",children:[{name:"子节点261"}]},{name:"子节点27",children:[{name:"子节点271"}]},{name:"子节点28",children:[{name:"子节点281"}]},{name:"子节点29",children:[{name:"子节点291"}]}]}];



var Element = function() {};
Element.prototype = {
	createNode: function(type) {	/*arguments: type, className, context*/
		var node = document.createElement(type);
		node.className = arguments[1] ? arguments[1] : '';
		node.innerHTML = arguments[2] ? arguments[2] : '';
		return node;
	},
    toggleClass(obj, cls) {
    	var regstr = '(\\s|^)' + cls + '(\\s|$)',
    		hasObj = obj.className.match(new RegExp(regstr));
    	if(!hasObj) {
    		obj.className += " " + cls;
    	} else {
    		var reg = new RegExp(regstr);
            obj.className = obj.className.replace(reg, '');
    	}
    }
};

var nodeTree = function(data) {
	this.data = data;
	this.elem = new Element();
	//遍历生成节点添加进文档
	document.querySelector(".tree-container").appendChild(this.splitData(data));
	this.addEvent();
};
nodeTree.prototype = {
	splitData: function(data) {
		var pNode = this.elem.createNode('ul', 'node');
		for(var item in data) {
			var liNode = this.elem.createNode('li'),
				txtNode = this.elem.createNode('div', 'tree', data[item].name);
			//添加节点文字
			txtNode.className = data[item].children ? 'tree pa' : 'tree';
			liNode.appendChild(txtNode);
			//如果有下一级，继续添加子元素
			if(data[item].children) {
				liNode.appendChild(this.splitData(data[item].children));
			}
			pNode.appendChild(liNode);
		}
		return pNode;
	},
	//添加点击事件
	addEvent: function() {
		var nodeList = document.querySelectorAll(".tree.pa"),
			self = this;
		nodeList.forEach(function(item){
			item.addEventListener('click',function(){
				var ns = this.parentNode.childNodes[1];	//获取子节点列表
				if(ns) {
					self.elem.toggleClass(this, 'open');
					self.elem.toggleClass(ns, 'open');
				}
			})
		});
	}
};
var newtree = new nodeTree(nodes);