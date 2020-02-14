class Video {
	constructor(container) {
		this.container = container;

		this.states = this.clearStates();

		this.resolution = {
			width: 64,
			height: 32
		};

		this.pixel = {
			width: container.width / 64,
			height: container.height / 32
		};
	}

	// draw the video
	draw(newStates) {
		const context = this.container.getContext(`2d`);
		context.fillStyle = `#ffffff`;

		for (let x=0;x<this.resolution.width;x++) {
			for (let y=0;y<this.resolution.height;y++) {
				if (newStates[x][y]) {
					context.fillRect(x * this.pixel.width, y * this.pixel.height, this.pixel.width, this.pixel.height);
				}
				else {
					context.clearRect(x * this.pixel.width, y * this.pixel.height, this.pixel.width, this.pixel.height);
				}
			}
		}

		this.states = newStates;
	}

	setDisplaySize(display) {
		this.container = display;
		this.pixel.width = this.container.width / 64;
		this.pixel.height = this.container.height / 32;

		this.draw(this.current());
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

		for (let x=0;x<64;x++) {
			states[x] = new Array(32);

			for (let y=0;y<32;y++) {
				states[x][y] = false;
			}
		}

		return states;
	}
}

export default Video;
