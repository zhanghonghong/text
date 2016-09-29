$(function(){
	/*nav导航*/
	var nav = {
		navItem: $('.nav-item:lt(7)'),
		navMenu: $('.header-nav-menu'),	
		flag: 1,
		index:0,
		timer: null,
		init: function(){
			this.navItemHover();
			//console.log(this.navMenu);
		},
		navItemHover: function(){
			var that = this;
			this.navItem.each(function(k){
				$(this).hover(function(){
					that.index = k;
					clearTimeout( that.timer );
					if(that.flag){
						$(this).find(that.navMenu).stop(true).slideDown();
						that.flag  = 0;
					}else{
						$(this).find(that.navMenu).show();
						$(this).siblings().find(that.navMenu).hide();
					}
				});
			});
			//移出ul或后两个li时让navMenu隐藏
			$('.nav-list').mouseleave(function(e){
				slideUp();			
			});
			$('.nav-item:gt(6),.site-category').mouseenter(function(e){
				slideUp();			
			});
			function slideUp(){
				that.flag  = 1;
				that.timer = setTimeout(function(){
					that.navMenu.eq(that.index).stop().slideUp(400,function(){
						$(this).hide();
					});
				},70);	
			}
		}
	};
	nav.init();


	/*搜索框*/
	var srarch = {
		searchText: $('.search-text'),
		dataSearch: $('.data-search'),
		searchBtn: $('.search-btn'),
		init: function(){
			//console.log(this.searchText);
			this.searchTextClick();
			
		},
		searchTextClick: function(){
			var that = this;
			var str = '<ul class="result-list">'
					+ '<li class="first"><a href="#">小米手机5<span>约有11件</span></a></li>'
					+ '<li><a href="#">空气净化器<span>约有1件</span></a></li>'
					+ '<li><a href="#">活塞耳机<span>约有4件</span></a></li>'
					+ '<li><a href="#">小米路由器<span>约有8件</span></a></li>'
					+ '<li><a href="#">移动电源<span>约有21件</span></a></li>'
					+ '<li><a href="#">运动相机<span>约有2件</span></a></li>'
					+ '<li><a href="#">小蚁摄像机<span>约有2件</span></a></li>'
					+ '<li><a href="#">小米体重秤<span>约有1件</span></a></li>'
					+ '<li><a href="#">小米插线板<span>约有13件</span></a></li>'
					+ '<li><a href="#">配件优惠套装<span>约有32件</span></a></li>'
					+'</ul>';
			this.searchText.focus(function(){
				that.searchText.css({borderColor:'#FF6700'});
				that.searchBtn.css({borderColor:'#FF6700'});
				that.dataSearch.show();
				$('.search-hot-words').hide();
				that.dataSearch.append(str);
			});
			this.searchText.blur(function(){
				that.searchText.css({borderColor:'#e0e0e0'});
				that.searchBtn.css({borderColor:'#e0e0e0'});
				that.dataSearch.hide();
				if($(this).val()){
					$('.search-hot-words').hide();
				}else{
					$('.search-hot-words').show();
				}
				$('.result-list').remove();
			});
			this.searchText.on('input propertychange',function(){
				var value = $(this).val();
				console.log(value);
				var lis = $('.result-list li');
				var len = lis.length;
				for(var i = 0;i<len;i++){
					var text = lis.eq(i).html();
					//console.log(text,value);
					if(text.indexOf(value) > -1){
						lis.eq(i).css({display:'block'});
					}else{
						lis.eq(i).css({display:'none'});
					}
				}
			});
		}
	};
	srarch.init();


	/*banner 轮播*/
	var banner = {
		imgItem: $('.img-item'),
		banner: $('.banner'),
		earLeft: $('.ear-left'),
		earRight: $('.ear-right'),
		circleItem: $('.circle-item'),
		now: 0,
		next: 0,
		timer: null,
		init: function(){
			this.autoPlay();
			this.bannerHover();
			this.earLeftClick();
			this.earRightClick();
			this.circleItemHover();
		},
		earRightClick: function(){
			var that = this;
			this.earRight.click(function(){
				that.next++;
				that.next %= that.imgItem.length;
				that.changeImg();
			});
		},
		earLeftClick: function(){
			var that = this;
			this.earLeft.click(function(){
				that.next--;
				if(that.next <= 0){
					that.next = that.imgItem.length -1 ;
				}
				that.changeImg();
			});
			
		},
		bannerHover: function(){
			var that = this;
			this.banner.hover(function(){
				clearInterval(that.timer);
			},function(){
				that.autoPlay();
			});
		},
		circleItemHover: function(){
			var that = this;
			for(var i = 0;i<this.circleItem.length;i++){
				this.circleItem[i].num = i;
				this.circleItem.eq(i).hover(function(){
					that.next = this.num;
					that.changeImg();
				});
			}
		},
		autoPlay: function(){
			var that = this;
			this.timer = setInterval(function(){
				that.next++;
				that.next %= that.imgItem.length;
				that.changeImg();	
			},2500);
		},
		changeImg: function(){
			this.imgItem.eq(this.now).animate({
				opacity: 0
			},1000);
			this.imgItem.eq(this.next).animate({
				opacity: 1
			},1000);
			this.imgItem.eq(this.now).removeClass('img-active');
			this.imgItem.eq(this.next).addClass('img-active');
			/*小圆圈跟随*/
			this.circleItem.eq(this.now).removeClass('active');
			this.circleItem.eq(this.next).addClass('active');
			this.now = this.next;
		}
	}
	banner.init();

	/*滑动封装*/
	function SlideBanner(obj){
		this.change = obj;
		this.goodsList = obj.find('.goods-list');
		this.lis = obj.find('.goods-list li');
		this.controlPrev = obj.find('.control-pre');
		this.controlNext = obj.find('.control-nex');
		this.control = obj.find('.control');
		this.index = 0;
		this.timer = null;
		this.val = Math.ceil( this.goodsList.width()/1240 ) -1;
	};
	SlideBanner.prototype = {
		constructor: Tabchange.prototype.constructor,
		__proto__: Tabchange.prototype.__proto__,
		init: function(){
			this.controlPrevClick();
			this.controlNextClick();
			this.autoPlay();
			this.lisHover();
		},
		controlPrevClick: function(){
			var that = this;
			this.controlPrev.click(function(){
				that.index--;
				//console.log(that.index);
				if(that.index >= 0){
					that.switchImg();
				}
			});
		},
		controlNextClick: function(){
			var that = this;
			this.controlNext.click(function(){
			//console.log(that.index);
				that.index++;
				//最大上限
				if(that.index <= that.val){
					that.switchImg();
				}
			});
		},
		lisHover: function(){
			var that = this;
			$('.goods-list li,.more').hover(function(){
				clearInterval(that.timer);
			},function(){
				that.autoPlay();
			});
		},
		autoPlay: function(){
			var that = this;
			this.timer = setInterval(function(){
				that.index++;
				if(that.index > that.val){
					that.index = 0;
				}
				that.switchImg();
			},3500);
		},
		switchImg: function(){
			var that = this;
			this.control.addClass('control-active');
			this.control.css({pointerEvents: 'auto'});
			this.goodsList.animate({
				marginLeft: -1240*that.index
			},500,function(){
				//最左边禁用
				if(that.index <=0){
					that.controlPrev.removeClass('control-active');
					that.controlPrev.css({pointerEvents: 'none'});
				}
				//最右边禁用
				if(that.index >= that.val){
					that.controlNext.removeClass('control-active');
					that.controlNext.css({pointerEvents: 'none'});
				}
			});
		}
	};
	
	/*小米明星单品*/
	var slideBanner = new SlideBanner($('.home-star-goods'));
	slideBanner.init();
	/*为你推荐*/
	var slideBanner = new SlideBanner($('.recommend'));
	slideBanner.init();
	

	
	/*选项卡切换*/
	function Tabchange(obj){
		this.change = obj;
		this.lis = obj.find('.tab-list li');
		this.tabConent = obj.find('.tab-content');
	}
	Tabchange.prototype = {
		constructor: Tabchange.prototype.constructor,
		__proto__: Tabchange.prototype.__proto__,
		init: function(){
			this.tabchange();
		},
		tabchange: function(){
			var that = this;
			this.lis.each(function(k){
				this.index = k;
				that.lis.hover(function(){
					that.tabConent.hide();
					that.tabConent.eq(this.index).show();
					that.lis.removeClass('tab-active');
					that.lis.eq(this.index).addClass('tab-active');
				});
				
			});
		}
	};

	var tabchange = new Tabchange($('.match'));
	tabchange.init();
	var tabchange = new Tabchange($('.accessories'));
	tabchange.init();
	var tabchange = new Tabchange($('.around'));
	tabchange.init();
	
	/*内容*/
	function Carousel(obj){
		this.change = obj;
		this.itemList = obj.find($('.item-list'));
		this.lis = obj.find($('.item-list li'));
		this.pager = obj.find($('.pager'));
		this.prev = obj.find($('.control-prev'));
		this.next = obj.find($('.control-next'));
		this.index = 0;
		this.timer = null;
	};
	Carousel.prototype = {
		constructor: Carousel.prototype.constructor,
		__proto__: Carousel.prototype.__proto__,
		init: function(){
			//this.autoPlay();
			this.prevClick();
			this.nextClick();
			this.pagerClick();
		},
		prevClick: function(){
			var that = this;
			this.prev.click(function(){
				that.index--;
				if(that.index >= 0){
					that.switchImg();
				}
				if(that.index <= 0){
					$('.control-prev').css({pointerEvents: 'none'});
				}
			});
		},
		nextClick: function(){
			var that = this;
			this.next.click(function(){
				that.index++;
				var length = that.lis.length - 1;
				if(that.index <= length){
					that.switchImg();
				}
				if(that.index >= length){
					$('.control-next').css({pointerEvents: 'none'});
				}
			});
		},
		pagerClick: function(){
			var that = this;
			this.pager.each(function(k){
				that.pager[k].num = k;
				that.pager.eq(k).click(function(){
					that.index = this.num;
					that.switchImg();
				});
			});
		},
		autoPlay: function(){
			var that = this;
			this.timer = setInterval(function(){
				that.index++;
				that.index %= that.lis.length;
				that.switchImg();
			},3000);
		},
		switchImg: function(){
			var that = this;
			$('.control').css({pointerEvents: 'auto'});
			this.itemList.animate({
				marginLeft: -296 * that.index
			},100);
			this.pager.removeClass('pager-active');
			this.pager.eq(this.index).addClass('pager-active');
		}
		
	};
	
	var carousel = new Carousel($('.content-item-book'));
	carousel.init();
	var carousel = new Carousel($('.content-item-theme'));
	carousel.init();
	var carousel = new Carousel($('.content-item-game'));
	carousel.init();
	var carousel = new Carousel($('.content-item-app'));
	carousel.init();
	
	//购物车上下滑动
	$('.cart-mini').hover(function(){
		$('.cart-menu').stop(true).slideDown();
	},function(){
		$('.cart-menu').stop(true).slideUp();
	});
	
});
