// This code makes infinite scrolling page from site http://www.explosm.net
// Use it on random comics page from console
// http://www.explosm.net/comics/3000/

(function(){
	'use strict'
	var XHR;
	var imgContainer = getImg(document).wrapper;
	var indImg = document.URL.match(/\d+/)[0];
	var lastImg; // domNode with last image shown
	indImg--;
	// *** HELPERS *** //

	function bind(domNode, event, handler) {
		var handlerWrapper = function(event) {
			event = event || window.event;
			if (!event.target && event.srcElement) {
				event.target = event.srcElement;
			}
			return handler.call(domNode, event);
		};

		if (domNode.addEventListener) {
			domNode.addEventListener(event, handlerWrapper, false);
		} else if (domNode.attachEvent) {
			domNode.attachEvent('on' + event, handlerWrapper);
		}
		return handlerWrapper;
	}
	function unbind(obj, event_name, handler_wrapper) {
		if (obj.removeEventListener) {
			obj.removeEventListener(event_name, handler_wrapper, false);
		} else if (obj.detachEvent) {
			obj.detachEvent('on' + event_name, handler_wrapper);
		}
	}
	function getOffsetRect(elem) {
		var box = elem.getBoundingClientRect();

		var body = document.body;
		var docElem = document.documentElement;

		var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

		var clientTop = docElem.clientTop || body.clientTop || 0;
		var clientLeft = docElem.clientLeft || body.clientLeft || 0;

		var top = box.top + scrollTop - clientTop;
		var left = box.left + scrollLeft - clientLeft;

		return {
			top: Math.round(top),
			left: Math.round(left)
		}
	}
	function makeRequest(url) {
		if (window.XMLHttpRequest) { // Mozilla, Safari, ...
			XHR = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE
			try {
				XHR = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					XHR = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {}
			}
		}
		if (!XHR) {
			throw 'Giving up :( Cannot create an XMLHTTP instance';
			return false;
		}
		XHR.onreadystatechange = loadImg;
		XHR.open('GET', url);
		XHR.send();
	}

	// *** MAIN CODE *** //

	function genUrl (ind) {
		var prevURL = document.URL.replace(/\d+/,ind);
		return prevURL;
	}
	// function retrieves image from node
	function getImg(node){
		var img = node.querySelector('#comic-container img');
		if (!img) {
			indImg--;
			makeRequest(genUrl(indImg));
			console.log(indImg);
		}
		return {
			img:	img,
			wrapper: img.parentNode
		}
	}
	// function makes request if last image is visible on screen
	function scrollHandler(event) {
		var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
		var imgArr = document.querySelectorAll('#comic-container img');
		var windowHeight = document.documentElement.clientHeight;
		var lastImg = imgArr[imgArr.length-1];
		if (getOffsetRect(lastImg).top < (scrollTop + windowHeight)){
			if (XHR.readyState === 4 && XHR.status === 200) {
				indImg--;
				makeRequest(genUrl(indImg));
				unbind(window,'scroll',scrollHandler);
			}
		}
	}
	// loading and adding image to page
	function loadImg(){
		if (XHR.readyState === 4) {
			if (XHR.status === 200)  {
				var wrapper = document.createElement('div');
				wrapper.innerHTML = XHR.responseText;
				lastImg = getImg(wrapper).img;
				imgContainer.appendChild(lastImg);
				bind(window,'scroll',scrollHandler);
			}
		}
	}

  return makeRequest(genUrl(indImg));

}())
