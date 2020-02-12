import Chip8 from './chip8.js';
import Video from './video.js';

const debug = false;

class Machine {
	constructor(videoSource, audioSource, clockRate) {
		const video = new Video(videoSource);
		const audio = audioSource ? new Audio(audioSource):null;

		this.chip = new Chip8(video, audio);
		this.clockRate = clockRate;
		this.stepID = null;
		this.timerID = null;
	}

	// start the chip running at the defined clockrate
	start() {
		if (debug) {
			console.log(`Starting machine...`);
		}

		if (this.stepID || this.timerID) {
			if (debug) {
				console.log(`Cancel start.\nstepID: ${this.stepID}\n`);
			}

			return;
		}

		this.stepID = window.setInterval(() => {
			this.chip.step();
		}, 1000 / this.clockRate);

		// fixed at 60 Hz
		this.timerID = window.setInterval(() => {
			this.chip.stepTimer();
		}, 1000 / 60);

		if (debug) {
			console.log(`Started.\nstepID: ${this.stepID}`);
			this.chip.dump();
		}
	}

	// stop the cpu from running
	stop() {
		if (debug) {
			console.log(`Stopping...`);
		}

		if (this.stepID) {
			window.clearInterval(this.stepID);
		}

		this.stepID = null;
		this.timerID = null;

		if (debug) {
			console.log(`Stopped.`);
		}
	}

	// stop running and reset the cpu
	reset() {
		if (debug) {
			console.log(`Resetting...`);
		}

		this.stop();
		this.chip.reset();
	}

	// set the cpu input
	setInput(input) {
		this.chip.setInput(input);
	}

	setClockRate(rate) {
		this.stop();
		this.clockRate = rate;
		this.start();
	}

	// load a rom
	boot(rom) {
		if (debug) {
			console.log(`Booting...`);
		}

		this.stop();
		this.chip.load(rom);
		this.start();
	}
}

export default Machine;
