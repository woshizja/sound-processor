import './index.less';
import Player from "@common/Player.js";

let inited;
const player = new Player(undefined, 1);
const playBtn = document.querySelector('.play-btn');

playBtn.addEventListener("click", () => {
	if(playBtn.classList.contains('playing')) {
		playBtn.classList.remove('playing');
		playBtn.innerHTML = 'click to play <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="1980" width="18" height="18"><defs><style type="text/css"/></defs><path d="M785.916 378.115C621.622 289.254 522.65 200.413 358.355 111.53 194.06 22.643 111.93 67.101 111.93 244.802v533.194c0 177.75 82.151 222.18 246.425 133.341 164.295-88.93 263.266-177.75 427.56-266.611 164.273-88.862 164.273-177.772 0-266.611z m0 0" p-id="1981" fill="#d84e3c"/></svg>';

		if(inited) {
			player.pause();
		}
	} else {
		playBtn.classList.add('playing');
		playBtn.innerHTML = 'click to stop <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="icon" viewBox="0 0 1024 1024" version="1.1" width="18" height="18"><defs><style type="text/css"/></defs><path d="M352 958H160c-53 0-96-43-96-96V158c0-53 43-96 96-96h192c53 0 96 43 96 96v704c0 53-43 96-96 96z m608-96V158c0-53-43-96-96-96h-192c-53 0-96 43-96 96v704c0 53 43 96 96 96h192c53 0 96-43 96-96z" fill="#999999" p-id="2916"/></svg>';

		if(!inited) {
			inited = true;
			const audio = document.createElement('audio');
			audio.crossOrigin = "anonymous";
			audio.src = require('../audio/gu.mp3');
			player.setAudio(audio);
		}
		player.play();
	}
});

