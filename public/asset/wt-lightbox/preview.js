$(window).load(function() {
	function update() {
		//clear html
		$("#ts a").wtLightBox('destroy').removeData().unbind('click');
		$('#ts').thumbScroller('destroy');		
		$main.empty().html(html);
		
		//init params
		var params = {
			'orientation':$orientation.filter(":checked").val(),
			'captionEffect':$captionEffect.val(),
			'captionPosition':$captionPosition.filter(":checked").val(),
			'captionAlign':$captionAlign.filter(":checked").val(),
			'easing':$easing.val(),
			'control':$control.val(),						
			'navButtons':$navButtons.val(),
			'playButton':$playButton.prop("checked"),
			'captionButton':$captionButton.prop("checked"),
			'pageInfo':$pageInfo.prop("checked"),
			'pauseOnHover':$pauseOnHover.prop("checked"),
			'shuffle':$shuffle.prop("checked")
		};
		
		$main.toggleClass('span12', 'horizontal' === params['orientation']).toggleClass('span3', 'vertical' === params['orientation']);
		
		//set options
		$('#ts').thumbScroller($.extend({}, settings, params));		
		if ($lightbox.prop("checked")) {
			$("#ts a").css({cursor:'pointer'}).wtLightBox('init').wtLightBox(lbSettings);
		}
		else {
			$("#ts a").css({cursor:'default'}).bind('click', function() { return false; });
		}
	}
	
	var $main = $(".main"),
		html = $main.html(),
		$orientation = $(":input[name='orientation']"),
		$captionEffect = $(":input[name='captionEffect']"),		
		$captionPosition = $(":input[name='captionPosition']"),
		$captionAlign = $(":input[name='captionAlign']"),
		$easing = $(":input[name='easing']"),		
		$control = $(":input[name='control']"),		
		$navButtons = $(":input[name='navButtons']"),
		$lightbox = $(":input[name='lightbox']"),
		$playButton = $(":input[name='playButton']"),
		$captionButton = $(":input[name='captionButton']"),
		$pageInfo = $(":input[name='pageInfo']"),
		$pauseOnHover = $(":input[name='pauseOnHover']"),
		$shuffle = $(":input[name='shuffle']");
		
	$(":button[name='submit']").click(update);
	
	$(":button[name='reset']").click(function() {
		$orientation.filter("[value='horizontal']").prop("checked", true);
		$captionEffect.val("fade");
		$captionPosition.filter("[value='inside']").prop("checked", true);
		$captionAlign.filter("[value='bottom']").prop("checked", true);
		$easing.val("swing");		
		$control.val("index");
		$navButtons.val("normal");
		$lightbox.prop("checked", true);
		$playButton.prop("checked", true);
		$captionButton.prop("checked", false);
		$pageInfo.prop("checked", true);
		$pauseOnHover.prop("checked", false);
		$shuffle.prop("checked", false);
		
		$(':input').attr('disabled', false);
		
		update();
	});
	
	$captionPosition.change(function() {
		var isOutside = ('outside' === $(this).filter(":checked").val());							 
		$captionEffect.add($captionButton).attr('disabled', isOutside);
	});
	
	var settings = {
		slideWidth:253,
		slideHeight:169,
		slideMargin:4,
		slideBorder:8,
		responsive:true,
		captionEffect:'fade',
		mousewheel:true,
		keyboard:true,
		swipe:true,
		title:'Lorem Ipsum'
	};

	var lbSettings = {
		responsive:true,
		autoPlay:false,
		delay:4000,
		speed:600,
		navButtons:'mouseover',
		playButton:true,
		numberInfo:true,					
		timer:true,
		captionPosition:'inside',
		mousewheel:true,
		keyboard:true,
		swipe:true
	};

	$('#ts').thumbScroller(settings);
	$("#ts a").wtLightBox(lbSettings);
});