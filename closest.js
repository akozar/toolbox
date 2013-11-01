'use strict'
/**
 * Returns first element, of node parents, that matches callback returned true for.
 * @param  {DOMNode}   node
 * @param  {Function} callback
 * @return {DOMNode}
 */
function closest(node, callback) {
	if (node && node.parentNode && Object.prototype.toString.call(callback)==="[object Function]"){
		if (callback(node)===true){
			return node;
		}
		if (callback(node.parentNode)===true) {
			return node.parentNode;
		} else {
			node = node.parentNode;
			return closest.call(this,node,callback);
		};
	};
	return false;
};