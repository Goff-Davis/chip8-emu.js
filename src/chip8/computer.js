import Chip8 from `./chip8`;
import Video from `./video`;

class Computer {
	constructor(videoSource, audioSource) {
		const video = new Video(videoSource);
		const audio = audioSource ? new Audio(audioSource):null;

		this.chip = new Chip8(video, audio);
		this.clockRate = 300;
		this.stepID = null;
		this.timerID = null;
	}

	start() {

	}

	stop() {
		if (this.stepID) {
			window.clearInterval(this.stepID);
		}

		if (this.timerID) {
			window.clearInterval(this.timerID);
		}

		this.stepID = null;
		this.timerID = null;
	}

	reset() {
		this.stop();
		this.chip.reset();
	}
}

export default Computer;
