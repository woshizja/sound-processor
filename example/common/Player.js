import {
	SoundProcessor
} from '@sound-processor';
import {reduce} from './util.js';
import VisualCanvas from "./VisualCanvas.js";
import '../audio/summer.mp3';
const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;;
const FFT_SIZE = 1024;
const START_F = 150; //起始频率
const END_F = 4500; //截止频率
const V_TARGETS = 81;


class Player {
	constructor(audio, isSquare) {
		if (audio) {
			this.setAudio(audio);
		}

		// 创建上下文
		this.AC = new AudioContext();

		// 创建analyser实例
		this.analyser = this.AC.createAnalyser();
		this.analyser.fftSize = FFT_SIZE;

		// 实例化可视化元素
		this.vc = new VisualCanvas(document.querySelector("#canvas"), isSquare);

		this.refreshFrame = this.refreshFrame.bind(this);
		this.setAudio = this.setAudio.bind(this);
	}

	setAudio(audio, type) {
		if (!audio) {
			console.error('need a audio dom');
			return;
		}
		const {
			AC,
			analyser
		} = this;
		this.audio = audio;

		// 将audio节点与webaudio实例关联
		const source = AC.createMediaElementSource(this.audio);

		// 连接analyserNode
		source.connect(analyser);
		analyser.connect(AC.destination);
		console.log('audio context',AC);
		console.log('analyser', analyser);

		audio.addEventListener('end', this.pause);

		// 实例化音频处理器
		this.soundProcessor = new SoundProcessor({
			filterParams: {
				sigma: 1,
				radius: 2
			},
			sampleRate: AC.sampleRate,
			fftSize: FFT_SIZE,
			endFrequency: END_F,
			startFrequency: type === 2 ? 1000 : START_F,
			outBandsQty: type === 2 ? 1 : V_TARGETS,
			tWeight: true,
			aWeight: true
		});

		console.log('soundProcessor', this.soundProcessor)
	}

	play() {
		if (this.audio && this.audio.paused) {
			this.AC.resume().then(() => {
				this.audio.play();
				this.paused = false;
				this.refreshFrame();
			}).catch(e => {
				console.log('eeee', e)
			});
		} else {
			this.audio.pause();
			this.paused = true;
		}
	}

	pause() {
		if (this.audio && !this.audio.paused) {
			this.audio.pause();
			this.paused = true;
		}
	}

	refreshFrame() {
		const array = this.getFre();
		this.vc.update(array);
		if (!this.paused) {
			window.requestAnimationFrame(this.refreshFrame);
		}
	}

	getFre() {
		const {
			analyser,
			soundProcessor
		} = this;

		const array = new Uint8Array(analyser.frequencyBinCount);
		// 将音频节点的数据拷贝到Uin8Array中
		analyser.getByteFrequencyData(array);
		// return reduce(array.slice(0, array.length / 2), V_TARGETS);
		return soundProcessor.process(array);
	}
}


export default Player;