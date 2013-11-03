// Парсинг страниц розетки для извлечения доступной информации о товарах, в данном случае флешек.
// Скрипт запускать с основной страницы категории http://rozetka.com.ua/usb-flash-memory/c80045/
// Необходимо подождать несколько секунд пока подгрузятся все запросы с остальных страниц

(function(){
	'use strict'
	var next = (function() {
	var TEXT_NODE = 3;
	var COMMENT_NODE = 8;
	return function checkNode (node) { // функция, проверяющая не текст/коммент ли следующий узел
		var nextSiblingNode = node.nextSibling;
		// если следующего соседа нет, прекращаем его поиск
		if (nextSiblingNode) {
			if (nextSiblingNode.nodeType !== TEXT_NODE && nextSiblingNode.nodeType !==
				COMMENT_NODE) {
				return nextSiblingNode;
			} else {
				// следующий сосед попал под исключающее условие, проверяем следующего
				return next.call(this,node.nextSibling);
			};
		} else {
			return false;
		};
	}
  }());


	var XHR;
	var maxPage = getMaxPage();
	var curPage = 0;
	var prodList = [];

	function getMaxPage (){
		var pagesWrapper = document.querySelector('.goods-pages-list');
		var curEl, lastPage;
		if (pagesWrapper) {
			curEl = pagesWrapper.childNodes[pagesWrapper.childNodes.length-2];
			if (next(curEl) !== false) {
				curEl = next(curEl)
			}
			lastPage = curEl.id.replace('page','');
		} else {
			lastPage = 1;
		}
		return lastPage;
	}

	function genUrl (curPage){
		if (maxPage!==1 && curPage === 0) {
			return document.URL;
		} else if (maxPage!==1) {
			return (document.URL+'page='+(curPage+1));
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
			alert('Giving up :( Cannot create an XMLHTTP instance');
			return false;
		}
		XHR.onreadystatechange = getContent;
		XHR.open('GET', url);
		XHR.send();
	}


	function getProdInf(node){
		var prodWrapper = node.querySelectorAll('.gtile-i-wrap');

		function getProdObj(prodNode) {
			var oProd = {};
			// information nodes
			var nameNode = prodNode.querySelector('.gtile-i-title a');
			var uahpriceNode = prodNode.querySelector('.g-price-uah');
			var usdpriceNode = prodNode.querySelector('.g-price-usd');

			oProd.url = nameNode.getAttribute('href');
			oProd.name = nameNode.innerText.match(/\S+/g).join(' ');
			oProd.storageCapacity = nameNode.innerText.match(/\d+/g)[0];
			if (uahpriceNode) {
				oProd.uahprice = uahpriceNode.innerText.replace(/([^0-9])/gi,'');
			};
			if (usdpriceNode) {
				oProd.usdprice = usdpriceNode.innerText.replace(/([^0-9])/gi,'');
			};
			return oProd;
		}

		for (var i = 0; i<prodWrapper.length; i++){
			prodList.push(getProdObj(prodWrapper[i]));
		}
	}

	function getContent() {
			if (XHR.readyState === 4) {  
				if (XHR.status === 200) {

					var divWrapper = document.createElement('div');
					divWrapper.innerHTML = XHR.responseText;
					getProdInf(divWrapper);
					if (curPage<maxPage){
						curPage+=1;
						makeRequest(genUrl(curPage));
					} else {
						console.log(prodList);
					}
				}
			}
	}
	return makeRequest(curPage);
}());

