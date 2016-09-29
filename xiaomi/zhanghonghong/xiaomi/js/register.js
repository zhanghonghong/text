$(function(){
	var register = {
		register: $('.register'),
		mainbox: $('.mainbox'),
		regbox: $('.regbox'),
		listtit: $('.listtit'),
		countryCode: $('.country-code'),
		inputbg: $('.inputbg'),
		phoneInput: $('.inputbg input'),
		password: $('.password'),
		passwordInput: $('.password input'),
		errTipPhone: $('.err_tip_phone'),
		errTipPsw: $('.err_tip_psw'),
		errTipCheck: $('.err_tip_checknum'),
		checkbox: $('.checkbox'),
		checkboxInput: $('.checkbox input'),
		labelbox: $('.labelbox'),
		regBtn: $('.reg-btn'),
		//flag: true,
		validate: [],
		vd: {
			uphone: true,
			upsw: true
		},
		init: function(){
			this.validate = [
				{"src":"img/validate/1.png","value":"pHP2p"},
				{"src":"img/validate/2.png","value":"DRXR8"},
				{"src":"img/validate/3.png","value":"HReay"},
				{"src":"img/validate/4.png","value":"5EXPN"},
				{"src":"img/validate/5.png","value":"RY3XH"},
				{"src":"img/validate/6.png","value":"yKdE3"},
				{"src":"img/validate/7.png","value":"2WE8P"},
				{"src":"img/validate/8.png","value":"DRDE8"}
			];
			this.phoneInputBlur();
			this.checkboxInputBlur();
			this.regBtnClick();
			this.listtitClick();
			this.pswCheck();
		},
		listtitClick: function(){
			var that = this;
			this.listtit.click(function(e){
				$('.container').remove();
				var str = '<div class="container">'
					+'<div class="header">常用</div>'
					+'<ul class="list">'
					+ 	'<li class="record clearfix"><span class="record-country" data-code="+86">中国</span><span class="record-code">+86</span></li>'
					+ 	'<li class="record clearfix"><span class="record-country" data-code="+886">中国台湾</span><span class="record-code">+886</span></li>'
					+ 	'<li class="record clearfix"><span class="record-country" data-code="+852">中国香港</span><span class="record-code">+852</span></li>'
					+ 	'<li class="record clearfix"><span class="record-country" data-code="+55">Brizil</span><span class="record-code">+55</span></li>'
					+ 	'<li class="record clearfix"><span class="record-country" data-code="+91">India</span><span class="record-code">+91</span></li>'
					+ 	'<li class="record clearfix"><span class="record-country" data-code="+62">Indonesia</span><span class="record-code">+62</span></li>'
					+ 	'<li class="record clearfix"><span class="record-country" data-code="+60">Malaysia</span><span class="record-code">+60</span></li>'
					+'</ul></div>';
				that.countryCode.append(str);
				$('.record').on('click',function(){
					var val = $(this).find('.record-country').html();
					var val2 = $(this).find('.record-country').attr('data-code');
					$('.select-result').html( val+'('+val2+')');
				});
				that.countryCode.toggle();
				
				/*var target = e.target;
				if(target != $('.container')){
					that.countryCode.css({display:'none'});
				}*/
			});
				
		},
		phoneInputBlur: function(){
			var that = this;
			this.phoneInput.blur(function(){
				//console.log(that.phoneInput);
				var reg = /^1[358]\d{9}$/;
				if(!reg.test(that.phoneInput.val())){
					that.errTipPhone.css({display:'block'});
					that.errTipPhone.find('span').html('手机号码格式错误');
					that.inputbg.addClass('input-err');
				}else{
					/*判断手机号是否已注册*/
					$.ajax({
						type: 'get',
						url: 'js/phoneInfo.json',
						success: function(phoneInfo){
							var uphone = that.phoneInput.val();
							//console.log(uphone);
							that.vd.uphone = true;
							for(var i in phoneInfo){
								if(phoneInfo[i].uphone == uphone){
									that.vd.uphone = false;
									break;
								}
							}
							if(!that.vd.uphone){
								that.errTipPhone.css({display:'block'});
								that.errTipPhone.find('span').html('该手机号已经注册...');
								that.inputbg.addClass('input-err');
							}else{
								that.errTipPhone.css({display:'none'});
								that.inputbg.removeClass('input-err');
							}
						}
					});
				}
			});
		},
		pswCheck: function(){
			/*
				 密码验证
				长度6-16位
				//不能为同一个字符
				//不能全是数字
				只能有数字、字母和常用特殊字符
			*/
			var that = this;
			this.passwordInput.blur(function(){
				var value = that.passwordInput.val();
				var reg0 = /^(?=.{6,16}$)(?![0-9]+$)(?!.*(.).*\1)[0-9a-zA-Z_！~￥$%@#&+]+$/;
				var reg = new RegExp(reg0);
				var reg1 = /^[\w~!@#$%^&*]{6,16}$/;
				if(!reg1.test(value)){
					that.errTipPsw.css({display:'block'});
					that.errTipPsw.find('span').html('密码格式错误');
					that.password.addClass('input-err');
				}else{
					that.errTipPsw.css({display:'none'});
					that.password.removeClass('input-err');
				}
			});
		},
		checkboxInputBlur: function(){
			var val;
			var that = this;
			//验证码处理
			function switchCode(){
				var str = '';
				var key = parseInt( Math.random()*1000 ) % 8;
				val = that.validate[key].value;
				str = '<img class="chkcode_img" src="'+that.validate[key].src+'" title="看不清换一张" />';
				$('.checknum').html(str);
			}
			switchCode();
			$('.checknum').click(function(){
				switchCode();
			});

			var that = this;
			this.checkboxInput.blur(function(){
				
				if(!that.checkboxInput.val() ||	that.checkboxInput.val() != val){
					that.errTipCheck.css({display:'block'});
					that.errTipCheck.find('span').html('验证码输入错误');
					that.labelbox.addClass('input-err');
				}else{
					that.errTipCheck.css({display:'none'});
					that.labelbox.removeClass('input-err');
					//alert('验证码输入正确');
				}
				
			});
		},
		regBtnClick: function(){
			var that = this;
			this.regBtn.click(function(){
				var flag = true;
				var pV = that.phoneInput.val();
				var pswV = that.passwordInput.val();
				var cV = that.checkboxInput.val();
				if(!pV){
					that.errTipPhone.css({display:'block'});
					that.errTipPhone.find('span').html('请输入手机号');
					that.inputbg.addClass('input-err');
					return;
				}
				if(!cV){
					that.errTipCheck.css({display:'block'});
					that.errTipCheck.find('span').html('请输入验证码');
					that.labelbox.addClass('input-err');
					return;
				}
				if(!pswV){
					that.errTipPsw.css({display:'block'});
					that.errTipPsw.find('span').html('请输入密码');
					that.labelbox.addClass('input-err');
					return;
				}
				
				for(var i in that.vd){
					if(!that.vd[i]){
						flag = flase;
						break;
					}
				}
				
				if(flag){
					//存储手机号及密码  cookie json形式
					alert('验证通过，正在存储数据...');
					var phoneInfo = {
						uphone: that.phoneInput.val(),
						upsw: that.passwordInput.val()
					};
					//将信息存储到cookie中
					$.cookie('phoneInfo',JSON.stringify(phoneInfo),{expires:7,path:'/zhanghonghong'});
					//跳转到登录页面
					location.href = 'login.html';
				}else{
					alert('部分数据不合法');
				}
			});
		}
	}
	register.init();
	
	

});