////////////////////////////////////////////////////////////
// INIT
////////////////////////////////////////////////////////////
 var stageWidth,stageHeight=0;
 var isLoaded=false;
 
 /*!
 * 
 * DOCUMENT READY
 * 
 */
 $(function() {
	  var resumeAudioContext = function() {
		try {
			if (typeof createjs !== 'undefined' && createjs.WebAudioPlugin && createjs.WebAudioPlugin.context) {
				if (createjs.WebAudioPlugin.context.state === "suspended" || createjs.WebAudioPlugin.context.state === "interrupted") {
					createjs.WebAudioPlugin.context.resume().catch(function(){});
				}
			}
		} catch (e) {
			// Web audio context not initialized yet
		}
	};
	window.addEventListener("click", resumeAudioContext);
	window.addEventListener("touchstart", resumeAudioContext);
	window.addEventListener("pointerdown", resumeAudioContext);
	window.addEventListener("keydown", resumeAudioContext);
	 
	 // Check for running exported on file protocol
	if (window.location.protocol.substr(0, 4) === "file"){
		alert("To install the game just upload folder 'game' to your server. The game won't run locally with some browser like Chrome due to some security mode.");
	}
	 
	 
	 $(window).resize(function(){
		resizeLoaderFunc();
	 });
	 resizeLoaderFunc();
	 checkBrowser();
});

/*!
 * 
 * LOADER RESIZE - This is the function that runs to centeralised loader when resize
 * 
 */
 function resizeLoaderFunc(){
	stageWidth=$(window).width();
	stageHeight=$(window).height();
	
	$('#mainLoader').css('left', checkContentWidth($('#mainLoader')));
	$('#mainLoader').css('top', checkContentHeight($('#mainLoader')));
 }

/*!
 * 
 * BROWSER DETECT - This is the function that runs for browser and feature detection
 * 
 */
var browserSupport=false;
var isTablet;
function checkBrowser(){
	isTablet = (/ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase()));
	deviceVer=getDeviceVer();
	
	var canvasEl = document.createElement('canvas');
	if(canvasEl && canvasEl.getContext){ 
	  browserSupport=true;
	}
	
	if(browserSupport){
		if(!isLoaded){
			isLoaded=true;
			initPreload();
		}
	}else{
		//browser not support
		$('#notSupportHolder').show();
	}
}