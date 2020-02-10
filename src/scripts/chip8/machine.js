import Chip8 from './chip8.js';
import Video from './video.js';

class Machine {
	constructor(videoSource, audioSource) {
		const video = new Video(videoSource);
		const audio = audioSource ? new Audio(audioSource):null;

		this.chip = new Chip8(video, audio);
		this.clockRate = 300;
		this.stepID = null;
	}

	// start the chip running at the defined clockrate
	start() {
		if (this.stepID || this.timerID) {
			return;
		}

		this.stepID = window.setInterval(() => {
			this.chip.step();
		}, 1000 / this.clockRate);
	}

	// stop the cpu from running
	stop() {
		if (this.stepID) {
			window.clearInterval(this.stepID);
		}

		this.stepID = null;
	}

	// stop running and reset the cpu
	reset() {
		this.stop();
		this.chip.reset();
	}

	// set the cpu input
	setInput(input) {
		this.chip.setInput(input);
	}

	// load a rom
	boot(rom) {
		this.stop();
		this.chip.load(rom);
		this.start();
	}
}

export default Machine;
