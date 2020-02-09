class Video {
	constructor(container) {
		this.states = this.clearStates();

		this.resolution = {
			width: 64,
			height: 32
		};

		this.pixels = {
			width: container.width / 64,
			height: container.height / 32
		};

		this.context = container.getContext(`2d`);
		this.context.fillStyle = `#FFFFFF`;
	}

	draw(newStates) {
		for (let i=0;i<this.resolution.width;i++) {
			for (let j=0;j<this.resolution.height;j++) {
				if (newStates[i][j]) {
					this.context.fillRect(i * this.pixels.width, j * this.pixels.height, this.pixels.width, this.pixels.height);
				}
				else {
					this.context.clearRect(i * this.pixels.width, i * this.pixels.height, this.pixels.width, this.pixels.height);
				}
			}
		}
	}

	current() {
		return this.states;
	}

	clear() {
		this.draw(this.clearStates());
	}

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
