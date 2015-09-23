/**
 * Adds classes to node element. Does not add class, if it has already presents.
 * @param {DOMNode} node     
 * @param {String|Array} className 
 */
	function addClass(node, className) {
		var classArr = [];
		var nodeClassName = node.className || '';
		if (node && Object.prototype.toString.call(className)==="[object String]"){
			classArr[0]=className; 
		} else if (node && Object.prototype.toString.call(className)==="[object Array]") {
			classArr = className.slice();
		} else {
			throw "Invalid arguments";
		};
		//adding classes
		for (var i = 0 ; i < classArr.length; i++) {
			if (nodeClassName.length===0) {
				nodeClassName = classArr[i];
			} else if (classArr[i] && nodeClassName.split(' ').indexOf(className) === -1 ){ 
				nodeClassName += ' ' + classArr[i]; 
			};
		};
		node.setAttribute('class',nodeClassName);
	}
