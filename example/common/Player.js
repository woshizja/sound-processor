import {
	SoundProcessor
} from '@sound-processor';
import VisualCanvas from "./VisualCanvas.js";
import '../audio/summer.mp3';
const AudioContext = window.AudioContext || window.webkitAudioContext;
const FFT_SIZE = 1024;
const START_F = 150; //起始频率
const END_F = 6000; //截止频率
const V_TARGETS = 88;


class Player {
	constructor(audio, isSquare) {
		if (!audio) {
			console.error('need a audio dom');
			return;
		}
		this.audio = audio;
		// 创建上下文
		const AC = (this.AC = new AudioContext());

		// 创建analyser实例
		const analyser = (this.analyser = AC.createAnalyser());
		analyser.fftSize = FFT_SIZE;

		// 将audio节点与webaudio实例关联
		const source = AC.createMediaElementSource(this.audio);

		// 连接analyserNode
		source.connect(analyser);
		analyser.connect(AC.destination);
		console.log(AC, analyser);

		// 实例化可视化元素
		this.vc = new VisualCanvas(document.querySelector("#canvas"), isSquare);

		// 实例化音频处理器
		this.soundProcessor = new SoundProcessor({
			filterParams: {
				sigma: 1,
				kernelRadius: 3
			},
			sampleRate: AC.sampleRate,
			fftSize: FFT_SIZE,
			endFrequency: END_F,
			startFrequency: START_F,
			outBandsQty: V_TARGETS
		});

		audio.addEventListener('play', () => {
			this.onPlay();
		});

		audio.addEventListener('pause', () => {
			this.onPause();
		});

		this.refreshFrame = this.refreshFrame.bind(this);
	}

	onPlay() {
		// this.AC.resume().then(() => {
			console.log('resume', this.AC)
			this.paused = false;
			this.refreshFrame();
		// }).catch(e => {
		// 	console.log('eeee', e)
		// });
	}

	onPause() {
		this.paused = true;
	}

	play() {
		console.log('onPlay', this.audio.paused, this.AC.resume)
		if (this.audio && this.audio.paused) {
			this.AC.resume().then(() => {
				console.log('resume', this.AC)
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
		console.log('pause()')
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
		// const smoothAmplitudes = reduce(array, 81);
		return soundProcessor.process(array);
	}
}


export default Player;