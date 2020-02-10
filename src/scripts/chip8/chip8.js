const START_ADDRESS = 0x200; // 512

const FONTSET_START_ADDRESS = 0x50;
const FONTSET_SIZE = 80;
const fontset = [
	0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
	0x20, 0x60, 0x20, 0x20, 0x70, // 1
	0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
	0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
	0x90, 0x90, 0xF0, 0x10, 0x10, // 4
	0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
	0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
	0xF0, 0x10, 0x20, 0x40, 0x40, // 7
	0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
	0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
	0xF0, 0x90, 0xF0, 0x90, 0x90, // A
	0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
	0xF0, 0x80, 0x80, 0x80, 0xF0, // C
	0xE0, 0x90, 0x90, 0x90, 0xE0, // D
	0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
	0xF0, 0x80, 0xF0, 0x80, 0x80  // F
];

const VIDEO_HEIGHT = 32;
const VIDEO_WIDTH = 64;

const debug = true;

class Chip8 {
	constructor(video, audio) {
		// initial cpu state
		this.registers = new Array(16);
		this.index = 0;
		this.pc = START_ADDRESS;
		this.stack = new Array(16);
		this.sp = 0;
		this.delayTimer = 0;
		this.soundTimer = 0;
		this.memory = new Array(4096);

		// emulator state
		this.audio = audio;
		this.video = video;
		this.awaitInput = false;
		this.input = 0;

		this.clear();
	}

	// load rom into memory
	load(rom) {
		if (debug) {
			console.log(`Loading rom...`);
		}

		this.clear();
		this.copy(START_ADDRESS, rom);

		console.log(`Loaded.`);
	}

	clear() {
		if (debug) {
			console.log(`Cleared memory.`);
		}

		// clear registers
		this.registers.fill(0, 0);

		// clear stack
		this.stack.fill(0, 0);

		// clear memory
		this.memory.fill(0, 0);

		// load fontset
		this.copy(FONTSET_START_ADDRESS, fontset);

		// clear video
		this.video.clear();

		// reset pc
		this.pc = START_ADDRESS;
	}

	// load data into memory at specified address
	// param start = (unsigned) int
	// param data = string
	copy(start, data) {
		if (debug) {
			console.log(`Copying data...`);
		}

		for (let i=0;i<data.length;i++) {
			this.memory[start + i] = data[i];
		}

		if (debug) {
			console.log(`Copied.`);
		}
	}

	// set the input of the cpu
	setInput(input) {
		this.input = input;
	}

	// run one cpu cycle
	step() {
		if (this.awaitInput) {
			return;
		}

		this.cycle();
	}

	// random int between 0 and 255 (inclusive)
	getRand() {
		return Math.floor(Math.random() * 256);
	}

	byteToSwitch(byte) {
		return [
			(byte & 0x80) == 0x80,
			(byte & 0x40) == 0x40,
			(byte & 0x20) == 0x20,
			(byte & 0x10) == 0x10,
			(byte & 0x08) == 0x08,
			(byte & 0x04) == 0x04,
			(byte & 0x02) == 0x02,
			(byte & 0x01) == 0x01
		];
	}

	dump() {
		console.log(this);
	}

	// completes one cpu cycle
	cycle() {
		// array for ease of accessing opcode "parameters"
		const opcode = [this.memory[this.pc], this.memory[this.pc+1]];

		if (debug) {
			// set back 2 to see originating spot
			console.log(`pc: ${this.pc}\nopcode: ${opcode[0].toString(16)} ${opcode[1].toString(16)}`);
		}

		if (this.pc >= 0xFFE) {
			this.pc = START_ADDRESS;
		}
		else {
			this.pc += 2;
		}

		this.execute(opcode);

		// decrement the timers
		if (this.delayTimer > 0) {
			this.delayTimer--;
		}

		if (this.soundTimer > 0) {
			if (--this.soundTimer === 0) {
				if (this.audio) {
					this.audio.play();
				}
			}
		}
	}

	execute(opcode) {
		const vx = Math.floor(opcode[0] % 0x10);
		const vy = Math.floor(opcode[1] / 0x10);
		const kk = opcode[1];
		const nnn = ((opcode[0] % 0x10) * 0x100) + opcode[1];
		const n = opcode[1] & 0x0F;

		switch(Math.floor(opcode[0] / 0x10)) {
			case 0x0:
				switch(opcode[1]) {
					// clears the video
					case 0xE0:
						this.video.clear();
						break;
					// return from subroutine
					case 0xEE:
						this.pc = this.stack[--this.sp];
						break;
				}
				break;
			// 1NNN jump to NNN
			case 0x1:
				this.pc = nnn;
				break;
			// 2NNN CALL NNN
			case 0x2:
				this.stack[this.sp++] = this.pc;
				this.pc = nnn;
				break;
			// 3XKK skip next instruction if VX == KK
			case 0x3:
				if (this.registers[vx] === kk) {
					this.pc += 2;
				}
				break;
			// 4XKK skip next instruction if VX != KK
			case 0x4:
				if (this.registers[vx] !== kk) {
					this.pc += 2;
				}
				break;
			// 5XY0 skip next instruction if VX == VY
			case 0x5:
				if (this.registers[vx] === this.registers[vy]) {
					this.pc += 2;
				}
				break;
			// 6XKK set VX = KK
			case 0x6:
				// need ternary for overflow (no carry)
				this.registers[vx] = kk > 0xFF ? kk-0x100:kk;
				break;
			// 7XKK set VX = VX + KK
			case 0x7:
				this.registers[vx] += kk;
				break;
			case 0x8:
				switch(n) {
					// 8XY0 set VX = VY
					case 0x0:
						this.registers[vx] = this.registers[vy];
						break;
					// 8XY1 set VX = VX OR VY
					case 0x1:
						this.registers[vx] |= this.registers[vy];
						break;
					// 8XY2 set VX = VX AND VY
					case 0x2:
						this.registers[vx] &= this.registers[vy];
						break;
					// 8XY3 set VX = VX XOR VY
					case 0x3:
						this.registers[vx] ^= this.registers[vy];
						break;
					// 8XY4 set VX = VX + VY set VF = carry
					case 0x4:
						const sum = this.registers[vx] + this.registers[vy];

						if (sum > 0xFF) {
							this.registers[0xF] = 1;
						}
						else {
							this.registers[0xF] = 0;
						}

						this.registers[vx] = sum % 0x100;
						break;
					// 8XY5 set VX = VX - VY set VF = NOT borrow
					case 0x5:
						this.registers[0xF] = this.registers[vx] > this.registers[vy] ? 1:0;

						// @TODO if this creates overflow issues
						this.registers[vx] -= this.registers[vy];
						break;
					// 8XY6 set VX = VX >> 1
					case 0x6:
						this.registers[0xF] = this.registers[vx] % 0x10;
						this.registers[vx] /= 2;
						break;
					// 8XY7 set VX = VY - VX set VF = NOT borrow
					case 0x7:
						this.registers[0xF] = this.registers[vy] > this.registers[vx] ? 1:0;

						// @TODO if this creates overflow issues
						this.registers[vy] -= this.registers[vx];
						break;
					// 8XYE set VX = VX << 1
					case 0xE:
						this.registers[0xF] = Math.floor(this.registers[vx] / 0x10);
						this.registers[vx] *= 2;
						break;
				}
				break;
			// 9XY0 skip next instruction if VX != VY
			case 0x9:
				if (this.registers[vx] !== this.registers[vy]) {
					this.pc += 2;
				}
				break;
			// ANNN set I = NNN
			case 0xA:
				this.index = nnn;
				break;
			// 0xBNNN jump to NNN + V0
			case 0xB:
				this.pc = this.registers[0] + nnn;
				break;
			// CXKK set VX = random AND KK
			case 0xC:
				// @TODO check that this has same result as unsigned (prob not)
				this.registers[vx] = getRand() & kk;
				break;
			// DXYN draw sprit at VX VY with height N
			// VF = collision with already drawn pixel
			case 0xD:
				const states = this.video.current();

				for (let row=0;row<n;row++) {
					const sprite = this.memory[this.index+row];
					const pixelStates = this.byteToSwitch(sprite);

					this.registers[0xF] = 0;

					for (let column=0;column<8;column++) {
						const position = {
							x: this.registers[vx] + row,
							y: this.registers[vy] + column
						};

						if (position.x > 63) {
							position.x -= 64;
						}

						if (position.y > 31) {
							position.y -= 32;
						}

						if (pixelStates[column]) {
							let result = true;

							if (states[position.x][position.y] === pixelStates[column]) {
								result = false;
								this.registers[0xF] = 1;
							}

							states[position.x][position.y] = result;
						}
					}
				}

				this.video.draw(states);
				break;
			case 0xE:
				switch(opcode[1]) {
					// EX9E skip next instruction if key with value VX is pressed
					case 0x9E:
						if (this.registers[vx] === this.input) {
							this.pc += 2;
						}
						break;
					// EXA1 skip next instruction if key with value VX is not pressed
					case 0xA1:
						if (this.registers[vx] !== this.input) {
							this.pc += 2;
						}
						break;
				}
				break;
			case 0xF:
				switch(opcode[1]) {
					// FX07 set VX = delay timer value
					case 0x07:
						this.registers[vx] = this.delayTimer;
						break;
					// FX0A wait for key press then store key value in VX
					case 0x0A:
						if (this.awaitInput) {
							this.registers[vx] = this.input;
						}
						break;
					// FX15 set delay timer = VX
					case 0x15:
						this.delayTimer = this.registers[vx];
						break;
					// FX18 set sound timer = VX
					case 0x18:
						this.soundTimer = this.registers[vx];
						break;
					// FX1E set I = I + VX
					case 0x1E:
						// @TODO check overflow issues
						this.index += this.registers[vx];
						break;
					// FX29 set I = location of sprite for VX
					case 0x29:
						// 5* because each char is 5 bytes
						this.index = FONTSET_START_ADDRESS + (5 * this.registers[vx]);
						break;
					// FX33 store BCD of VX in I, I+1, and I+2
					case 0x33:
						let value = this.registers[vx];

						// ones
						this.memory[this.index+2] = value % 10;
						value /= 10;

						// tens
						this.memory[this.index+1] = value % 10;
						value /= 10;

						// hundreds
						this.memory[this.index] = value % 10;
						break;
					// FX55 store V0 through VX in memory starting at I
					case 0x55:
						for (let i=0;i<vx;i++) {
							this.memory[this.index+i] = this.registers[i];
						}
						break;
					// FX65 read V0 through VX from memory starting at I
					case 0x65:
						for (let i=0;i<vx;i++) {
							this.registers[i] = this.memory[this.index+i];
						}
						break;
				}
				break;
			default:
				console.error(`Error, undefined opcode ${opcode[0].toString(16)}${opcode[1].toString(16)}`);
		}
	}
}

export default Chip8;
