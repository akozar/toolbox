/**
 * Removes all classes, that match className (which can be either string or array)
 * @param  {DOMNode} node      
 * @param  {String|Array} className
 */

	function removeClass(node, className) {
		var classArr = [];
		var nodeClassName = node.className || node.getAttribute('class') || '';
		// transforming className to array if need
		if (!nodeClassName) {return;}
		if (node && Object.prototype.toString.call(className)==="[object String]"){			
			classArr[0] = className;
		} else if (node && Object.prototype.toString.call(className)==="[object Array]"){
			classArr = className.slice();
		} else {
			throw "Invalid arguments";
		};	
		for (var i = 0; i<classArr.length; i++){
			if (nodeClassName.split(' ').indexOf(classArr[i]) === 0) {
				nodeClassName = nodeClassName.slice(classArr[i].length + 1);
			} else if (nodeClassName.split(' ').indexOf(classArr[i])===-1){
				//nothing to do
			} else {
				// removing classes and deleting extra spaces
				nodeClassName = nodeClassName.replace(classArr[i], '');
				nodeClassName = nodeClassName.replace(/\s+/g, ' ');
				nodeClassName = nodeClassName.replace(/\ $/, "");
			};			
		};
		node.setAttribute('class',nodeClassName);
		return node;
	};



