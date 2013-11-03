// Плагин использует первый выбранный элемент из коллекции.
// click.preventDefault() is set
// Окно ресайзится под контент, если контент больше размеров.
// Запускать из консоли

'use strict'
jQuery.fn.extend({
	makePopup: function(settingsObj){	
		var origEl = $(this).eq(0);
		var _content = origEl.clone(true,true);
		// Задавал размеры клонированного элемента, т.к. его размер становился нулевым
		_content.width( origEl.width());
		_content.height( origEl.height());
		var settings = {};
		var defSettings = {
			width: 0,
			height: 0,
			animationFrom: 'center'
		}
		function getViewport(){
			return {
				width: $(window).width(),
				height: $(window).height()
			}
		}
		// creates and returns popup
		function createPopup(){
			var popup = $(document.createElement('div'));
			var closingSpan = $(document.createElement('span'));
			var container = $(document.createElement('div'));
			var content = _content;
			if (!settingsObj) {
				settings = defSettings;
				popup.attr('data-animfrom', 'center');
			} else {
				if (settingsObj.hasOwnProperty('width')) {
					settings.width = settingsObj.width
				} else {
					settings.width = defSettings.width
				}
				if (settingsObj.hasOwnProperty('height')) {
					settings.height = settingsObj.height
				} else {
					settings.height = defSettings.height
				}
				if (settingsObj.hasOwnProperty('animationFrom') && (settingsObj.animationFrom === 'center' || settingsObj.animationFrom === 'click')) {
					popup.attr('data-animfrom', settingsObj.animationFrom);
				} 
			}
			popup.addClass('ak-popup'+$("*[class*='ak-popup']").length);
			popup.css({
				'z-index':99,
				'width':settings.width,
				'height':settings.height+10,
				'backgroundColor' : 'gray',
				'position' : 'absolute',
				'display':'none'
			});
			if (content.width()>settings.width){
				popup.css('width',content.width());
			}
			if (content.height()>settings.height){				
				popup.css('height',content.height()+30);
			}
			closingSpan.css({
				'color': 'white',
				'cursor': 'pointer',
				'height': 10
			});
			container.css({
				'height':popup.height()-20,
				'backgroundColor':'#EBEBE0',
				'overflow':'hidden',
				'padding-left':((popup.width()-content.width())/2),
				'padding-top':((popup.height()-content.height())/2)-10
			});

			closingSpan.addClass('popup-close');
			closingSpan.text('Click to close [x]');
			closingSpan.appendTo(popup);
			content.appendTo(container);
			container.appendTo(popup);
			popup.appendTo($(document.body));
			return popup;
		};
		function makeBlockBG(){
			var blockDiv = $(document.createElement('div'));
			blockDiv.addClass('block-div popup-close');
			blockDiv.css({
				'position':'absolute',
				'display':'none',
				'z-index':1,
				'top':'0px',
				'left':'0px',
				'width':9999,
				'height':$(document).height(),
				'backgroundColor':'black',
				'opacity':0.6
			});
			blockDiv.appendTo($(document.body));
			return blockDiv;
		};

		$(window).bind('scroll resize',function(){
			popup.css({
				'top' : getViewport().height/2-settings.height/2+$(window).scrollTop(),
				'left' : getViewport().width/2-settings.width/2+$(window).scrollLeft()
			})
		})
		var blockDiv = makeBlockBG();	
		var popup = createPopup();
		origEl.bind('click',function(event){
			event.preventDefault();
			popup.openPopup(event);
		})
		$('.popup-close').bind('click',function(){
			popup.closePopup();
		});
		$("body").keydown(function(event){
			if (event.which === 27){
				popup.closePopup();
			}
		})
	},
	openPopup: function(event){
		if(this.length === 0 ){
			return;
		}
		$('.block-div').show();
		var popupWidth = this.css('width');
		var popupHeight = this.css('height');
		this.css({
			'top' : $(window).height()/2,
			'left' : $(window).width()/2,
			'width' : 0,
			'height' : 0,
			'display': 'block'
		})
		if (this.data().animfrom ==='center' || !event){
			this.animate({
				width: popupWidth,
				height: (parseInt(popupHeight))+'px',
				top:($(window).height()/2-parseInt(popupHeight)/2+$(window).scrollTop()),
				left:($(window).width()/2-parseInt(popupWidth)/2+$(window).scrollLeft())
			},600)
		} else {
			this.css({
				'top':event.pageY,
				'left':event.pageX
			})
			this.animate({
				width: popupWidth,
				height: (parseInt(popupHeight))+'px',
				top:($(window).height()/2-parseInt(popupHeight)/2+$(window).scrollTop()),
				left:($(window).width()/2-parseInt(popupWidth)/2+$(window).scrollLeft())
			},600)
		}
	},
	closePopup: function(){
		var popupWidth = this.css('width');
		var popupHeight = this.css('height');
		$("*[class*='ak-popup']").fadeOut('slow',function(){
					$('.block-div').hide();	
		});
		this.css({
			'width' : popupWidth,
			'height' : popupHeight,
		})
	}
});

$('.logo').makePopup();
$('#broadcast').makePopup({
	height:300,
	width:300,
	animationFrom:'click'
});

$('.ak-popup0').openPopup();


