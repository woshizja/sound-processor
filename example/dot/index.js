import './index.less';
import Player from "@common/Player.js";


const realAudio = document.querySelector("#audio");
console.log('square')
const player = new Player(realAudio, true);

window.addEventListener("click", () => {
	player.play();
});

