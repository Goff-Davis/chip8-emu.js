import Chip8 from `./chip8`;
import Video from `./video`;

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
			this.cpu.step();
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
		this.cpu.setInput(input);
	}

	// load a rom
	// Param rom = string
	boot(rom) {
		this.stop();
		this.cpu.loadRom(rom);
		this.start();
	}
}

export default Machine;
