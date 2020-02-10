const debug = false;

class Video {
	constructor(container) {
		this.states = this.clearStates();

		this.resolution = {
			width: 64,
			height: 32
		};

		this.pixel = {
			width: container.width / 64,
			height: container.height / 32
		};

		this.context = container.getContext(`2d`);
		this.context.fillStyle = `#FFFFFF`;
	}

	// draw the video
	draw(newStates) {
		if (debug) {
			console.log(`Drawing`);
			console.log(newStates);
		}

		for (let i=0;i<this.resolution.width;i++) {
			for (let j=0;j<this.resolution.height;j++) {
				if (newStates[i][j]) {
					this.context.fillRect(i * this.pixel.width, j * this.pixel.height, this.pixel.width, this.pixel.height);
				}
				else {
					this.context.clearRect(i * this.pixel.width, i * this.pixel.height, this.pixel.width, this.pixel.height);
				}
			}
		}

		this.states = newStates;
	}

	// get the current state
	current() {
		return this.states;
	}

	// clear the video
	clear() {
		this.draw(this.clearStates());
	}

	// clear the states
	clearStates() {
		const states = new Array(64);

		for (let i=0;i<64;i++) {
			states[i] = new Array(32);

			for (let j=0;j<32;j++) {
				states[i][j] = false;
			}
		}

		return states;
	}
}

export default Video;
