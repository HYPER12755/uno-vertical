//////////////////////////////////////////////////////////
// SOUND
//////////////////////////////////////////////////////////
var enableDesktopSound = true; //sound for dekstop
var enableMobileSound = true; //sound for mobile and tablet

var soundOn;
var soundMute = false;
var musicMute = false;

$.sound = {};
var soundID = 0;
var soundPushArr = [];
var soundLoopPushArr = [];
var musicPushArr = [];

var lastSoundPlayTimes = {};

var soundAliases = {
	'soundTurn': 'soundAlert',
	'musicMain': 'musicGame'
};

function tryResumeAudioContext() {
	try {
		if (typeof createjs !== 'undefined' && createjs.WebAudioPlugin && createjs.WebAudioPlugin.context) {
			if (createjs.WebAudioPlugin.context.state === 'suspended' || createjs.WebAudioPlugin.context.state === 'interrupted') {
				createjs.WebAudioPlugin.context.resume().catch(function(){});
			}
		}
	} catch (e) {}
}

function playSound(soundName, vol){
	tryResumeAudioContext();
	soundName = soundAliases[soundName] || soundName;
	if(soundOn && !soundMute && typeof createjs !== 'undefined' && createjs.Sound){
		var now = Date.now();
		if (lastSoundPlayTimes[soundName] && (now - lastSoundPlayTimes[soundName] < 45)) {
			return; // Debounce rapid duplicated sound calls
		}
		lastSoundPlayTimes[soundName] = now;

		var thisSoundID = soundID;
		soundPushArr.push(thisSoundID);
		soundID++;

		var defaultVol = vol == undefined ? 1 : vol;
		try {
			var instance = createjs.Sound.play(soundName);
			if (instance) {
				$.sound[thisSoundID] = instance;
				$.sound[thisSoundID].defaultVol = defaultVol;
				setSoundVolume(thisSoundID);
				
				$.sound[thisSoundID].removeAllEventListeners();
				$.sound[thisSoundID].addEventListener ("complete", function() {
					var removeSoundIndex = soundPushArr.indexOf(thisSoundID);
					if(removeSoundIndex != -1){
						soundPushArr.splice(removeSoundIndex, 1);
					}
					delete $.sound[thisSoundID];
				});
			}
		} catch (e) {
			console.warn("playSound error:", e);
		}
	}
}

function playSoundLoop(soundName){
	tryResumeAudioContext();
	soundName = soundAliases[soundName] || soundName;
	if(soundOn && typeof createjs !== 'undefined' && createjs.Sound){
		if($.sound[soundName]==null){
			soundLoopPushArr.push(soundName);

			try {
				var instance = createjs.Sound.play(soundName);
				if (instance) {
					$.sound[soundName] = instance;
					$.sound[soundName].defaultVol = 1;
					setSoundLoopVolume(soundName);

					$.sound[soundName].removeAllEventListeners();
					$.sound[soundName].addEventListener ("complete", function() {
						if ($.sound[soundName]) {
							$.sound[soundName].play();
						}
					});
				}
			} catch (e) {
				console.warn("playSoundLoop error:", e);
			}
		}
	}
}

function toggleSoundLoop(soundName, con){
	soundName = soundAliases[soundName] || soundName;
	if(soundOn){
		if($.sound[soundName]!=null){
			if(con){
				$.sound[soundName].play();
			}else{
				$.sound[soundName].paused = true;
			}
		}
	}
}

function stopSoundLoop(soundName){
	soundName = soundAliases[soundName] || soundName;
	if(soundOn){
		if($.sound[soundName]!=null){
			$.sound[soundName].stop();
			$.sound[soundName]=null;

			var soundLoopIndex = soundLoopPushArr.indexOf(soundName);
			if(soundLoopIndex != -1){
				soundLoopPushArr.splice(soundLoopIndex, 1);
			}
		}
	}
}

function playMusicLoop(soundName){
	tryResumeAudioContext();
	soundName = soundAliases[soundName] || soundName;
	if(soundOn && typeof createjs !== 'undefined' && createjs.Sound){
		if($.sound[soundName]==null){
			musicPushArr.push(soundName);

			try {
				var instance = createjs.Sound.play(soundName);
				if (instance) {
					$.sound[soundName] = instance;
					$.sound[soundName].defaultVol = 1;
					setMusicVolume(soundName);

					$.sound[soundName].removeAllEventListeners();
					$.sound[soundName].addEventListener ("complete", function() {
						if ($.sound[soundName]) {
							$.sound[soundName].play();
						}
					});
				}
			} catch (e) {
				console.warn("playMusicLoop error:", e);
			}
		}
	}
}

function toggleMusicLoop(soundName, con){
	soundName = soundAliases[soundName] || soundName;
	if(soundOn){
		if($.sound[soundName]!=null){
			if(con){
				$.sound[soundName].play();
			}else{
				$.sound[soundName].paused = true;
			}
		}
	}
}

function stopMusicLoop(soundName){
	soundName = soundAliases[soundName] || soundName;
	if(soundOn){
		if($.sound[soundName]!=null){
			$.sound[soundName].stop();
			$.sound[soundName]=null;

			var soundLoopIndex = musicPushArr.indexOf(soundName);
			if(soundLoopIndex != -1){
				musicPushArr.splice(soundLoopIndex, 1);
			}
		}
	}
}

function stopSound(){
	if (typeof createjs !== 'undefined' && createjs.Sound) {
		createjs.Sound.stop();
	}
}

function toggleSoundInMute(con){
	if(soundOn){
		soundMute = con;
		for(var n=0; n<soundPushArr.length; n++){
			setSoundVolume(soundPushArr[n]);
		}
		for(var n=0; n<soundLoopPushArr.length; n++){
			setSoundLoopVolume(soundLoopPushArr[n]);
		}
		setAudioVolume();
	}
}

function toggleMusicInMute(con){
	if(soundOn){
		musicMute = con;
		for(var n=0; n<musicPushArr.length; n++){
			setMusicVolume(musicPushArr[n]);
		}
	}
}

function setSoundVolume(id, vol){
	if(soundOn){
		var soundIndex = soundPushArr.indexOf(id);
		if(soundIndex != -1 && $.sound[soundPushArr[soundIndex]]){
			var defaultVol = vol == undefined ? $.sound[soundPushArr[soundIndex]].defaultVol : vol;
			var volume = soundMute == false ? defaultVol : 0;
			$.sound[soundPushArr[soundIndex]].volume = volume;
			$.sound[soundPushArr[soundIndex]].defaultVol = defaultVol;
		}
	}
}

function setSoundLoopVolume(soundLoop, vol){
	if(soundOn){
		var soundLoopIndex = soundLoopPushArr.indexOf(soundLoop);
		if(soundLoopIndex != -1 && $.sound[soundLoopPushArr[soundLoopIndex]]){
			var defaultVol = vol == undefined ? $.sound[soundLoopPushArr[soundLoopIndex]].defaultVol : vol;
			var volume = soundMute == false ? defaultVol : 0;
			$.sound[soundLoopPushArr[soundLoopIndex]].volume = volume;
			$.sound[soundLoopPushArr[soundLoopIndex]].defaultVol = defaultVol;
		}
	}
}

function setMusicVolume(soundLoop, vol){
	if(soundOn){
		var musicIndex = musicPushArr.indexOf(soundLoop);
		if(musicIndex != -1 && $.sound[musicPushArr[musicIndex]]){
			var defaultVol = vol == undefined ? $.sound[musicPushArr[musicIndex]].defaultVol : vol;
			var volume = musicMute == false ? defaultVol : 0;
			$.sound[musicPushArr[musicIndex]].volume = volume;
			$.sound[musicPushArr[musicIndex]].defaultVol = defaultVol;
		}
	}
}

/*!
 * 
 * PLAY AUDIO - This is the function that runs to play questiona and answer audio
 * 
 */
var audioFile = null;
function playAudio(audioName, callback){
	tryResumeAudioContext();
	audioName = soundAliases[audioName] || audioName;
	if(soundOn && typeof createjs !== 'undefined' && createjs.Sound){
		if(audioFile==null){
			audioFile = createjs.Sound.play(audioName);
			if (audioFile) {
				setAudioVolume();

				audioFile.removeAllEventListeners();
				audioFile.addEventListener ("complete", function(event) {
					audioFile = null;
					
					if (typeof callback == "function")
						callback();
				});
			}
		}
	}
}

function stopAudio(){
	if(soundOn){
		if(audioFile != null){
			audioFile.stop();
			audioFile = null;
		}
	}
}

function setAudioVolume(){
	if(soundOn){
		if(audioFile != null){
			var volume = soundMute == false ? 1 : 0;
			audioFile.volume = volume;
		}
	}
}