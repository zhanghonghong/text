$(function(){
	var cartHandler = {
		cart: {},
		payCart: {},
		totalPrice: $('.total-price em'),
		checkBoxAll: $('.checkbox-all'),
		totalPriceAll: $('.cart-bar .total-price em'),
		
		init: function(){
			this.handleData();
			this.inputCheck();
			this.increaseClick();
			this.decreaseClick();
			this.delete();
			this.checkbox();
			this.totalPrice();
		},
		//读取购物车cookie
		readCart: function(){
			this.cart = $.cookie('xiaomi-cart');
			this.cart = JSON.parse(this.cart);
			console.log(this.cart);
		},
		//设置购物车cookie
		setCart: function(){
			$.cookie('xiaomi-cart',JSON.stringify(this.cart),{expires:365,path:'/zhanghonghong'});
			console.log($.cookie('xiaomi-cart'));
		},
		//处理购物车数据，拼接字符串，放到页面上
		handleData: function(){
			this.readCart();
			var cartStr = '';
			var amount = parseFloat( $('.goods-num ').val());
			for(var key in this.cart){
				var obj = this.cart[key];
			cartStr +='<div class="item-row clearfix" data-node-id="'+obj.idV+'"><div class="col col-check"><input class="checkbox checkbox-one" type="checkbox" /></div>'
					+	'<div class="col col-img"><a href="#"><img src="'+obj.img+'" width="80px" height="80px"></a></div>'
					+	'<div class="col col-name">';
			cartStr	+=	'<h3 class="name" data-node-id="'+obj.idC+'"><a class="#">'+obj.nameV+'&nbsp;'+obj.nameC+'</a></h3>'
					+	'</div>';
			cartStr	+=	'<div class="col col-price">'+obj.price+'</div>';
			cartStr	+=	'<div class="col col-num">'
					+		'<div class="change-goods-num clearfix J_changeGoodsNum">'
					+			'<a href="javascript:;" class="J_minus">-</a>'
					+			'<input tyep="text" name="2161700016_0_buy" value="'+obj.gamount+'" data-num="1" data-buylimit="50" autocomplete="off" class="goods-num J_goodsNum">'
					+			'<a href="javascript:;" class="J_plus">+</a>'
					+		'</div>'
					+	'</div>';
			cartStr	+=	'<div class="col col-total">'+obj.price*obj.gamount+'元</div>'
					+	'<div class="col col-action"><a href="javascript:;">删除</a></div>'
					+'</div>';
			}
			$('.item-table').append(cartStr);
			//console.log(obj);
			//console.log(obj.gamount);
			
		},
		optionHandle: function(obj,val){
			//处理总价
			var money = obj.parents('.item-row').find('.col-total');
			var price = obj.parents('.item-row').find('.col-price');
			//console.log(money);
			money.text(val * parseFloat(price.text()));
			
			var idV = obj.parents('.item-row').data('node-id');
			//console.log(idV);
			this.cart[idV].gamount = val;
			//console.log(this.cart[idV].gamount);
			this.setCart();
			
		},
		inputCheck: function(){
			var that = this;
			$('.item-row').each(function(){
				$(this).find('.goods-num ').on('input propertychange',function(){
					//that.inputValueCheck();
					var reg = /^[1-9]\d*$/;
					var amount = $(this).val();
					var buyLimit = $(this).data('buylimit');
					console.log(amount,buyLimit);
					if(!reg.test(amount)){
						//只有一个字符
						if(amount.length <= 1){
							amount = 1;
						}
						//不合法（最后一个不符合或者前面不合法）
						else{
							amount = amount.substr(0,amount.length -1);
						}
						//如果排除了最后一个字符不合法的情况，依然不合法，中间不合法
						if(!reg.test(amount)){
							amount = parseInt(amount);
						}
					}
					if(amount > buyLimit){
						amount = buyLimit;
					}
					$(this).html(amount);
					that.optionHandle($(this),amount);
					that.totalPrice();
				});			
			});
		},
		increaseClick: function(){
			var that = this;
			var buyLimit = $('.goods-num ').data('buylimit');
			$('.item-row').each(function(){
				//console.log($(this));
				$(this).find('.J_plus').click(function(){
					
					var val = parseInt($(this).prev().val());
					//console.log(val);
					if(val>=buyLimit){
						return;
					}
					val++;
					console.log($(this).prev());
					$(this).prev().val(val);
					that.readCart();
					that.optionHandle($(this),val);
					that.totalPrice();
				});
			});
		},
		decreaseClick: function(){
			var that = this;
			var buyLimit = $('.goods-num ').data('buylimit');
			$('.item-row').each(function(){
				//console.log($(this));
				$(this).find('.J_minus').click(function(){
					
					var val = parseInt($(this).next().val());
					//console.log(val);
					if(val<=1){
						return;
					}
					val--;
					$(this).next().val(val);
					that.readCart();
					that.optionHandle($(this),val);
					that.totalPrice();
				});
			});
		},
		delete: function(){
			var that = this;
			$('.item-row').each(function(){
				$(this).find('.col-action').click(function(){
					$('.modal-backdrop').css({display:'block'});
					if(confirm('确定删除宝贝吗？')){
						var item = $(this).parents('.item-row');
						var idV = item.data('node-id');
						$('.modal-backdrop').css({display:'none'});
						item.remove();
						delete that.cart[idV];
						that.setCart();
					}else{
						$('.modal-backdrop').css({display:'none'});
					}
					
				});
			});
		},
		//文本框处理
		checkbox: function(){
			var that = this;
			var checkBoxOne = $('.checkbox-one');
			//全选框处理
			this.checkBoxAll.click(function(){
				$('.btn').addClass('btn-primary');
				if($(this).prop('checked')){
					checkBoxOne.each(function(k){
						$(this)[k] = k;
						checkBoxOne.eq(k).prop('checked',true).addClass('checked');
					});
				}else{
					checkBoxOne.each(function(k){
						$(this)[k] = k;
						checkBoxOne.eq(k).prop('checked',false).removeClass('checked');
					});
					$('.btn').removeClass('btn-primary');
					$(this).removeClass('checked');
				}
				that.totalPrice();
			});
			//单选框处理
			checkBoxOne.each(function(k){
				checkBoxOne.eq(k).click(function(){
					$(this)[k] = k;
					var checkboxs = $('.item-table').find('input[type="checkbox"]');
					
					//单选框选中，把对应的价钱加到总计
					if($(this).prop('checked')){
						$(this).addClass('checked');
						$('.btn').addClass('btn-primary');
					}else{
						$(this).removeClass('checked');
						if(!$(this).prop('checked')){
							that.checkBoxAll.prop('checked',false);
						}
					}
					
					that.totalPrice();
					//所有单选框选中之后，让全选框选中，否则全选框不选中
					for(var i = 0;i<checkboxs.length;i++){
						if(!checkboxs.eq(i).prop('checked')){
							that.checkBoxAll.prop('checked',false);
							return;
						}else{
							that.checkBoxAll.prop('checked',true);
						}
					}
				});
			});
			
		},
		totalPrice:function(){
			var money = 0;
			var total = $('.item-row .col-check .checked').parents('.item-row').find('.col-total');
			console.log(total);
			total.each(function(k){
				money += parseInt( total.eq(k).text() );
			});
			money = money.toFixed(2);
			console.log(money);
			$('.total-price em').text(money);
			
			if(money == 0){
				$('.btn').removeClass('btn-primary');
			}
		}

	};
	
	cartHandler.init();
	
	
});

