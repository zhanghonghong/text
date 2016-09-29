$(function(){
	var passwordInput = $('.password input');
	var usernameInput = $('.username input');
	var errTipPhone = $('.err_tip_phone');
	var errTipPsw = $('.err_tip_psw');
	var ercodeArea = $('.ercode_area');
	var ercode = $('.ercode');
	var btn = $('.btn');
	var close = $('.code_close');
	var validate = {
		uphone: true,
		upsw: true
	};
	var flag = true;
	var pswValue = '';
	
	//二维码登录
	ercode.click(function(){
		ercodeArea.css({display:'block'});
	});
	close.click(function(){
		ercodeArea.css({display:'none'});
	});
	
	
	
	//验证用户名是否合法
	usernameInput.blur(function(){
		$.getJSON("js/phoneInfo.json",function(phoneInfo){
			validate.uphone = true;
			var uphone = usernameInput.val();
			for(var i in phoneInfo){
				//console.log(uphone);
				//console.log(JSON.stringify(phoneInfo[i].uphone) == uphone);
				if(JSON.stringify(phoneInfo[i].uphone) == uphone){
					errTipPhone.css({display:'none'});
					$('.username').removeClass('input-err');
					pswValue = JSON.stringify(phoneInfo[i].upsw);
					console.log(JSON.stringify(phoneInfo[i].upsw));
					return;
				}else{
					errTipPhone.css({display:'block'});
					$('.username').addClass('input-err');
					validate.uphone = false;
				}
			}
		});
		
		//验证密码是否合法
		passwordInput.blur(function(){
			$.getJSON("js/phoneInfo.json",function(phoneInfo){
				validate.uphone = true;
				var upsw = passwordInput.val();
					if( pswValue == upsw){
						errTipPsw.css({display:'none'});
						$('.password').removeClass('input-err');
						return;
					}else{
						errTipPsw.css({display:'block'});
						$('.password').addClass('input-err');
						validate.uphone = false;
					}
			});
			
		});
		
		
	});
	
	

	//提交判断
	btn.click(function(){
		var flag = true;
		for(var i in validate){
			if(!validate[i]){
				alert('输入信息不合法');
				break;
			}else{
				alert('登录成功，正在跳转...');
				location.href = 'index.html';
			}
		}
	});


});