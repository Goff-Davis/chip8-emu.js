const START_ADDRESS = 0x200;

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

class chip8 {
	constructor() {
		// initial cpu state
		this.v = new Array(16);
		this.i = 0;
		this.pc = START_ADDRESS;
		this.stack = new Array(16);
		this.sp = 0;
		this.delayTimer = 0;
		this.soundTimer = 0;
		this.memory = new Array(4096);
		this.video = new Array(64 * 32);
		this.keypad = new Array(16);

		this.clear();
	}

	// load rom into memory
	// param rom = string
	load(rom) {
		if (typeof rom !== `string`) {
			console.error(`Failed to load rom. Incorrect data type.\nExpected string, recieved ${typeof rom}`);
		}

		this.reset();
		this.copy(START_ADDRESS, rom);
	}

	clear() {
		// clear registers
		this.v.fill(0, 0);

		// clear stack
		this.stack.fill(0, 0);

		// clear memory
		this.memory.fill(0, 0);

		// load fontset
		this.copy(FONTSET_START_ADDRESS, fontset);

		// clear video
		this.video.fill(0, 0);

		// reset keys
		this.keypad.fill(0, 0);

		// reset pc
		this.pc = START_ADDRESS;
	}

	// load data into memory at specified address
	// param start = (unsigned) int
	// param data = string
	copy(start, data) {
		if (typeof start !== `number`) {
			console.error(`Failed to copy data. Incorrect parameter type.\nExpected start to be number, recieved ${typeof start}.\nExpected data to be string, recieved ${typeof data}.`)
		}

		for (let i=0;i<data.length;i++) {
			this.memory[start + i] = data[i];
		}
	}

	// completes one cpu cycle
	cycle() {
		// array for ease of accessing opcode "parameters"
		const opcode = [this.memory[this.pc], this.memory[this.pc+1]];
		this.pc += 2;

		switch(opcode[0] / 0x10) {
			case 0x0:
				switch(opcode[1]) {
					// clears the video
					case 0xE0:
						this.video.fill(0, 0);
						break;
					// return from subroutine
					case 0xEE:
						this.pc = this.stack[--this.sp];
						break;
				}
				break;
			// 1NNN jump to NNN
			case 0x1:
				this.pc = parseInt(opcode.join(``).slice(1));
				break;
			// 2NNN CALL NNN
			case 0x2:
				this.stack[this.sp++] = this.pc;
				this.pc = parseInt(opcode.join(``).slice(1));
				break;
			// 3XKK skip next instruction if VX == KK
			case 0x3:
				const vx = opcode[0] % 0x10;
				const kk = opcode[1];

				if (this.registers[vx] === kk) {
					this.pc += 2;
				}
				break;
			// 4XKK skip next instruction if VX != KK
			case 0x4:
				const vx = opcode[0] % 0x10;
				const kk = opcode[1];

				if (this.registers[vx] !== kk) {
					this.pc += 2;
				}
				break;
			// 5XY0 skip next instruction if VX == VY
			case 0x5:
				const vx = opcode[0] % 0x10;
				const vy = opcode[1] / 0x10;

				if (this.registers[vx] === this.registers[vy]) {
					this.pc += 2;
				}
				break;
			// 6XKK set VX = KK
			case 0x6:
				const vx = opcode[0] % 0x10;
				const kk = opcode[1];

				// need ternary for overflow (no carry)
				this.registers[vx] = kk > 0xFF ? kk-0x100:kk;
				break;
			// 7XKK set VX = VX + KK
			case 0x7:
				const vx = opcode[0] % 0x10;
				const kk = opcode[1];

				this.registers[vx] += kk;
				break;
			case 0x8:
				const n = opcode[1] & 0x0F;

				switch(n) {
					// 8XY0 set VX = VY
					case 0x0:
						const vx = opcode[0] % 0x10;
						const vy = opcode[1] / 0x10;

						this.registers[vx] = this.registers[vy];
						break;
					// 8XY1 set VX = VX OR VY
					case 0x1:
						const vx = opcode[0] % 0x10;
						const vy = opcode[1] / 0x10;

						this.registers[vx] |= this.registers[vy];
						break;
					// 8XY2 set VX = VX AND VY
					case 0x2:
						const vx = opcode[0] % 0x10;
						const vy = opcode[1] / 0x10;

						this.registers[vx] &= this.registers[vy];
						break;
					// 8XY3 set VX = VX XOR VY
					case 0x3:
						const vx = opcode[0] % 0x10;
						const vy = opcode[1] / 0x10;

						this.registers[vx] ^= this.registers[vy];
						break;
					// 8XY4 set VX = VX + VY set VF = carry
					case 0x4:
						const vx = opcode[0] % 0x10;
						const vy = opcode[1] / 0x10;
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
						const vx = opcode[0] % 0x10;
						const vy = opcode[1] / 0x10;

						this.registers[0xF] = this.registers[vx] > this.registers[vy] ? 1:0;

						// @TODO if this creates overflow issues
						this.registers[vx] -= this.registers[vy];
						break;
					// 8XY6 set VX = VX >> 1
					case 0x6:
						const vx = opcode[0] % 0x10;

						this.registers[0xF] = this.registers[vx] % 0x10;
						this.registers[vx] /= 2;
						break;
					// 8XY7 set VX = VY - VX set VF = NOT borrow
					case 0x7:
						const vx = opcode[0] % 0x10;
						const vy = opcode[1] / 0x10;

						this.registers[0xF] = this.registers[vy] > this.registers[vx] ? 1:0;

						// @TODO if this creates overflow issues
						this.registers[vy] -= this.registers[vx];
						break;
					// 8XYE set VX = VX << 1
					case 0xE:
						const vx = opcode[0] % 0x10;

						this.registers[0xF] = this.registers[vx] / 0x10;
						this.registers[vx] *= 2;
						break;
				}
				break;
			// 9XY0 skip next instruction if VX != VY
			case 0x9:
				const vx = opcode[0] % 0x10;
				const vy = opcode[1] / 0x10;

				if (this.registers[vx] !== this.registers[vy]) {
					this.pc += 2;
				}
				break;
			// ANNN set I = NNN
			case 0xA:
				this.i = parseInt(opcode.join(``).slice(1));
				break;
			// 0xBNNN jump to NNN + V0
			case 0xB:
				this.pc = this.registers[0] + parseInt(opcode.join(``).slice(1));
				break;
			// CXKK set VX = random AND KK
			case 0xC:
				const vx = opcode[0] % 0x10;
				const kk = opcode[1];

				// @TODO check that this has same result as unsigned (prob not)
				this.registers[vx] = getRand() & kk;
				break;
			// DXYN draw sprit at VX VY with height N
			// VF = collision with already drawn pixel
			// @TODO this will be wonky with all the bitwise stuff
			// @TODO needs to work with Canvas
			case 0xD:
				break;
			case 0xE:
				switch(opcode[1]) {
					// EX9E skip next instruction if key with value VX is pressed
					// @TODO needs to work with Canvas
					case 0x9E:
						const vx = opcode[0] % 0x10;

						if (this.keypad[this.registers[vx]]) {
							this.px += 2;
						}
						break;
					// EXA1 skip next instruction if key with value VX is not pressed
					// @TODO needs to work with Canvas
					case 0xA1:
						const vx = opcode[0] % 0x10;

						if (!this.keypad[this.registers[vx]]) {
							this.px += 2;
						}
						break;
				}
				break;
			case 0xF:
				switch(opcode[1]) {
					// FX07 set VX = delay timer value
					case 0x07:
						const vx = opcode[0] % 0x10;

						this.registers[vx] = this.delayTimer;
						break;
					// FX0A wait for key press then store key value in VX
					// @TODO needs to work with Canvas
					case 0x0A:
						break;
					// FX15 set delay timer = VX
					case 0x15:
						const vx = opcode[0] % 0x10;

						this.delayTimer = this.registers[vx];
						break;
					// FX18 set sound timer = VX
					case 0x18:
						const vx = opcode[0] % 0x10;

						this.soundTimer = this.registers[vx];
						break;
					// FX1E set I = I + VX
					case 0x1E:
						const vx = opcode[0] % 0x10;

						// @TODO check overflow issues
						this.i += this.registers[vx];
						break;
					// FX29 set I = location of sprite for VX
					case 0x29:
						const vx = opcode[0] % 0x10;

						// 5* because each char is 5 bytes
						this.i = FONTSET_START_ADDRESS + (5 * this.registers[vx]);
						break;
				}
				break;
		}
	}

	// random int between 0 and 255 (inclusive)
	getRand() {
		return Math.floor(Math.random() * 256);
	}
}

export default chip8;
