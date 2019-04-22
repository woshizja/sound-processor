import './index.less';
import Player from "@common/Player.js";


const realAudio = document.querySelector("#audio");
const player = new Player(realAudio);

window.addEventListener("click", () => {
	// player.play();
});

