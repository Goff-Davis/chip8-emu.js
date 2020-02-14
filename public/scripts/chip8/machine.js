import Chip8 from './chip8.js';
import Video from './video.js';

class Machine {
	constructor(videoSource, clockRate) {
		this.video = new Video(videoSource);

		this.chip = new Chip8(this.video);
		this.clockRate = clockRate;
		this.stepID = null;
		this.timerID = null;
	}

	// start the chip running at the defined clockrate
	start() {
		if (this.stepID || this.timerID) {
			return;
		}

		this.stepID = window.setInterval(() => {
			this.chip.step();
		}, 1000 / this.clockRate);

		// fixed at 60 Hz
		this.timerID = window.setInterval(() => {
			this.chip.stepTimer();
		}, 1000 / 60);
	}

	// stop the cpu from running
	stop() {
		if (this.stepID) {
			window.clearInterval(this.stepID);
		}

		this.stepID = null;
		this.timerID = null;
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

	// sets the clock rate of the cpu
	setClockRate(rate) {
		this.stop();
		this.clockRate = rate;
		this.start();
	}

	setDisplaySize(width, height, display) {
		this.video.setDisplaySize(width, height, display);
	}

	// load a rom
	boot(rom) {
		this.stop();
		this.chip.load(rom);
		this.start();
	}
}

export default Machine;
