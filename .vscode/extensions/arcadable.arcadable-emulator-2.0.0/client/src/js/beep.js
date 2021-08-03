audioCtx = new(window.AudioContext || window.webkitAudioContext)();

function beep(volume, frequency, duration) {
	var oscillator = audioCtx.createOscillator();
	var gainNode = audioCtx.createGain();
  

	gainNode.gain.value = volume;
	oscillator.frequency.value = frequency;
	oscillator.type = 1; //0=sine 1=square 2=sawtooth 3=triangle

	oscillator.connect(gainNode);
	gainNode.connect(audioCtx.destination);

	oscillator.start();

	if(duration > 30) {
		setTimeout(() => {
			gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime); 
			gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
			setTimeout(() => {
				oscillator.stop();
			}, 30);
		}, duration - 30);
	} else {
		setTimeout(() => {
			oscillator.stop();
		}, duration);
	}
};